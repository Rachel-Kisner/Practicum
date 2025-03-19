using BL;
using DL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace PlaySyncApi.Controllers
{
    public class PlaylistController
    {

        [ApiController]
        [Route("api/[controller]")]
        public class PlaylistsController : ControllerBase
        {
            private readonly PlaylistService _playlistService;

            public PlaylistsController(PlaylistService playlistService)
            {
                _playlistService = playlistService;
            }

            [HttpPost]
            public async Task<IActionResult> CreatePlaylist(int userId, string playListName)
            {
                try
                {
                    await _playlistService.CreatePlaylistAsync(userId, playListName);
                    return CreatedAtAction(nameof(GetPlayListById), new { userId, playListName }, null);
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(ex.Message);
                }
                catch (Exception ex)
                {
                    
                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }

            [HttpGet("{playlistId}")]
            public async Task<IActionResult> GetPlayListById(int playlistId)
            {
                try
                {
                    var playlist = await _playlistService.GetPlayListByIdAsync(playlistId);
                    if (playlist == null)
                    {
                        return NotFound();
                    }
                    return Ok(playlist);
                }
                catch (Exception ex)
                {
               
                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }

            [HttpPut("{playlistId}")]
            public async Task<IActionResult> UpdatePlaylist(int playlistId, [FromBody] PlayList updatePlaylist)
            {
                try
                {
                    var updatedPlaylist = await _playlistService.UpdateplaylistAsync(playlistId, updatePlaylist);
                    if (updatedPlaylist == null)
                    {
                        return NotFound();
                    }
                    return Ok(updatedPlaylist);
                }
                catch (Exception ex)
                {

                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }

            [HttpDelete("{playlistId}")]
            public async Task<IActionResult> DeletePlaylist(int playlistId)
            {
                try
                {
                    var result = await _playlistService.DeletePlaylistAsync(playlistId);
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

            [HttpGet("search")]
            public async Task<IActionResult> SearchPlaylists(string searchTerm)
            {
                try
                {
                    var playlists = await _playlistService.SearchPlaylistsAsync(searchTerm);
                    return Ok(playlists);
                }
                catch (Exception ex)
                {
                    
                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }
        }

    }
}
