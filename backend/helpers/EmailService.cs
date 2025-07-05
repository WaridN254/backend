using System;
using System.Net;
using System.Net.Mail;

public class EmailService
{
    public static bool SendEmail(string toEmail, string subject, string body)
    {
        try
        {
            var fromEmail = "waridwalz69@gmail.com"; // Replace with your sender Gmail
            var fromPassword = "ctrs fiyg kreu amkg";   // Replace with App Password (not normal Gmail password)

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromEmail, fromPassword)
            };

            var message = new MailMessage(fromEmail, toEmail, subject, body);
            smtp.Send(message);
            return true;
        }
        catch (Exception)
        {
            // Log error if needed
            return false;
        }
    }
}
