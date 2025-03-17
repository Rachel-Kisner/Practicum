using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;

namespace BL
{
    public class EmailService
    {



        private readonly string _smtpServer = "smtp.gmail.com"; // שרת SMTP של Gmail (או אחר)
        private readonly int _smtpPort = 587;
        private readonly string _smtpUser = "your-email@gmail.com"; // כתובת המייל שלך
        private readonly string _smtpPass = "your-app-password"; // סיסמת אפליקציה (לא סיסמה רגילה!)

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Your App Name", _smtpUser));
            email.To.Add(new MailboxAddress("", toEmail));
            email.Subject = subject;

            email.Body = new TextPart("plain") { Text = body };

            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            await smtp.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_smtpUser, _smtpPass);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }

}

