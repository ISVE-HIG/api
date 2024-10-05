// services/tokenManager.js
const fs = require('fs');
const path = require('path');

class TokenManager {
    constructor() {
        this.tokenPath = path.join(__dirname, '../tokens.json');
    }

    saveTokens(tokens) {
        fs.writeFileSync(this.tokenPath, JSON.stringify(tokens));
    }

    getTokens() {
        if (fs.existsSync(this.tokenPath)) {
            const tokens = fs.readFileSync(this.tokenPath);
            return JSON.parse(tokens);
        }
        return null;
    }

    hasTokens() {
        return this.getTokens() !== null;
    }
}

module.exports = new TokenManager();
