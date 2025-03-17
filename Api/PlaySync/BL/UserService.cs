using Microsoft.EntityFrameworkCore;
using DL;
using DL.Entities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using BL.Validators;


namespace BL
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateUserAsync(string name, string password, string email, Role role)
        {

            UserValidator.ValidateUserInput(name, email, password);
            await UserValidator.ValidateUniqueEmailAsync(_context, email);
            // הצפנת הסיסמה לפני שמירה
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var user = new User
            {
                Name = name,
                PasswordHash = passwordHash,
                Email = email,
                Role = role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users.
                Include(u => u.Songs).
                Include(u => u.Playlists).
                FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User> UpdateUserByIdAsync(int userId, User updateUser)
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
            user.UpdatedAt = DateTime.UtcNow;  // עדכון שדה UpdatedAt
            _context.Users.Update(user);
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

        public async Task<bool> IsEmailTakenAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> ResetPasswordAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return false;

            // יצירת סיסמה זמנית אקראית
            var tempPassword = Guid.NewGuid().ToString().Substring(0, 8);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);

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
            if (user == null || !BCrypt.Net.BCrypt.Verify(oldPassword, user.PasswordHash))
                return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<User>> GetUsersAsync(string orderBy = "name")
        {
            var query = _context.Users.AsQueryable();

            query = orderBy.ToLower() switch
            {
                "email" => query.OrderBy(u => u.Email),
                "created" => query.OrderBy(u => u.CreatedAt),
                _ => query.OrderBy(u => u.Name)
            };

            return await query.ToListAsync();
        }
        public async Task<bool> ChangeUserRoleAsync(int userId, Role newRole)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            user.Role = newRole;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
