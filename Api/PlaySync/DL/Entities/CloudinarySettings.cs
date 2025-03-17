using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DL.Entities
{
    public class CloudinarySettings
    {
        public string CloudName { get; set; }  // שם הענן שלך ב-Cloudinary
        public string ApiKey { get; set; }     // המפתח שלך ל-API ב-Cloudinary
        public string ApiSecret { get; set; }
        public CloudinarySettings() { }
    }
}

