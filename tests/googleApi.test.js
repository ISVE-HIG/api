const request = require("supertest");
const { app } = require("../server.js"); // Make sure this path is correct
console.log("App instance: ", app); // Add this line to check if app is defined

const AuthService = require("../services/authService");

jest.mock("../services/authService");

let server;

// Start the server before tests
beforeAll((done) => {
    server = app.listen(3002, () => { // Use a different port for testing to avoid conflicts
        console.log("Test server running on port 3002...");
        done();
    });
});

// Close the server after tests
afterAll((done) => {
    server.close(() => {
        console.log("Test server closed");
        done();
    });
});

// Test for Google Auth URL redirection
test("should redirect to Google Auth URL", async () => {
    const response = await request(server).get(`/${process.env.AUTH_GOOGLE_URL}`);
    expect(response.status).toBe(302); // Check for redirect status
});

// Mock the implementation of getTokens
test("should retrieve tokens on callback", async () => {
    const mockCode = "mock_code"; // Simulate an OAuth code
    const mockTokens = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expiry_date: Date.now() + 3600 * 1000, // 1 hour from now
        token_type: 'Bearer',
    };

    // Mock the getTokens method to return mockTokens
    AuthService.getTokens.mockResolvedValue(mockTokens);

    const response = await request(server).get(`/${process.env.OAUTH2_CALLBACK_URL}?code=${mockCode}`);
    expect(response.text).toBe("Authentication successful! Tokens retrieved.");
});

// Handle token retrieval error
test("should handle token retrieval error", async () => {
    const mockCode = "mock_code"; // Simulate an OAuth code
    AuthService.getTokens.mockRejectedValue(new Error("Failed to retrieve tokens"));

    const response = await request(server).get(`/${process.env.OAUTH2_CALLBACK_URL}?code=${mockCode}`);
    expect(response.status).toBe(500); // Expect a server error
    expect(response.text).toBe("Error retrieving tokens");
});

// Server Initialization test
test("should start the server without errors", async () => {
    expect(server).toBeDefined();
});
