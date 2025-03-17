using DL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Validators
{
    class CloudinaryValidator
    {
        public CloudinarySettings _cloudinary;
        public bool IsValid()
        {
            return !string.IsNullOrEmpty(_cloudinary.CloudName) &&
                   !string.IsNullOrEmpty(_cloudinary.ApiKey) &&
                   !string.IsNullOrEmpty(_cloudinary.ApiSecret);
        }
    }
}
