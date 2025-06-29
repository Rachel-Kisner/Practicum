using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.DTOs
{
    public class SongDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public bool Favorite { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string BackupUrl { get; set; } = string.Empty;
        public string? CloudinaryUrl { get; set; }
    }
}
