// api/calendar.js
const express = require('express');
const calendarService = require( '../services/calendarService' );
const checkAuth = require('../middleware/checkAuth');

const ProtectedResourceCheck = require('../middleware/protectedResourceCheck');

const router = express.Router();

router.use( checkAuth )


// Fetch events from Google Calendar
router.get( '/events',  async ( req, res ) => {
    try {
        const events = await calendarService.getEvents();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send(`Error fetching events: ${res.error}`);
    }
});

module.exports = router;
