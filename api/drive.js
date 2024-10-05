// api/drive.js
const express = require('express');
const driveService = require( '../services/driveService' );
const path = require('path');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();
const ProtectedResourceCheck = require('../middleware/protectedResourceCheck');

// Load service account credentials
const credentials = require( path.join( __dirname, '../google-service-account.json' ) );


router.use(checkAuth)

// Route to get folder name by folder ID
router.get( '/folderName',async ( req, res ) => {
            const folderId = req.query.folderId;
            if (!folderId) {
                return res.status(400).json({ error: 'folderId is required' });
            }

            try {
                const folderName = await driveService.getFolderName(folderId);
                res.json({ name: folderName });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
});

// Route to fetch files
router.get( '/files', async ( req, res ) => {
    
    const folderId = req.query.folderId;

    if (!folderId) {
        return res.status(400).json({ error: 'folderId is required' });
    }

    try {
        const files = await driveService.listFiles(folderId);
        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
