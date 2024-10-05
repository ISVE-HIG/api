const axios = require('axios');

// Replace with your server URL and Google Drive folder ID
const serverUrl = 'http://localhost:3001/api/files';
const folderId = '17yBwdRfyeXhTlWYnBgavqS7gtUXQLmoi'; // Replace with the folder ID you want to test

async function testFetchFiles() {
    try {
        const response = await axios.get(serverUrl, {
            params: {
                folderId: folderId
            }
        });
        console.log('Files fetched successfully:', response.data.files);
    } catch (error) {
        console.error('Error fetching files:', error.message);
    }
}

// Run the test
testFetchFiles();