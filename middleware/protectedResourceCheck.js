const AuthService = require('../services/authService');
const messageHandler = require('../utils/serverMessageHandler');

async function ProtectedResourceCheck(req, res, next) {
    try {
        console.log('Runngin Protected Resource Check...')
        // Refresh or load tokens if necessary
        const tokens = await AuthService.getAccessToken();
console.log('Getting tokens...')
        if (!tokens || !tokens.access_token) {
            console.log('No tokens found, redirecting to auth...');

            messageHandler.newServerMessage_Handler({
                origin: 'TOKENS_NEEDED',
                server_message: 'New tokens required, redirecting to auth...',
                server_status: 'WAITING',
                server_status_code: 300,
                endpoint: req.originalUrl,
                in_progress: true
            });
console.log('Need new tokens...')
            return res.redirect(`${process.env.BASE_URL}:${process.env.PORT}/${process.env.AUTH_GOOGLE_URL}`);
        }
console.log('All good!...')
        // Proceed if tokens are valid
        next();
    } catch (error) {
        console.error('Error fetching tokens in ProtectedResourceCheck:', error);

        messageHandler.newErrorMessage_Handler({
            origin: 'TOKENS_NEEDED',
            server_message: 'Error fetching protected resource.',
            server_status: 'BADREQUEST',
            server_status_code: 500,
            endpoint: req.originalUrl,
            in_progress: false
        });

        return res.status(500).json({ error: 'Failed to fetch tokens for protected resource' });
    }
}

module.exports = ProtectedResourceCheck;
