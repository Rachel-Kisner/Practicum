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

        [HttpGet("search")]
        public async Task<IActionResult> SearchSongs([FromQuery] string query)
        {
            var songs = await _songService.SearchSongsAsync(query);
            return Ok(songs);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadSong([FromForm] IFormFile file, [FromForm] string title, [FromForm] string artist, [FromForm] string genre, [FromForm] int userId)
        {
            var song = await _songService.UploadSongAsync(file, title, artist, genre, userId);
            return Ok(song);
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateSong(int id, [FromForm] string title, [FromForm] string artist, [FromForm] string genre, [FromForm] IFormFile file)
        {
            var song = await _songService.UpdateSongAsync(id, title, artist, genre, file);
            return song != null ? Ok(song) : NotFound();
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteSong(int id)
        {
            var result = await _songService.DeleteSongAsync(id);
            return result ? Ok() : NotFound();
        }




    }
}







