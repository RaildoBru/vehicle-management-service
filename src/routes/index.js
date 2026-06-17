const express = require('express');

const healthRoutes = require('./health.routes');
const vehicleRoutes = require('./vehicle.routes');

const router = express.Router();

router.use(
    healthRoutes,
    vehicleRoutes
);

module.exports = router;