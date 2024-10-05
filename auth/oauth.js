// auth/oauth.js
const express = require('express');

//const { client_secret, client_id, redirect_uris } = JSON.parse(process.env.CREDENTIALS);

const router = express.Router();

const AuthService = require( './services/authService' );


// Generate a URL to request access
const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/calendar.readonly'],
});

router.get('/auth/google', (req, res) => {
    const url = AuthService.getAuthUrl();
    res.redirect(url);
});

router.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    try {
        const tokens = await AuthService.getTokens(code);
        console.log(tokens); // You will see your tokens here
        res.send('Authentication successful! Tokens retrieved. Check the console.');
    } catch (error) {
        console.error('Error retrieving tokens:', error);
        res.status(500).send('Error retrieving tokens');
    }
});

module.exports = router;
