using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DL.Entities
{
    public class Song
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User User { get; set; }
        
        public string BackupUrl { get; set; } = string.Empty;
        public string? BackupPublicId { get; set; }

        public ICollection<PlaylistSong>? PlaylistSongs { get; set; }
        public string CloudinaryUrl { get; set; } = string.Empty;
        public string CloudinaryPublicId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = null;


        public Song(int userId, string title, string artist, string genre)
        {
            UserId = userId;
            Title = title ;
            Artist = artist;
            Genre = genre;
            CreatedAt = DateTime.UtcNow;
        }

        public Song() { }
    }

}
