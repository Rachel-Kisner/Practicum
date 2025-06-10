////using BL.Validators;
////using CloudinaryDotNet;
////using CloudinaryDotNet.Actions;
////using DL.Entities;
////using Microsoft.AspNetCore.Http;
////using Microsoft.Extensions.Options;

////namespace BL
////{
////    public class CloudinaryService
////    {
////        private readonly Cloudinary _cloudinary;
////        private readonly CloudinaryValidator _cloudinarySettingsValidator;
////        private readonly CloudinarySettings _cloudinarySettings;


////        // קונסטרוקטור שמקבל את הגדרות ה-Cloudinary מתוך ה-Options
////        public CloudinaryService(IOptions<CloudinarySettings> cloudinarySettings)
////        {
////            _cloudinarySettings = cloudinarySettings.Value;
////            _cloudinarySettingsValidator = new CloudinaryValidator(_cloudinarySettings);
////            // הגדרת ה-Cloudinary עם המידע שנמצא בקובץ appsettings.json
////            var account = new Account(
////                cloudinarySettings.Value.CloudName,
////                cloudinarySettings.Value.ApiKey,
////                cloudinarySettings.Value.ApiSecret);

////            _cloudinary = new Cloudinary(account);  // יצירת אובייקט Cloudinary
////        }

////        // פונקציה להעלאת קובץ
////        public async Task<CloudinaryUploadResult> UploadFileAsync(IFormFile file,string folder = "music_files")
////        {
////            if (!_cloudinarySettingsValidator.IsValid())
////            {
////                throw new ArgumentException("Invalid Cloudinary settings.");
////            }
////            using var stream = file.OpenReadStream();
////            var uploadParams = new RawUploadParams
////            {
////                File = new FileDescription(file.FileName, stream) ,
////                Folder=folder,

////            };

////            var uploadResult = await _cloudinary.UploadAsync(uploadParams);  // ביצוע ההעלאה
////            if (uploadResult.Error != null)
////                throw new Exception($"Cloudinary upload error: {uploadResult.Error.Message}");
////            if (uploadResult?.SecureUrl==null)
////            {
////                throw new Exception("upload failed, SecureUrl is null");
////            }
////            return new CloudinaryUploadResult
////            {
////                Url = uploadResult.SecureUrl.AbsoluteUri,
////                PublicId=uploadResult.PublicId
////            };
////        }
////        public async Task<CloudinaryUploadResult> BackupFileAsync(IFormFile file)
////        {
////            if (!_cloudinarySettingsValidator.IsValid())
////            {
////                throw new ArgumentException("Invalid Cloudinary settings.");
////            }

////            using var stream = file.OpenReadStream();
////            var uploadParams = new RawUploadParams  // שימוש ב-RawUploadParams
////            {
////                File = new FileDescription(file.FileName, stream),
////                Folder = "music_backups"  // תיקיית הגיבוי
////            };

////            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

////            if (uploadResult?.SecureUrl == null)
////            {
////                throw new Exception("Backup upload failed, SecureUrl is null.");
////            }

////            return new CloudinaryUploadResult
////            {
////                Url = uploadResult.SecureUrl.AbsoluteUri,
////                PublicId = uploadResult.PublicId
////            };
////        }

////        public async Task<DeletionResult> DeleteFileAsync(string publicId)
////        {
////            var deleteParams = new DeletionParams(publicId); 
////            var deleteResult = await _cloudinary.DestroyAsync(deleteParams);  

////            return deleteResult;  
////        }

////    }
////}
//using BL.Validators;
//using CloudinaryDotNet;
//using CloudinaryDotNet.Actions;
//using DL.Entities;
//using Microsoft.AspNetCore.Http;
//using Microsoft.Extensions.Options;

//namespace BL
//{
//    public class CloudinaryUploadResult
//    {
//        public string Url { get; set; } = string.Empty;
//        public string PublicId { get; set; } = string.Empty;
//    }

