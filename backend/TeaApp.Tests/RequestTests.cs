using TeaApp.Tests.Helpers;

namespace TeaApp.Tests;

public class RequestTests(TeaAppFactory factory) : IClassFixture<TeaAppFactory> {
    private readonly HttpClient _client = factory.CreateClient();
    private readonly RequestTestHelper _helper = new();
    private readonly string _testUser = "TBD";
    private readonly string _testAdmin = "TBD";

    [Fact]
    public async Task CreateRequest_ShouldWorkCorrectly() {
        //as user create Requests (PublishRequest)
        //as admin getPending, newly created there?
        //as user getUsers, newly created there?
        //cleanup
    }

    [Fact]
    public async Task CancelRequest_ShouldWorkCorrectly() {
        //as user create Tea
        //as user create Requests (PublishRequest)
        //as user cancel request
        //as user usersRequest, is there newly created Request?
        //as admin getPending, is there newly created Request?
        //cleanup
    }

    [Fact]
    public async Task GetPendingRequests_ShouldWorkCorrectly() {
        //as admin getPendingRequests
        //Authorized?
    }

    [Fact]
    public async Task GetUserRequests_ShouldWorkCorrectly() {
        //as user getRequests
        //Authorized?
    }

    [Fact]
    public async Task PublishRequestAcceptFlow_ShouldWorkCorrectly() {
        //as user create Tea
        //as user create Publish Request for the tea
        //as user get usersRequest, is there newly created request? Pending?
        //as admin get pending, is there newly created request?
        //as admin resolve positive
        //as admin getPending, is it gone?
        //as user getUsers, is it accepted?
        //is created Tea public?
        //cleanup
    }

    [Fact]
    public async Task PublishRequestRejectFlow_ShouldWorkCorrectly() {
        //as user create Tea
        //as user create Publish Request for the tea
        //as user get usersRequest, is there newly created request? Pending?
        //as admin get pending, is there newly created request?
        //as admin resolve negative
        //as admin getPending, is it gone?
        //as user getUsers, is it rejected?
        //is created Tea public?
        //cleanup
    }
}