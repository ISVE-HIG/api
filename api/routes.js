// api/routes.js
const express = require('express');
const driveRoutes = require('./drive');
const calendarRoutes = require('./calendar');
const ProtectedResourceCheck = require('../middleware/protectedResourceCheck');

class Routes {
    constructor(app) {
        this.app = app;
        this.initializeRoutes();
    }

    initializeRoutes () {
        this.app.use('/api', ProtectedResourceCheck, driveRoutes);
        this.app.use('/api', ProtectedResourceCheck, calendarRoutes );
 
    }
}

module.exports = Routes;
