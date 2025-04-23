using DL.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Validators
{
    public class SongValidator
    {
        private const long MaxFileSize = 5 * 1024 * 1024; // 5MB in bytes
        private static readonly string[] AllowedExtensions = { ".mp3", ".wav", ".flac" };

        /// <summary>
        ///check if song is valid
        /// </summary>
        public static void ValidateSong(Song song)
        {
            if (song == null)
                throw new ArgumentException("Song can't be null.");

            if (string.IsNullOrWhiteSpace(song.Title))
                throw new ArgumentException("Song name can't be empty");

            if (string.IsNullOrWhiteSpace(song.Artist))
                throw new ArgumentException("Artist name can't be empty.");

            if (string.IsNullOrWhiteSpace(song.Genre))
                throw new ArgumentException("Genre name can't be empty.");

            if (string.IsNullOrWhiteSpace(song.CloudinaryUrl))
                throw new ArgumentException("CloudinaryUrl name cant be empty.");

            if(string.IsNullOrWhiteSpace(song.BackupUrl))
                throw new ArgumentException("Backup URL can't be empty.");

            if (song.UserId <= 0)
                throw new ArgumentException("User id is not valid.");
        }

        /// <summary>
        /// check if file is valid
        /// </summary>
        /// <param name="file"></param>
        /// <exception cref="ArgumentException"></exception>

        public static bool ValidateFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid file.");

            var fileExtension = System.IO.Path.GetExtension(file.FileName).ToLower();
            if (!AllowedExtensions.Contains(fileExtension))
            {
                throw new ArgumentException("Invalid file type. Only audio files are allowed.");
            }

            if (file.Length > MaxFileSize)
            {
                throw new ArgumentException("File size exceeds the maximum limit of 5MB.");
            }
            return true;
        }
      
    }
}
