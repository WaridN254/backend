using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;

namespace backend.Models
{
    public class CResumeParser
    {
        public static string ExtractTextFromPdf(Stream pdfStream)
        {
            using (PdfReader reader = new PdfReader(pdfStream))
            using (PdfDocument pdfDoc = new PdfDocument(reader))
            {
                string extractedText = "";
                for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
                {
                    extractedText += PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i));
                }
                return extractedText;
            }
        }
    }
    public class KeywordExtractor
    {
        private static readonly List<string> predefinedKeywords = new List<string>
        {
            "C#", "ASP.NET", "JavaScript", "SQL", "Python", "Machine Learning", "AI",
            "Software Engineer", "Backend", "Frontend", "Developer", "Database",
            "Cloud", "Docker", "Kubernetes", "Microservices"
        };

        public static List<string> ExtractKeywords(string resumeText)
        {
            // Convert text to lowercase and remove special characters
            resumeText = Regex.Replace(resumeText.ToLower(), "[^a-z0-9\\s]", "");

            // Tokenize text into words
            string[] words = resumeText.Split(' ');

            // Get words that match predefined job-related keywords
            var foundKeywords = predefinedKeywords
                .Where(keyword => words.Contains(keyword.ToLower()))
                .ToList();

            return foundKeywords;
        }
    }
}