//    public class CloudinaryService
//    {
//        private readonly Cloudinary _cloudinary;
//        private readonly CloudinaryValidator _cloudinarySettingsValidator;
//        private readonly CloudinarySettings _cloudinarySettings;
//        private readonly HttpClient _httpClient;

//        // קונסטרוקטור שמקבל את הגדרות ה-Cloudinary מתוך ה-Options וגם HttpClient
//        public CloudinaryService(IOptions<CloudinarySettings> cloudinarySettings, IHttpClientFactory httpClientFactory)
//        {
//            _httpClient = httpClientFactory.CreateClient("LongTimeoutClient");
//            _cloudinarySettings = cloudinarySettings.Value;
//            _cloudinarySettingsValidator = new CloudinaryValidator(_cloudinarySettings);

//            // הגדרת ה-Cloudinary עם המידע שנמצא בקובץ appsettings.json
//            var account = new Account(
//                _cloudinarySettings.CloudName,
//                _cloudinarySettings.ApiKey,
//                _cloudinarySettings.ApiSecret);

//            _cloudinary = new Cloudinary(account);  // יצירת אובייקט Cloudinary

//            // הגדרת timeout ארוך יותר לפעולות Cloudinary
//            _cloudinary.Api.Timeout = 300000; // 5 דקות במילישניות
//        }

//        // פונקציה להעלאת קובץ עם מנגנון ניסיון חוזר
//        public async Task<CloudinaryUploadResult> UploadFileAsync(IFormFile file, string folder = "music_files")
//        {
//            const int maxRetries = 3;
//            int retryCount = 0;

//            while (retryCount < maxRetries)
//            {
//                try
//                {
//                    if (!_cloudinarySettingsValidator.IsValid())
//                    {
//                        throw new ArgumentException("Invalid Cloudinary settings.");
//                    }

//                    using var stream = file.OpenReadStream();
//                    var uploadParams = new RawUploadParams
//                    {
//                        File = new FileDescription(file.FileName, stream),
//                        Folder = folder
//                    };

//                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);  // ביצוע ההעלאה

//                    if (uploadResult.Error != null)
//                        throw new Exception($"Cloudinary upload error: {uploadResult.Error.Message}");

//                    if (uploadResult?.SecureUrl == null)
//                    {
//                        throw new Exception("Upload failed, SecureUrl is null");
//                    }

//                    return new CloudinaryUploadResult
//                    {
//                        Url = uploadResult.SecureUrl.AbsoluteUri,
//                        PublicId = uploadResult.PublicId
//                    };
//                }
//                catch (Exception ex) when (IsTransientException(ex) && retryCount < maxRetries - 1)
//                {
//                    // רק במקרה של שגיאות תקשורת זמניות, ננסה שוב
//                    retryCount++;
//                    // המתנה הולכת וגדלה בין ניסיונות
//                    await Task.Delay(1000 * retryCount);
//                }
//                catch (Exception)
//                {
//                    // שגיאות אחרות מועברות הלאה
//                    throw;
//                }
//            }

//            // אם הגענו לכאן, כל הניסיונות נכשלו
//            throw new TimeoutException("Failed to upload file to Cloudinary after multiple attempts.");
//        }

//        // פונקציה להעלאת קובץ גיבוי עם מנגנון ניסיון חוזר
//        public async Task<CloudinaryUploadResult> BackupFileAsync(IFormFile file)
//        {
//            const int maxRetries = 3;
//            int retryCount = 0;

//            while (retryCount < maxRetries)
//            {
//                try
//                {
//                    if (!_cloudinarySettingsValidator.IsValid())
//                    {
//                        throw new ArgumentException("Invalid Cloudinary settings.");
//                    }

//                    using var stream = file.OpenReadStream();
//                    var uploadParams = new RawUploadParams  // שימוש ב-RawUploadParams
//                    {
//                        File = new FileDescription(file.FileName, stream),
//                        Folder = "music_backups"  // תיקיית הגיבוי
//                    };

//                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

