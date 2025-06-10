using DL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Validators
{
    public class CloudinaryValidator
    {
        private readonly CloudinarySettings _cloudinary;

        public CloudinaryValidator(CloudinarySettings cloudinary)
        {
            _cloudinary = cloudinary??throw new ArgumentNullException(nameof(cloudinary))
                ;
        }

        public bool IsValid()
        {

            return !string.IsNullOrEmpty(_cloudinary.CloudName) &&
                   !string.IsNullOrEmpty(_cloudinary.ApiKey) &&
                   !string.IsNullOrEmpty(_cloudinary.ApiSecret);
        }
    }
}
