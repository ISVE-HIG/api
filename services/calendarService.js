const { google } = require('googleapis');
const AuthService = require('./authService');  // Ensure this points to your OAuth2 client

class CalendarService {
    constructor() {
        // OAuth2Client setup
        this.oAuth2Client = AuthService.oAuth2Client; // Use the OAuth2 client from AuthService
        this.calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
    }

    async getEvents() {
        try {
            const tokens = await AuthService.getAccessToken(); // Ensure tokens are loaded
            this.oAuth2Client.setCredentials(tokens); // Make sure to set valid tokens before request

            const res = await this.calendar.events.list({
                calendarId: 'primary', // Update as needed
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            });

            return res.data.items || [];
        } catch (error) {
            console.error('Error fetching Google Calendar events:', error);
            throw new Error('Failed to fetch Google Calendar events');
        }
    }
}

module.exports = new CalendarService();
