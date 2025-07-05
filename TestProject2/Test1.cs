using backend.Repository;

namespace TestProject2
{
    [TestClass]
    public sealed class Test1
    {
        public void JobApplicationApprove_ShouldReturnTrue_WhenApplicationExists()
        {
            // Arrange
            var repo = new EmployerRepository();
            int testAppId = 101; // You must ensure this ID exists in test DB

            // Act
            var result = repo.JobApplicationApprove(testAppId);

            // Assert
            Assert.IsTrue(result, "Application approval should return true if update is successful.");
        }
    }
}
