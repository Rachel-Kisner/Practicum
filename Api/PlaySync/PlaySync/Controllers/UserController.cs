using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Design;
using BL;
using DL.Entities;



namespace PlaySyncApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ILogger<UserController> _logger;
        public UserController(UserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(bool isAdmin,string orderBy)
        {
            try
            {
                var users = await _userService.GetUsersAsync(isAdmin,orderBy);
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

        public async Task<IActionResult> GetUserById(bool admin ,int userId)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(admin,userId);
                if (user == null) return NotFound("User not found");
                return Ok(user);
            }
            catch (UnauthorizedAccessException ex) {
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
        public async Task<IActionResult> CreateUser([FromBody] User newUser)
        {
            try
            {
                bool result = await _userService.CreateUserAsync(newUser.Name, newUser.PasswordHash, newUser.Email, newUser.Role);
                return result ? CreatedAtAction(nameof(GetUserById), new { userId = newUser.Id }, newUser) : BadRequest();
            } catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, "Internal server error");
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
                if (updateUser == null)
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
            catch (Exception ex) {
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
                return Ok(users);
            }
            catch (Exception ex) {
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
            catch (Exception ex) {
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
            catch (Exception ex) {
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




    }



}


