using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Design;
using BL;
using DL.Entities;
using DL;
using Microsoft.EntityFrameworkCore;



namespace PlaySyncApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ILogger<UserController> _logger;
        private readonly JwtTokenService _jwtTokenService;
        public UserController(UserService userService, ILogger<UserController> logger, JwtTokenService jwtTokenService)
        {
            _userService = userService;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(bool isAdmin, string orderBy)
        {
            try
            {
                var users = await _userService.GetUsersAsync(isAdmin, orderBy);
                return Ok(users);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(bool admin, int userId)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(admin, userId);
                if (user == null) return NotFound("User not found");
                return Ok(user);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user by ID");
                return StatusCode(500, "Internal server error");
            }
        }




        /// <summary>
        /// Create a new user 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
      
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] RegisterUserDto newUser)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

             
                bool result = await _userService.CreateUserAsync(newUser);

                return result
                    ? Ok("User created successfully")
                    : BadRequest("User already exists or could not be created");
            }
            catch (ArgumentException ex) when (ex.Message.Contains("Email already exists"))
            {
                // שגיאה ברורה כשמייל כבר קיים
                return Conflict(new { message = ex.Message }); // Status 409
            }

            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error creating user");
                return StatusCode(500,ex.Message);
            }
        }



        /// <summary>
        /// Update a user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPut("{userId}")]

        public async Task<IActionResult> UpdateUser(int userId, [FromBody] User updateUser)
        {
            try
            {
                var updatedUser = await _userService.UpdateUserByIdAsync(userId, updateUser);
                if (updatedUser == null)
                    return NotFound("User Not Found");
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                var deleted = await _userService.DeleteUserAsync(userId);
                if (!deleted) return NotFound("User not found");
                return Ok("User deleted");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(string searchTerm)
        {
            try
            {
                var users = await _userService.SearchUsersAsync(searchTerm);
                if (users == null || !users.Any())
                    return Ok(new { message = "No users matching the search were found. ", data = users });
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching user");
                return StatusCode(500, "Internal server error");
            }

        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(string email)
        {
            try
            {
                bool result = await _userService.ResetPasswordAsync(email);
                return result ? Ok() : NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting password");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{userId}/change-password")]
        public async Task<IActionResult> ChangePassword(int userId, string oldPassword, string newPassword)
        {
            try
            {
                bool result = await _userService.ChangePasswordAsync(userId, oldPassword, newPassword);
                return result ? Ok() : BadRequest();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{userId}/change-role")]
        public async Task<IActionResult> ChangeUserRole(bool admin, int userId, Role newRole)
        {
            try
            {
                bool result = await _userService.ChangeUserRoleAsync(admin, userId, newRole);
                return result ? Ok() : Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing user role");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var user = await _userService.GetUserByCredentialsAsync(loginDto.Email, loginDto.Password);
                Console.WriteLine($"Email: {loginDto.Email}, Password: {loginDto.Password}");

                if (user == null)
                    return Unauthorized("Invalid credentials");

                var accessToken = _jwtTokenService.GenerateAccessToken(user);
                var refreshToken = _jwtTokenService.GenerateRefreshToken();

                var refreshTokenEntity = new RefreshToken
                {
                    Token = refreshToken,
                    ExpiryDate = DateTime.UtcNow.AddDays(7), // שבוע תוקף
                    UserId = user.Id
                };

                await _userService.StoreRefreshTokenAsync(refreshTokenEntity);


                return Ok(new
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    User = user
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Login");
                return StatusCode(500, "Internal server error");
            } 
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            var tokenInDb = await _userService.GetValidRefreshTokenAsync(refreshToken);

            if (tokenInDb == null || tokenInDb.ExpiryDate < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token");

            var newAccessToken = _jwtTokenService.GenerateAccessToken(tokenInDb.User);
            var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

            tokenInDb.IsRevoked = true;

            var newRefreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                UserId = tokenInDb.UserId
            };

            await _userService.RevokeAndReplaceRefreshTokenAsync(tokenInDb, newRefreshTokenEntity);


            return Ok(new
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }



        [HttpPost("exists")]
        public async Task<IActionResult> CheckEmailExists([FromBody] EmailDto emailDto)
        {
            //try
            //{
                Console.WriteLine("Email received: " + emailDto.Email); // הוספת הדפסה

                var exists = await _userService.IsEmailTakenAsync(emailDto);
                Console.WriteLine("Exists? " + exists); // הדפסה של התוצאה

                return Ok(new { exists });
            //}
            //catch (Exception ex)
            //{
            //    _logger.LogError(ex.Message, "The check had some problems");
            //    return StatusCode(500, "Internal server error"); 
            //}
        }
    }
}










