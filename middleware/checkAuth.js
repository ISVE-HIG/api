// middleware/checkAuth.js
const TokenManager = require('../services/tokenManager');

function checkAuth(req, res, next) {
    if (!TokenManager.hasTokens()) {
        return res.status(403).send('Unauthorized: Please authenticate first.');
    }
    next();
}

module.exports = checkAuth;
