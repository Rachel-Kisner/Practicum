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
        private async Task<string> UploadFileToCloudinary(IFormFile file)
        {
            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                Folder = "music_files"
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if (uploadResult?.SecureUrl == null)
            {
                _logger.LogError("Upload failed: SecureUrl is null");
                throw new Exception("Upload failed, SecureUrl is null.");
            }
            return uploadResult.SecureUrl.AbsoluteUri;
        }

        public async Task<Song?> UploadSongAsync(IFormFile file, string title, string artist, string genre, int userId)
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("Invalid file.");

                var cloudinaryUrl = await UploadFileToCloudinary(file);

                var song = new Song
                {
                    Title = title,
                    Artist = artist,
                    Genre = genre,
                    CloudinaryUrl = cloudinaryUrl,
                    UserId = userId
                };

                SongValidator.ValidateSong(song);
                _context.Songs.Add(song);
                await _context.SaveChangesAsync();
                return song;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading song:{ex.Message}");
                return null;
            }
        }

        public async Task<Song?> AddSongAsync(Song song)
        {
            try
            {
                SongValidator.ValidateSong(song);
                _context.Songs.Add(song);
                await _context.SaveChangesAsync();
                return song;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error validating song: {ex.Message}"); return null;
            }
        }

        public async Task<bool> DeleteSongAsync(int songId)
        {
            try
            {
                var song = await _context.Songs.FindAsync(songId);
                if (song == null)
                    return false;

                if (!string.IsNullOrEmpty(song.CloudinaryPublicId))
                {
                    var deletionParams = new DeletionParams(song.CloudinaryPublicId);
                    var result = await _cloudinary.DestroyAsync(deletionParams);
                    if (result.Result != "ok")
                    {
                        _logger.LogWarning($"Failed to delete file from Cloudinary: {result.Result}");
                    }
                }
                _context.Songs.Remove(song);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting song: {ex.Message}");
                return false;
            }
        }

        public async Task<Song?> GetSongBySongIdAsync(int songId)
        {
            try
            {
                return await _context.Songs.Include(s => s.User)
              .FirstOrDefaultAsync(s => s.Id == songId);
            }

            catch (Exception ex)
            {
                _logger.LogError($"Error fetching song: {ex.Message}");
                return null;
            }
        }

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

        public async Task<Song?> UpdateSongAsync(int songId, string title, string artist, string genre, IFormFile file)
        {
            try
            {
                var song = await _context.Songs.FindAsync(songId);
                if (song == null)
                    return null;

                if (file != null)
                {
                    await _cloudinary.DestroyAsync(new DeletionParams(song.CloudinaryPublicId));
                    var uploadParams = new RawUploadParams
                    {
                        File = new FileDescription(file.FileName, file.OpenReadStream()),
                        Folder = "music_files"
                    };
                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult?.SecureUrl == null)
                    {
                        _logger.LogError("Update failed: SecureUrl is null");
                        throw new Exception("Update failed, SecureUrl is null.");
                    }
                    song.CloudinaryUrl = uploadResult.SecureUrl.ToString();
                    song.CloudinaryPublicId = uploadResult.PublicId;
                }

                song.Title = title;
                song.Artist = artist;
                song.Genre = genre;
                song.UpdatedAt = DateTime.UtcNow;
                SongValidator.ValidateSong(song);
                _context.Songs.Update(song);
                await _context.SaveChangesAsync();
                return song;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating song: {ex.Message}");
                return null;
            }
        }

        public async Task<IEnumerable<Song>> SearchSongsAsync(string query)
        {
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









