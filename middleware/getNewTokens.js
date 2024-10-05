const AuthService = require('../services/authService');
const messageHandler = require('../utils/serverMessageHandler');

async function getNewTokens() {
    return new Promise(async (resolve, reject) => {
        try {
            const tokens = AuthService.oAuth2Client.credentials;

            if (!tokens || !tokens.access_token) {
                console.log('New tokens required, requesting authorization...');
                
                messageHandler.newServerMessage_Handler({
                    origin: 'TOKEN_NEEDED',
                    server_message: 'Requesting new tokens...',
                    server_status: 'WAITING',
                    server_status_code: 300,
                    endpoint: '/auth/google',
                    in_progress: true,
                });

                // Listen for token reception event
                AuthService.once('token_received', (newTokens) => {
                    resolve(newTokens);
                });

            } else {
                resolve(tokens);  // Return existing tokens
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = getNewTokens;
