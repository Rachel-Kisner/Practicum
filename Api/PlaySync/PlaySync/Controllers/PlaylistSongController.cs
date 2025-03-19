using BL;
using Microsoft.AspNetCore.Mvc;

namespace PlaySyncApi.Controllers
{
    public class PlaylistSongController
    {
        [ApiController]
        [Route("api/[controller]")]
        public class PlaylistSongsController : ControllerBase
        {
            private readonly PlaylistSongService _playlistSongService;

            public PlaylistSongsController(PlaylistSongService playlistSongService)
            {
                _playlistSongService = playlistSongService;
            }

            [HttpGet("{playlistId}")]
            public async Task<IActionResult> GetSongsByPlaylistId(int playlistId)
            {
                try
                {
                    var songs = await _playlistSongService.GetSongsByPlaylistIdAsync(playlistId);
                    return Ok(songs);
                }
                catch (Exception ex)
                {

                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }

            [HttpPost]
            public async Task<IActionResult> AddSongToPlaylist(int playlistId, int songId)
            {
                try
                {
                    await _playlistSongService.AddSongToPlaylistAsync(playlistId, songId);
                    return CreatedAtAction(nameof(GetSongsByPlaylistId), new { playlistId }, null);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }

            [HttpDelete]
            public async Task<IActionResult> RemoveSongFromPlaylist(int playlistId, int songId)
            {
                try
                {
                    var result = await _playlistSongService.RemoveSongFromPlaylistAsync(playlistId, songId);
                    if (!result)
                    {
                        return NotFound();
                    }
                    return NoContent();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }
        }
    }
}
