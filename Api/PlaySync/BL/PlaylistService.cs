using DL;
using DL.Entities;
using Microsoft.EntityFrameworkCore;

namespace BL
{
    public class PlaylistService
    {
        private readonly ApplicationDbContext _context;

        public PlaylistService(ApplicationDbContext context)
        {
            _context = context;
        }

        //public async Task<PlayList>CreatePlaylistAsync(PlayList  playList)
        //{

        //    _context.Playlists.Add(playList);
        //    _context.SaveChanges();
        //    return playList;
        //}

        public async Task CreatePlaylistAsync(int userId, string playListName)
        {
            // וידוא ששם הפלייליסט לא ריק ולא Null
            if (string.IsNullOrEmpty(playListName))
            {
                throw new ArgumentException("Playlist name cannot be null or empty.");
            }

            var playlist = new PlayList
            {
                UserId = userId,
                PlayListName = playListName
            };

            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task<PlayList>GetPlayListByIdAsync(int playlistId)
        {
            return await _context.Playlists
                .Include(p => p.PlaylistSongs)
                .ThenInclude(ps => ps.Song)
                .FirstOrDefaultAsync(p => p.Id == playlistId);
        }

        public async Task<PlayList>UpdateplaylistAsync(int playlistId,PlayList updatePlaylist)
        {
            var playlist =await _context.Playlists.FindAsync(playlistId);
            if (playlist != null) 
            {
                playlist.PlayListName = updatePlaylist.PlayListName;
                playlist.UpdatedAt = DateTime.UtcNow;  // עדכון שדה UpdatedAt
                _context.Playlists.Update(playlist);
                _context.SaveChanges();
            }
             return playlist;
        }

        public async Task<bool>DeletePlaylistAsync(int playlistId)
        {
            var playlist = await _context.Playlists.FindAsync(playlistId);
            if (playlist != null)
            {
                _context.Playlists.Remove(playlist);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public async Task<List<PlayList>>SearchPlaylistsAsync(string searchTerm)
        {
          return await _context.Playlists
                .Where(p => p.PlayListName.Contains(searchTerm))
                .ToListAsync();
        }
       
    }
}
