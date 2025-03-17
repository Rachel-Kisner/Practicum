using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DL.Entities
{
    public class PlaylistSong
    {
        public int PlaylistId { get; set; }  // מזהה פלייליסט
        public PlayList Playlist { get; set; }  // קשר לפלייליסט

        public int SongId { get; set; }  // מזהה שיר
        public Song Song { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = null;
    }
}
