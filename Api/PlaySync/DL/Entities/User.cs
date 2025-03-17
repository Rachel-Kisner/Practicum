using DL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DL.Entities
{
    public enum Role
    {
        Admin = 1, User = 2
    }
    
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; }
        public ICollection<PlayList> Playlists { get; set; } = new List<PlayList>();
        public ICollection<Song> Songs { get; set; } = new List<Song>();  // שירים שהעלה המשתמש
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = null;

        public User(string name, string password, string email, Role role)
        {
            Name = name;
            PasswordHash = password;
            Email = email;
            Role = role;
   
        }

        public User()
        {
    
        }
    }
}