//                    if (uploadResult.Error != null)
//                        throw new Exception($"Cloudinary backup upload error: {uploadResult.Error.Message}");

//                    if (uploadResult?.SecureUrl == null)
//                    {
//                        throw new Exception("Backup upload failed, SecureUrl is null.");
//                    }

//                    return new CloudinaryUploadResult
//                    {
//                        Url = uploadResult.SecureUrl.AbsoluteUri,
//                        PublicId = uploadResult.PublicId
//                    };
//                }
//                catch (Exception ex) when (IsTransientException(ex) && retryCount < maxRetries - 1)
//                {
//                    // רק במקרה של שגיאות תקשורת זמניות, ננסה שוב
//                    retryCount++;
//                    // המתנה הולכת וגדלה בין ניסיונות
//                    await Task.Delay(1000 * retryCount);
//                }
//                catch (Exception)
//                {
//                    // שגיאות אחרות מועברות הלאה
//                    throw;
//                }
//            }

//            // אם הגענו לכאן, כל הניסיונות נכשלו
//            throw new TimeoutException("Failed to backup file to Cloudinary after multiple attempts.");
//        }

//        public async Task<DeletionResult> DeleteFileAsync(string publicId)
//        {
//            var deleteParams = new DeletionParams(publicId);
//            var deleteResult = await _cloudinary.DestroyAsync(deleteParams);
//            return deleteResult;
//        }

//        private bool IsTransientException(Exception ex)
//        {
//            // בדיקה אם השגיאה היא זמנית ושווה לנסות שוב
//            return ex is TimeoutException ||
//                   ex is HttpRequestException ||
//                   (ex.Message?.Contains("timeout", StringComparison.OrdinalIgnoreCase) ?? false) ||
//                   (ex.Message?.Contains("connection", StringComparison.OrdinalIgnoreCase) ?? false) ||
//                   (ex.Message?.Contains("host", StringComparison.OrdinalIgnoreCase) ?? false);
//        }
//    }
//}

/////////////////////////////////////////////
using BL.Validators;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using NAudio.Wave;
using NAudio.Lame;
using System.IO;
using Microsoft.Extensions.Logging;

namespace BL
{
    public class CloudinaryUploadResult
    {
        public string Url { get; set; } = string.Empty;
        public string PublicId { get; set; } = string.Empty;
    }

    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly CloudinaryValidator _cloudinarySettingsValidator;
        private readonly CloudinarySettings _cloudinarySettings;
        private readonly HttpClient _httpClient;
        private readonly ILogger<CloudinaryService> _logger;

        // קונסטרוקטור שמקבל את הגדרות ה-Cloudinary מתוך ה-Options וגם HttpClient
        public CloudinaryService(IOptions<CloudinarySettings> cloudinarySettings, IHttpClientFactory httpClientFactory, ILogger<CloudinaryService> logger)
        {
            _httpClient = httpClientFactory.CreateClient("LongTimeoutClient");
            _cloudinarySettings = cloudinarySettings.Value;
            _cloudinarySettingsValidator = new CloudinaryValidator(_cloudinarySettings);
            _logger = logger;

            // הגדרת ה-Cloudinary עם המידע שנמצא בקובץ appsettings.json
            var account = new Account(
                _cloudinarySettings.CloudName,
                _cloudinarySettings.ApiKey,
                _cloudinarySettings.ApiSecret);

            _cloudinary = new Cloudinary(account);  // יצירת אובייקט Cloudinary

            // הגדרת timeout ארוך יותר לפעולות Cloudinary
            _cloudinary.Api.Timeout = 300000; // 5 דקות במילישניות
        }

