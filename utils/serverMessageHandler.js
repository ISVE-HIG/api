const winston = require( 'winston' );
const EventEmitter = require('events');



class ServerMessageHandler extends EventEmitter {
  
    constructor () {
        super();
        this.serverMessages = [];

        this.logger = winston.createLogger( {
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File( { filename: 'server.log' } ),
                new winston.transports.Console()
            ]
        } )
        
    }   

 

    

    
   // Define the message structure for validation
    validateMessage( message ) {
        const schema = {
            origin: {
                type: 'string',
                required: true,
            },
            server_message: { type: 'string', required: true },
            server_status: {
                type: 'string',
                required: true,
                allowedValues: [ 'OK', 'WAITING', 'ERROR', 'NOTFOUND', 'BADREQUEST', 'NETWORKERROR' ]
            },
            server_status_code: {
                type: 'number',
                required: true,
                allowedValues: [ 200, 300, 400, 404, 500, 504 ],
            },
            response_date: { type: 'string', required: false },
            endpoint: {
                type: 'string',
                required: true,
            },
            in_progress: {
                type: 'boolean',
                required: true,
                allowedValues: [ true, false ],
            },
        };
    
for (const key in schema) {
    if (schema[key].required && !message[key]) {
        console.error(`Validation failed: Missing required field: ${key}`);
        throw new Error(`Missing required field: ${key}`);
    }
    if (message[key] && typeof message[key] !== schema[key].type) {
        console.error(`Validation failed: Invalid type for field ${key}: expected ${schema[key].type}, got ${typeof message[key]}`);
        throw new Error(`Invalid type for field ${key}: expected ${schema[key].type}, got ${typeof message[key]}`);
    }
    if (schema[key].allowedValues && !schema[key].allowedValues.includes(message[key])) {
        console.error(`Validation failed: Invalid value for field ${key}: ${message[key]} is not allowed`);
        throw new Error(`Invalid value for field ${key}: ${message[key]} is not allowed`);
    }
}

    }
    newServerMessage_Handler (serverMessage) {
        try {
            console.log("Handling new server message:", serverMessage); // Log the message before validation
            this.validateMessage(serverMessage);
            this.serverMessage = { ...serverMessage, response_date: new Date().toISOString() };

            if ( serverMessage.origin === 'TOKEN_NEEDED' ) {
                console.log( 'Waiting for new tokens...' )
                this.logger.info( 'Waiting for new tokens...' )
                this.emit('wait_for_token')
            }
            
        } catch (error) {
            console.error('Failed to handle new server message:', error.message);
            console.error('Server message object:', serverMessage); // Log the entire object for debugging
        }
    }

    newErrorMessage_Handler (serverMessage) {
        // Optionally handle errors differently
        try {
            this.validateMessage(serverMessage);
            serverMessage.server_status = 'ERROR'; // Set the status to error
            serverMessage.response_data = new Date().toISOString();
            this.serverMessages.push(serverMessage);
            console.log( 'New error message added:', serverMessage );
            this.logger.error('New error message: ', serverMessage)
        } catch (error) {
            console.error('Failed to handle new error message:', error.message);
        }
    }


} module.exports = new ServerMessageHandler();

