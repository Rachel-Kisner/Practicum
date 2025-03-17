using BL.Validators;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace BL
{
    class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly CloudinaryValidator _cloudinarySettingsValidator;

        
        // קונסטרוקטור שמקבל את הגדרות ה-Cloudinary מתוך ה-Options
        public CloudinaryService(IOptions<CloudinarySettings> cloudinarySettings)
        {
            _cloudinarySettingsValidator = new CloudinaryValidator();
            // הגדרת ה-Cloudinary עם המידע שנמצא בקובץ appsettings.json
            var account = new Account(
                cloudinarySettings.Value.CloudName,
                cloudinarySettings.Value.ApiKey,
                cloudinarySettings.Value.ApiSecret);

            _cloudinary = new Cloudinary(account);  // יצירת אובייקט Cloudinary
        }

        // פונקציה להעלאת קובץ
        public async Task<ImageUploadResult> UploadFileAsync(IFormFile file, CloudinarySettings settings)
        {
            if (!_cloudinarySettingsValidator.IsValid())
            {
                throw new ArgumentException("Invalid Cloudinary settings.");
            }
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, file.OpenReadStream())  // פתיחת הזרם של הקובץ
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);  // ביצוע ההעלאה

            return uploadResult;
        }


        public async Task<DeletionResult> DeleteFileAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId); 
            var deleteResult = await _cloudinary.DestroyAsync(deleteParams);  

            return deleteResult;  
        }
    }
}