// ResumeParsingService.cs
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class ResumeParsingService
{
    private readonly HttpClient _httpClient;

    public ResumeParsingService()
    {
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_COHERE_API_KEY");
    }

    public async Task<string> ParseResumeAsync(string resumeText)
    {
        var requestBody = new
        {
            model = "command",
            prompt = $"Extract the skills, experience, and qualifications from this resume:\n{resumeText}",
            max_tokens = 300,
            temperature = 0.3
        };

        string jsonContent = JsonConvert.SerializeObject(requestBody);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("https://api.cohere.ai/v1/generate", content);
        response.EnsureSuccessStatusCode();

        var responseString = await response.Content.ReadAsStringAsync();
        return responseString;
    }
}