        // פונקציה חדשה לדחיסת קובץ אודיו
        private async Task<IFormFile> CompressAudioFileAsync(IFormFile file)
        {
            const long MaxSizeBytes = 9 * 1024 * 1024; // 9MB (קצת פחות מ-10MB להיות בטוחים)

            // אם הקובץ כבר קטן מספיק, אין צורך בדחיסה
            if (file.Length <= MaxSizeBytes)
            {
                return file;
            }

            string extension = Path.GetExtension(file.FileName).ToLower();

            try
            {
                // דחיסת MP3
                if (extension == ".mp3")
                {
                    _logger.LogInformation($"Compressing MP3 file {file.FileName}, size: {file.Length} bytes");

                    using var inputStream = file.OpenReadStream();
                    using var outputStream = new MemoryStream();

                    using var reader = new Mp3FileReader(inputStream);

                    // חישוב ביטרייט חדש (יורד בהדרגה עד שהקובץ קטן מספיק)
                    int targetBitrate = CalculateTargetBitrate(file.Length, MaxSizeBytes);
                    _logger.LogInformation($"Target bitrate for compression: {targetBitrate} kbps");

                    using var writer = new LameMP3FileWriter(outputStream, reader.WaveFormat, targetBitrate);

                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = reader.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        writer.Write(buffer, 0, bytesRead);
                    }

                    writer.Flush();
                    outputStream.Position = 0;

                    string newFileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_compressed.mp3";
                    var compressedFile = new FormFile(outputStream, 0, outputStream.Length, file.Name, newFileName)
                    {
                     
                        ContentType = "audio/mpeg"
                    };

                    _logger.LogInformation($"Compression complete. Original size: {file.Length}, New size: {outputStream.Length}");
                    return compressedFile;
                }
                // דחיסת WAV ע"י המרה ל-MP3
                else if (extension == ".wav")
                {
                    _logger.LogInformation($"Converting WAV to MP3 for {file.FileName}, size: {file.Length} bytes");

                    using var inputStream = file.OpenReadStream();
                    using var outputStream = new MemoryStream();

                    using var reader = new WaveFileReader(inputStream);
                    using var writer = new LameMP3FileWriter(outputStream, reader.WaveFormat, 96); // ביטרייט 96kbps

                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = reader.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        writer.Write(buffer, 0, bytesRead);
                    }

                    writer.Flush();
                    outputStream.Position = 0;

                    string newFileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}.mp3";
                    var compressedFile = new FormFile(outputStream, 0, outputStream.Length, file.Name, newFileName)
                    {
                        Headers = file.Headers,
                        ContentType = "audio/mpeg"
                    };

