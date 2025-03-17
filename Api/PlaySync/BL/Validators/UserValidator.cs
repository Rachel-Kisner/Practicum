using BL;
using DL.Entities;
using DL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace BL.Validators
{
    class UserValidator
    {
        public static void ValidateUserInput(string name, string email, string password)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("All fields are required");

            if (!IsValidEmail(email))
                throw new ArgumentException("Invalid email format");

            if (password.Length < 6)
                throw new ArgumentException("Password must be at least 6 characters long");
        }

        public static async Task ValidateUniqueEmailAsync(ApplicationDbContext context, string email, int? userId = null)
        {
            bool emailExists = await context.Users.AnyAsync(u => u.Email == email && (!userId.HasValue || u.Id != userId));
            if (emailExists)
                throw new ArgumentException("Email already exists");
        }

        private static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}


