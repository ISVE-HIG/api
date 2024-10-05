const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class AuthService extends EventEmitter {
    constructor() {
        super();
        this.tokenPath = path.join(__dirname, '../tokens.json');
        this.oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            'http://localhost:3001/oauth2callback' // Use redirect URI from environment variables
        );
        this.loadTokens();
    }

    // Load tokens from storage
    loadTokens() {
        try {
            if (fs.existsSync(this.tokenPath)) {
                const tokens = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
                this.oAuth2Client.setCredentials(tokens); // Set loaded tokens to OAuth2Client
                console.log('Tokens loaded:', tokens);
            } else {
                console.log('No tokens found, authorization required.');
            }
        } catch (error) {
            console.error('Error loading tokens:', error);
        }
    }

    // Save tokens to file
    async saveTokens(tokens) {
        try {
            fs.writeFileSync(this.tokenPath, JSON.stringify(tokens), 'utf8');
            console.log('Tokens saved:', tokens);
        } catch (error) {
            console.error('Error saving tokens:', error);
        }
    }

    // Generate Google OAuth URL for user authentication
    getAuthUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/drive.metadata.readonly',
        ];
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
    }

    // Exchange authorization code for tokens
    async getTokens(code) {
        try {
            const { tokens } = await this.oAuth2Client.getToken(code);
            this.oAuth2Client.setCredentials(tokens);
            await this.saveTokens(tokens); // Save tokens after obtaining them
            return tokens;
        } catch (error) {
            console.error('Error retrieving tokens:', error);
            throw new Error('Failed to retrieve tokens');
        }
    }

    // Refresh tokens if they are expired
    async refreshAccessToken() {
        try {
            const { credentials } = await this.oAuth2Client.refreshAccessToken();
            this.oAuth2Client.setCredentials(credentials);
            await this.saveTokens(credentials); // Save updated tokens
            console.log('Tokens refreshed:', credentials);
            return credentials;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            throw new Error('Failed to refresh access token');
        }
    }

    // Get current access token, refresh if expiring
async getAccessToken() {
    const tokens = this.oAuth2Client.credentials;

    // Check if tokens exist and are valid
    if (!tokens || Date.now() >= tokens.expiry_date) {
        console.log('Tokens expired or missing, refreshing...');
        return await this.refreshAccessToken(); // Refresh tokens if expired
    }

    console.log('Tokens still valid:', tokens);
    return tokens; // Return valid tokens
}
}

module.exports = new AuthService();
