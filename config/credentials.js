// config/credentials.js
const credentials = JSON.parse(process.env.CREDENTIALS);

module.exports = {
    client_id: credentials.client_id,
    client_secret: credentials.client_secret,
    redirect_uris: credentials.redirect_uris,
};