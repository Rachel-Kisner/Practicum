using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Design;
using BL;
using DL.Entities;


namespace PlaySyncApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongController : ControllerBase
    {
        private readonly SongService _songService;

        public SongController(SongService songService)
        {
            _songService = songService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSongs()
        {
            try
            {
                var songs = await _songService.GetAllSongsAsync();
                return Ok(songs);
            }
            catch (Exception ex) { 
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("{songId}")]
        public async Task<IActionResult> GetSongBySongId(int songId)
        {
            try
            {
                var song = await _songService.GetSongBySongIdAsync(songId);
                if (song == null)
                {
                    return NotFound();
                }
                return Ok(song);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetSongsByUserId(int userId)
        {
            try
            {
                var songs = await _songService.GetSongsByUserAsync(userId);
                return Ok(songs);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        [HttpGet("search")]
        public async Task<IActionResult> SearchSongs([FromQuery] string query)
        {
            try
            {
                var songs = await _songService.SearchSongsAsync(query);
                return Ok(songs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
       
        [HttpPost("upload")]
        public async Task<IActionResult> UploadSong([FromForm] IFormFile file, [FromForm] string title, [FromForm] string artist, [FromForm] string genre, [FromForm] int userId)
        {
            try
            {

                var song = await _songService.UploadSongAsync(file, title, artist, genre, userId);
                return Ok(song);
            }
            catch (Exception ex)
            { return StatusCode(500, ex.Message); }
        }

        [HttpPut("{songId}")]
        public async Task<IActionResult> UpdateSong(int songId, [FromForm] string title, [FromForm] string artist, [FromForm] string genre, [FromForm] IFormFile file)
        {
            try
            {
                var song = await _songService.UpdateSongAsync(songId, title, artist, genre, file);
                return song != null ? Ok(song) : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
      
        [HttpDelete("{songId}")]
        public async Task<IActionResult> DeleteSongBySongId(int songId, int userId, bool isAdmin)
        {
            try
            {
                 await _songService.DeleteSongAsync(songId, userId, isAdmin);
                return NoContent(); ;
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (ArgumentException)
            {
                return NotFound(); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


       



    }
}







