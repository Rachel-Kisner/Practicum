using BL;
using DL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Security.Claims;


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
            catch (Exception ex)
            {
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
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("user")]
        [Authorize(Policy = "OwnerOrAdmin")]
        public async Task<IActionResult> GetSongsByCurrentUser()
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
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
                if (songs == null || !songs.Any())
                    return Ok(new { message = "No songs matching the search were found. ", data = songs });
                return Ok(songs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("upload")]
        [Authorize]

        public async Task<IActionResult> UploadSong([FromForm] SongUploadDto request)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var song = await _songService.UploadSongAsync(request.File, request.Title, request.Artist, request.Genre, (bool)request.Favorite, userId);
                return Ok(song);
            }
            catch (Exception ex)
            { return StatusCode(500, ex.Message); }
        }

        [HttpPut("{songId}")]
        [Authorize(Policy = "OwnerOrAdmin")]

        public async Task<IActionResult> UpdateSong(int songId, [FromBody] SongRequestDto dto)
        {
            try
            {

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var isAdmin = User.FindFirst(ClaimTypes.Role)?.Value == nameof(Role.Admin);
                var song = await _songService.UpdateSongAsync(songId, dto, userId, isAdmin);
                return song != null ? Ok(song) : NotFound();
            }
            //catch (UnauthorizedAccessException)
            //{
            //    return Forbid();
            //}
            catch (ArgumentException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{songId}/favorit")]
        [Authorize(Policy = "OwnerOrAdmin")]
        public async Task<IActionResult> ToggleFavorite(int songId)
        {
            try
            {
                await _songService.ToggleFavoriteAsync(songId);
                return Ok(new { message = "Favorite status toggled successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{songId}")]
        [Authorize(Policy = "OwnerOrAdmin")]
        public async Task<IActionResult> DeleteSongBySongId(int songId)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var role = User.FindFirstValue(ClaimTypes.Role);
                bool isAdmin = role == "Admin";
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

        [HttpPost("{songId}/ringtone-ai")]
        [Authorize]
        public async Task<IActionResult> GenerateRingtoneByAI(int songId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var song = await _songService.GetSongBySongIdAsync(songId);
            if (song == null)
                return NotFound("Song not found");

            if (song.UserId != userId)
                return Forbid("You arn't the woner of this song ");
            if (string.IsNullOrEmpty(song.CloudinaryUrl))
                return BadRequest("Song doesn't have a Cloudinary URL");

            using var httpClient = new HttpClient();
            using var songStream = await httpClient.GetStreamAsync(song.CloudinaryUrl);

            using var form = new MultipartFormDataContent();
            var streamContent = new StreamContent(songStream);
            streamContent.Headers.ContentType=new MediaTypeHeaderValue("audio/wav");
            form.Add(streamContent, "file", "song.wav");

            ////don't forget to change!! -after spreading in render!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var response = await httpClient.PostAsync("http://localhost:5001/analyze", form);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, error);
            }

            var ringtoneBytes = await response.Content.ReadAsByteArrayAsync();

            return File(ringtoneBytes, "audio/wav", "ringtone.wav");
        }


    }
}






