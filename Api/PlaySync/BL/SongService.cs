using BL.Validators;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DL;
using DL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.ComponentModel;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;

namespace BL
{
    public class SongService
    {
        private readonly ApplicationDbContext _context;

        private readonly Cloudinary _cloudinary;

        private readonly ILogger<SongService> _logger;

        public SongService(ApplicationDbContext context, Cloudinary cloudinary, ILogger<SongService> logger)
        {
            _context = context;
            _cloudinary = cloudinary;
            _logger = logger;
        }

        private async Task<string?> BackupSongToCloudinaryAsync(IFormFile file)
        {
            return await ExecuteSafeAsync(async () =>
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "music_backups"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult?.SecureUrl == null)
                {
                    _logger.LogError("Backup upload failed: SecureUrl is null");
                    throw new Exception("Backup upload failed, SecureUrl is null.");
                }

                return uploadResult.SecureUrl.AbsoluteUri;
            });
        }
        public async Task<string?> UploadFileToCloudinaryAsync(IFormFile file)
        {
            return await ExecuteSafeAsync(async () =>
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "music_files"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult?.SecureUrl == null)
                {
                    _logger.LogError("Upload failed: SecureUrl is null");
                    throw new Exception("Upload failed, SecureUrl is null.");
                }
                return uploadResult.SecureUrl.AbsoluteUri;
            });
        }
        private async Task<T?> ExecuteSafeAsync<T>(Func<Task<T>> action)
        {
            try
            {
                return await action();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred: {ex.Message}");
                throw;
            }
        }
        private async Task ExecuteSafeAsync(Func<Task> action)
        {
            try
            {
                await action();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred: {ex.Message}");
                throw;
            }
        }



        public async Task<Song?> UploadSongAsync(IFormFile file, string title, string artist, string genre, int userId)
        {
            return await ExecuteSafeAsync(async () =>
            {
                SongValidator.ValidateFile(file);
                var cloudinaryUrl = await UploadFileToCloudinaryAsync(file);
                var backupUrl = await BackupSongToCloudinaryAsync(file);
                var song = new Song
                {
                    Title = title,
                    Artist = artist,
                    Genre = genre,
                    CloudinaryUrl = cloudinaryUrl ?? string.Empty,
                    BackupUrl = backupUrl ?? string.Empty,
                    UserId = userId
                };
                SongValidator.ValidateSong(song);
                _context.Songs.Add(song);
                await _context.SaveChangesAsync();
                return song;
            });
        }



        public async Task<Song?> AddSongAsync(Song song)//adding without keeping in the cloud
        {

            return await ExecuteSafeAsync(async () =>
            {
                SongValidator.ValidateSong(song);
                _context.Songs.Add(song);
                await _context.SaveChangesAsync();
                return song;
            });


        }

        public async Task DeleteSongAsync(int songId, int userId, bool isAdmin)
        {
            await ExecuteSafeAsync(async () =>
            {
                var song = await _context.Songs.FindAsync(songId);
                if (song == null)
                    throw new ArgumentException("Song not found.");

                if (song.UserId != userId && !isAdmin)
                {

                    _logger.LogWarning($"Unauthorized delete attempt by UserId {userId}");
                    throw new UnauthorizedAccessException("You are not authorized to delete this song.");
                }
                if (!string.IsNullOrEmpty(song.CloudinaryPublicId))
                {
                    var deletionParams = new DeletionParams(song.CloudinaryPublicId);
                    var result = await _cloudinary.DestroyAsync(deletionParams);
                    if (result.Result != "ok")
                    {
                        _logger.LogWarning($"Failed to delete file from Cloudinary: {result.Result}");
                    }
                }
                if (!string.IsNullOrEmpty(song.BackupUrl))
                {
                    var deleteParams = new DeletionParams(song.BackupUrl);
                    var backupDeleteParams = await _cloudinary.DestroyAsync(deleteParams);
                    if (backupDeleteParams.Result != "ok")
                    {
                        _logger.LogWarning($"Failed to delete file from Cloudinary: {backupDeleteParams.Result}");
                    }
                }
                _context.Songs.Remove(song);
                await _context.SaveChangesAsync();
            });

        }



        public Task<Song?> GetSongBySongIdAsync(int songId) =>
        ExecuteSafeAsync(() =>
           _context.Songs.Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == songId)
           );




        public async Task<List<Song>> GetAllSongsAsync()
        {
            try
            {
                return await _context.Songs.Include(s => s.User).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching all songs{ex.Message}");
                return new List<Song>();
            }
        }



        public async Task<Song?> UpdateSongAsync(int songId, SongRequestDto dto)
        {
            return await ExecuteSafeAsync(async () =>
            {

                var song = await _context.Songs.FindAsync(songId);
                
                if (song != null&&song.UserId != dto.UserId)
                    throw new UnauthorizedAccessException("No permition to update this song");

                if (SongValidator.ValidateFile(dto.File))
                {

                    var newBackupUrl = await BackupSongToCloudinaryAsync(dto.File);
                    if (!string.IsNullOrEmpty(song.CloudinaryPublicId))
                    {
                        await _cloudinary.DestroyAsync(new DeletionParams(song.CloudinaryPublicId));
                    }
                    var uploadParams = new RawUploadParams
                    {
                        File = new FileDescription(dto.File.FileName, dto.File.OpenReadStream()),
                        Folder = "music_files"
                    };
                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult?.SecureUrl == null)
                    {
                        throw new Exception("Update failed, SecureUrl is null.");
                    }
                    song.CloudinaryUrl = uploadResult.SecureUrl.ToString();
                    song.CloudinaryPublicId = uploadResult.PublicId;
                    song.BackupUrl = newBackupUrl;
                    song.Title = dto.Title;
                    song.Artist = dto.Artist;
                    song.Genre = dto.Genre;
                    song.UpdatedAt = DateTime.UtcNow;
                    SongValidator.ValidateSong(song);
                    _context.Songs.Update(song);
                }

                await _context.SaveChangesAsync();
                return song;
            });
        }

        public async Task<IEnumerable<Song>> SearchSongsAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<Song>();

            try
            {
                return await _context.Songs.Where(s => s.Title.ToLower().Contains(query.ToLower())
             || s.Artist.ToLower().Contains(query.ToLower())
             || s.Genre.ToLower().Contains(query.ToLower()))
                 .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching songs: {ex.Message}");
                return new List<Song>();
            }
        }

        public async Task<List<Song>> GetSongsByUserAsync(int userId) => await _context.Songs.Where(s => s.UserId == userId).ToListAsync();

        public async Task<List<Song>> GetSongsByGenreAsync(string genre) => await _context.Songs.Where(s => s.Genre == genre).ToListAsync();

        public async Task<List<Song>> GetSongsByArtistAsync(string artist) => await _context.Songs.Where(s => s.Artist == artist).ToListAsync();

        public async Task<List<Song>> GetSongsByTitleAsync(string title) => await _context.Songs.Where(s => s.Title == title).ToListAsync();

        public async Task<List<Song>> GetSongsByUserIdAsync(int userId)
        {
            try
            {
                return await _context.Songs.Where(s => s.UserId == userId).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching songs by user: {ex.Message}");
                return new List<Song>();
            }
        }
    }
}









