using DL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Validators
{
    public class SongValidator
    {
        /// <summary>
        ///check if song is valid
        /// </summary>
        public static void ValidateSong(Song song)
        {
            if (song == null)
                throw new ArgumentException("song cannot be null.");

            if (string.IsNullOrWhiteSpace(song.Title))
                throw new ArgumentException("song name cant be empty");

            if (string.IsNullOrWhiteSpace(song.Artist))
                throw new ArgumentException("Artist name cant be empty.");

            if (string.IsNullOrWhiteSpace(song.Genre))
                throw new ArgumentException("zaner name cant be empty.");

            if (string.IsNullOrWhiteSpace(song.CloudinaryUrl))
                throw new ArgumentException("CloudinaryUrl name cant be empty.");

            if (song.UserId <= 0)
                throw new ArgumentException("user id is not valid.");
        }

    }
}
