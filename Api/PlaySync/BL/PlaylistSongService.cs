using DL;
using DL.Entities;
using Microsoft.EntityFrameworkCore;

namespace BL
{
    public class PlaylistSongService
    {
        private readonly ApplicationDbContext _context;
        public PlaylistSongService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Song>>GetSongsByPlaylistIdAsync(int playlistId)
        {
            var playlistSongs=await _context.PlaylistSongs
                .Where(ps=>ps.PlaylistId==playlistId)
                .ToListAsync();

            var songIds=playlistSongs.Select(ps=> ps.SongId).ToList();
            return await _context.Songs
                .Where(s=>songIds.Contains(s.Id))
                .ToListAsync(); 
        }

        public async Task AddSongToPlaylistAsync(int playlistId,int songId)
        {
            var playlistSong = new PlaylistSong
            {
                PlaylistId = playlistId,
                SongId = songId
            };
            _context.PlaylistSongs.Add(playlistSong);
            await _context.SaveChangesAsync();

        }

        public async Task<bool> RemoveSongFromPlaylistAsync(int playlistId,int songId)
        {
            var playlistSong = await _context.PlaylistSongs
                .FirstOrDefaultAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);
            if (playlistSong != null)
            {
                _context.PlaylistSongs.Remove(playlistSong);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}