                    _logger.LogInformation($"Conversion complete. Original size: {file.Length}, New size: {outputStream.Length}");
                    return compressedFile;
                }
                else
                {
                    _logger.LogWarning($"Unsupported audio format for compression: {extension}");
                    return file; // מחזירים את הקובץ המקורי אם לא ניתן לדחוס
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error compressing audio file: {ex.Message}");
                return file; // במקרה של שגיאה, מחזירים את הקובץ המקורי
            }
        }

        // חישוב ביטרייט יעד בהתאם לגודל הקובץ
        private int CalculateTargetBitrate(long currentSize, long targetSize)
        {
            // מקדם הדחיסה הדרוש
            double compressionFactor = (double)targetSize / currentSize;

            // ביטרייט התחלתי משוער (רוב ה-MP3 הם בין 128 ל-320 kbps)
            int estimatedCurrentBitrate = 192;

            // חישוב ביטרייט יעד
            int targetBitrate = (int)(estimatedCurrentBitrate * compressionFactor);

            // הגבלת ביטרייט מינימלי (לאיכות סבירה) ומקסימלי
            targetBitrate = Math.Min(320, Math.Max(64, targetBitrate));

            return targetBitrate;
        }

        // פונקציה להעלאת קובץ עם מנגנון ניסיון חוזר - עכשיו כולל דחיסה
        public async Task<CloudinaryUploadResult> UploadFileAsync(IFormFile file, string folder = "music_files")
        {
            const int maxRetries = 3;
            int retryCount = 0;

            // דחיסת הקובץ לפני העלאה
            var compressedFile = await CompressAudioFileAsync(file);

            while (retryCount < maxRetries)
            {
                try
                {
                    if (!_cloudinarySettingsValidator.IsValid())
                    {
                        throw new ArgumentException("Invalid Cloudinary settings.");
                    }

                    using var stream = compressedFile.OpenReadStream();
                    var uploadParams = new RawUploadParams
                    {
                        File = new FileDescription(compressedFile.FileName, stream),
                        Folder = folder
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);  // ביצוע ההעלאה

                    if (uploadResult.Error != null)
                        throw new Exception($"Cloudinary upload error: {uploadResult.Error.Message}");

                    if (uploadResult?.SecureUrl == null)
                    {
                        throw new Exception("Upload failed, SecureUrl is null");
                    }

                    return new CloudinaryUploadResult
                    {
                        Url = uploadResult.SecureUrl.AbsoluteUri,
                        PublicId = uploadResult.PublicId
                    };
                }
                catch (Exception ex) when (IsTransientException(ex) && retryCount < maxRetries - 1)
                {
                    // רק במקרה של שגיאות תקשורת זמניות, ננסה שוב
                    retryCount++;
                    // המתנה הולכת וגדלה בין ניסיונות
                    await Task.Delay(1000 * retryCount);
                }
                catch (Exception)
                {
                    // שגיאות אחרות מועברות הלאה
                    throw;
                }
            }

            // אם הגענו לכאן, כל הניסיונות נכשלו
            throw new TimeoutException("Failed to upload file to Cloudinary after multiple attempts.");
        }

        // פונקציה להעלאת קובץ גיבוי עם מנגנון ניסיון חוזר - גם היא עם דחיסה
        public async Task<CloudinaryUploadResult> BackupFileAsync(IFormFile file)
        {
            const int maxRetries = 3;
            int retryCount = 0;

            // דחיסת הקובץ לפני העלאה
            var compressedFile = await CompressAudioFileAsync(file);

            while (retryCount < maxRetries)
            {
                try
                {
                    if (!_cloudinarySettingsValidator.IsValid())
                    {
                        throw new ArgumentException("Invalid Cloudinary settings.");
                    }

                    using var stream = compressedFile.OpenReadStream();
                    var uploadParams = new RawUploadParams  // שימוש ב-RawUploadParams
                    {
                        File = new FileDescription(compressedFile.FileName, stream),
                        Folder = "music_backups"  // תיקיית הגיבוי
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.Error != null)
                        throw new Exception($"Cloudinary backup upload error: {uploadResult.Error.Message}");

                    if (uploadResult?.SecureUrl == null)
                    {
                        throw new Exception("Backup upload failed, SecureUrl is null.");
                    }

                    return new CloudinaryUploadResult
                    {
                        Url = uploadResult.SecureUrl.AbsoluteUri,
                        PublicId = uploadResult.PublicId
                    };
                }
                catch (Exception ex) when (IsTransientException(ex) && retryCount < maxRetries - 1)
                {
                    // רק במקרה של שגיאות תקשורת זמניות, ננסה שוב
                    retryCount++;
                    // המתנה הולכת וגדלה בין ניסיונות
                    await Task.Delay(1000 * retryCount);
                }
                catch (Exception)
                {
                    // שגיאות אחרות מועברות הלאה
                    throw;
                }
            }

            // אם הגענו לכאן, כל הניסיונות נכשלו
            throw new TimeoutException("Failed to backup file to Cloudinary after multiple attempts.");
        }

        public async Task<DeletionResult> DeleteFileAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var deleteResult = await _cloudinary.DestroyAsync(deleteParams);
            return deleteResult;
        }

        private bool IsTransientException(Exception ex)
        {
            // בדיקה אם השגיאה היא זמנית ושווה לנסות שוב
            return ex is TimeoutException ||
                   ex is HttpRequestException ||
                   (ex.Message?.Contains("timeout", StringComparison.OrdinalIgnoreCase) ?? false) ||
                   (ex.Message?.Contains("connection", StringComparison.OrdinalIgnoreCase) ?? false) ||
                   (ex.Message?.Contains("host", StringComparison.OrdinalIgnoreCase) ?? false);
        }
    }
}