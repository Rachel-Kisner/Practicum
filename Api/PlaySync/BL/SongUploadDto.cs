using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class SongUploadDto
    {
        public  int UserId { get; set; }
        public required string? Title { get; set; } = string.Empty;
        public required string? Artist { get; set; } = string.Empty;
        public string? Genre { get; set; }

        // הקובץ עצמו
        public required IFormFile File { get; set; }

    }
}
