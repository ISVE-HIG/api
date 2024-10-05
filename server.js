// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Routes = require("./api/routes");
const fs = require("fs");
const path = require("path");
const AuthService = require("./services/authService");
const messageHandler = require("./utils/serverMessageHandler");
const functions = require("firebase-functions");
const https = require("https")

const app = express();
const BASE_URL = process.env.BASE_URL || "https://www.api.isve.se";

const options = {
    key: fs.readFileSync(''),
    cert: fs.readFileSync(''),
}



app.use(cors());
app.use(express.json());



// Google authentication routes
app.get(`/${process.env.AUTH_GOOGLE_URL}`, (req, res) => {
    const url = AuthService.getAuthUrl();
    res.redirect(url);
});

app.get(`/${process.env.OAUTH2_CALLBACK_URL}`, async (req, res) => {
    const code = req.query.code;
    try {
        const tokens = await AuthService.getTokens(code);
        updateEnv(tokens);
        res.send("Authentication successful! Tokens retrieved.");
    } catch (error) {
        console.error("Error retrieving tokens:", error);
        res.status(500).send("Error retrieving tokens");
    }
});

// Initialize routes
const routes = new Routes(app);

// Update environment variables with tokens
function updateEnv(tokens) {
    const envPath = path.join(__dirname, '../.env');
    const newEnvContent = `
CLIENT_ID=${process.env.CLIENT_ID}
CLIENT_SECRET=${process.env.CLIENT_SECRET}
REDIRECT_URI=${process.env.REDIRECT_URI}
ACCESS_TOKEN=${tokens.access_token}
REFRESH_TOKEN=${tokens.refresh_token}
`;
    fs.writeFileSync(envPath, newEnvContent.trim());
}

module.exports = {app}
// Export the app for Firebase Functions
exports.api = functions.https.onRequest(app);

if (require.main === module) {
const server = https.createServer(options, (res, req) => {

    const PORT = process.env.SERVER_PORT || 443; // Use a default for local development
    const serverMessage = {
        origin: "APP_STARTUP",
        server_message: `Server is running on: ${BASE_URL}:${SERVER_PORT}`,
        server_status: "OK",
        server_status_code: 200,
        endpoint: "SERVER",
        in_progress: false,
    };

    console.log("Server Message:", serverMessage);
    messageHandler.newServerMessage_Handler(serverMessage);
}).listen(SERVER_PORT)

}
