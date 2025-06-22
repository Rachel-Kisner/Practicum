using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class SongRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public bool Favorite { get; set; }

    }

    public class SongResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string CloudinaryUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
