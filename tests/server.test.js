const request = require('supertest');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const AuthService = require('../services/authService'); // Import AuthService
const app = require('../server'); // Import the app
const messageHandler = require("../utils/serverMessageHandler");
const PORT = 3001;
const BASE_URL = "http://localhost";
dotenv.config(); // Load environment variables

let server;





describe('API Tests', () => {

    beforeAll((done) => {

    server = app.listen(PORT, () => {
        console.log(`Test server running on ${PORT}`)
        done();
    })

    process.env.ACCESS_TOKEN = 'mock_access_token';
    process.env.REFRESH_TOKEN = 'mock_refresh_token';
    jest.setTimeout(1000)
});

    beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

    it('should redirect to Google authentication URL', async () => {
     const response = await request(app) // Use the app instance
         .get(`/${process.env.AUTH_GOOGLE_URL}`)
         .expect(302); // Expect a redirect

     // Validate the Location header contains the URL
     const redirectUrl = response.headers.location;
     expect(redirectUrl).toBeDefined();
     expect(redirectUrl).toMatch(/https:\/\/accounts\.google\.com/); // Adjust based on expected redirect
 });



 it('should retrieve tokens and respond with success message', async () => {
     // Mock the AuthService.getTokens method
     jest.spyOn(AuthService, 'getTokens').mockResolvedValue({
         access_token: 'mock_access_token',
         refresh_token: 'mock_refresh_token'
     });

     const response = await request(app)
         .get(`/${process.env.OAUTH2_CALLBACK_URL}`)
         .query({ code: 'mock_code' })
         .expect(200); // Expect a success response

     expect(response.text).toBe('Authentication successful! Tokens retrieved.');

     // Check if tokens were written to the .env file
     const envPath = path.join(__dirname, '../.env.test');
     const envContent = fs.readFileSync(envPath, 'utf8');

     // Fix quotes around token values if present
     const cleanedEnvContent = envContent.replace(/\"/g, '');

     expect(cleanedEnvContent).toContain('ACCESS_TOKEN=mock_access_token');
     expect(cleanedEnvContent).toContain('REFRESH_TOKEN=mock_refresh_token');
 });


 it('should return an error if tokens retrieval fails', async () => {
     // Mock the AuthService.getTokens method to throw an error
     jest.spyOn(AuthService, 'getTokens').mockRejectedValue(new Error('Token retrieval error'));

     const response = await request(app)
         .get(`/${process.env.OAUTH2_CALLBACK_URL}`)
         .query({ code: 'mock_code' })
         .expect(500); // Expect an error response

     expect(response.text).toBe('Error retrieving tokens');
 });



  // Ensure proper teardown
 afterAll(async () => {
     jest.clearAllMocks();
     jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    await new Promise((resolve) => {
        server.close(() => {
            console.log('Test server closed');
            resolve();
        });
    });
    })
});
