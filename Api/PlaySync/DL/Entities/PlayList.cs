using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DL.Entities
{
    public class PlayList
    {

        public int Id { get; set; }
        public int UserId { get; set; }
        public string PlayListName { get; set; }
        public User User { get; set; }  // קשר למשתמש
        public ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = null;


     
        public PlayList(string playListName)
        {
            PlayListName = playListName;
        }
        public PlayList()
        {
        }
    }
}
