using Microsoft.EntityFrameworkCore;
using DL;
using DL.Entities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using BL.Validators;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using DL.Migrations;


namespace BL
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserService> _logger;
        private readonly IPasswordHasher<User> _passwordHasher;
        public UserService(ApplicationDbContext context,ILogger<UserService> logger,IPasswordHasher<User>passwordHasher)
        {
            _context = context;
            _logger = logger;
            _passwordHasher = passwordHasher;
        }



        public async Task<User?> GetUserByIdAsync(bool admin,int userId)
        {
            if(!admin)return null;
            return await _context.Users.
                Include(u => u.Songs).
                Include(u => u.Playlists).
                FirstOrDefaultAsync(u => u.Id == userId);
        }
        public async Task<List<User>> GetUsersAsync(bool admin, string orderBy = "name")
        {
            try
            {
                if (!admin)
                {
                    throw new UnauthorizedAccessException("Only admins can access the user list.");
                }
                var query = _context.Users.AsQueryable();

                query = orderBy.ToLower() switch
                {
                    "email" => query.OrderBy(u => u.Email),
                    "created" => query.OrderBy(u => u.CreatedAt),
                    _ => query.OrderBy(u => u.Name)
                };

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }

        public async Task<bool> CreateUserAsync(RegisterUserDto dto)
        {
            UserValidator.ValidateUserInput(dto.Name, dto.Email, dto.PasswordHash);
            await UserValidator.ValidateUniqueEmailAsync(_context, dto.Email);
            var passwordHash = _passwordHasher.HashPassword(null, dto.PasswordHash);

            var user = new User
            {
                Name = dto.Name,
                PasswordHash = passwordHash,
                Email = dto.Email,
                Role = (Role)dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<User?> UpdateUserByIdAsync(int userId, User updateUser)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;
            if (!string.IsNullOrWhiteSpace(updateUser.Name))
                user.Name = updateUser.Name;

            if (!string.IsNullOrWhiteSpace(updateUser.Email))
            {
                UserValidator.ValidateUserInput(updateUser.Name, updateUser.Email, "dummyPassword");
                await UserValidator.ValidateUniqueEmailAsync(_context, updateUser.Email, userId);
                user.Email = updateUser.Email;
            }
            user.Role = updateUser.Role;
            user.UpdatedAt = DateTime.UtcNow;  
            //_context.Users.Update(user);
            _context.SaveChanges();

            return user;

        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)

                return false;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<List<User>> SearchUsersAsync(string searchTerm)
        {
            return await _context.Users
                .Where(u => u.Name.Contains(searchTerm) || u.Email.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<bool> IsEmailTakenAsync([FromBody]EmailDto emailDto)
        {
            return await _context.Users.AnyAsync(u => u.Email == emailDto.Email);
        }

        public async Task<bool> ResetPasswordAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return false;

            // יצירת סיסמה זמנית אקראית
            var tempPassword = Guid.NewGuid().ToString().Substring(0, 8);
            user.PasswordHash = _passwordHasher.HashPassword(user, tempPassword); 

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // שליחת הסיסמה החדשה באימייל
            var emailService = new EmailService();
            await emailService.SendEmailAsync(email, "old password ", $"Your new password: {tempPassword}");

            return true;
        }
        public async Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword)//this function is only to change the password 
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            // אימות הסיסמה הישנה מול ה-Hash
            var verifyResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, oldPassword);
            if (verifyResult != PasswordVerificationResult.Success)
                return false;

            // Hash לסיסמה החדשה ושמירתה
            user.PasswordHash = _passwordHasher.HashPassword(user, newPassword);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangeUserRoleAsync(bool admin,int userId, Role newRole)
        {

            if (!admin) return false;
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            user.Role = newRole;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<RefreshToken?> GetValidRefreshTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == token && !r.IsRevoked && r.ExpiryDate > DateTime.UtcNow);
        }

        public async Task StoreRefreshTokenAsync(RefreshToken token)
        {
            await _context.RefreshTokens.AddAsync(token);
            await _context.SaveChangesAsync();
        }

        public async Task RevokeAndReplaceRefreshTokenAsync(RefreshToken oldToken, RefreshToken newToken)
        {
            oldToken.IsRevoked = true;
            await _context.RefreshTokens.AddAsync(newToken);
            await _context.SaveChangesAsync();
        }
       
        public async Task<User?> GetUserByCredentialsAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return null;

            // בדיקת הסיסמה שהוזנה מול ה־Hash השמור
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

            if (result == PasswordVerificationResult.Success)
                return user;

            return null;
        }


    }
}
