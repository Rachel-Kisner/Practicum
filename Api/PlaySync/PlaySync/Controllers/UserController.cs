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
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet, Route("{userId}")]

        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null) return NotFound("User not found");
            return Ok(user);
        }

        /// <summary>
        /// Create a new user 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost, Route("create")]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            var createdUser = await _userService.CreateUserAsync(user);
            return Ok(createdUser);
        }

        /// <summary>
        /// Update a user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPut, Route("update/{userId}")]

        public async Task<IActionResult> UpdateUser(int userId, [FromBody] User user)
        {
            var updatedUser = await _userService.UpdateUserByIdAsync(userId, user);
            if (user == null)
                return NotFound("User Not Found");
            return Ok(updatedUser);
        }

        [HttpDelete, Route("delete/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var deleted = await _userService.DeleteUserAsync(userId);
            if (deleted) return Ok("User deleted");
            return NotFound("User not found");
        }

        [HttpGet,Route("search/{searchTerm}")] 
        public async Task<IActionResult> SearchUsers(string searchTerm)
        {
            var users = await _userService.SearchUsersAsync(searchTerm);
            return Ok(users);
        }


    }



}


