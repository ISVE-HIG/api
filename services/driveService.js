// services/driveService.js
const { google } = require('googleapis');
const path = require( 'path' );

const AuthService = require('./authService');


class DriveService {
    

    async getFolderName ( folderId ) {
        const tokens = await AuthService.getAccessToken();
        const drive = google.drive({ version: 'v3', auth: AuthService.oAuth2Client });

        try {
            const response = await drive.files.get({
                fileId: folderId,
                fields: 'name',
            });
            return response.data.name;
        } catch (error) {
            console.error('Error fetching folder name:', error);
            throw new Error('Failed to fetch folder name');
        }
    }

    async listFiles ( folderId ) {
        const tokens = await AuthService.getAccessToken();
        const drive = google.drive( { version: 'v3', auth: AuthService.oAuth2Client } );
        

        try {
            const response = await drive.files.list({
                q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
                fields: 'files(id, name)',
            });
            return response.data.files;
        } catch (error) {
            console.error('Error fetching files:', error);
            throw new Error('Failed to fetch files');
        }
    }
}

module.exports = new DriveService();
