const app = require("../server"); // Import your express app

exports.handler = async (event, context) => {
    // You can access query parameters and body from event
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from Netlify Functions!" }),
    };
};
