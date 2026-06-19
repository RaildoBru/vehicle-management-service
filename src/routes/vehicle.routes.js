import express from 'express';
import prisma from '../database/prisma-database.js';
import vehicleController from '../controllers/vehicle.controller.js';

const router = express.Router();

// GET all vehicles
router.get('/vehicles', vehicleController.listVehicles);
// GET vehicle by ID
router.get('/vehicles/:id', vehicleController.getVehicleById);
// POST create new vehicle
router.post('/vehicles', vehicleController.createVehicle);

router.put('/vehicles/:id', vehicleController.updateVehicle);

export default router;