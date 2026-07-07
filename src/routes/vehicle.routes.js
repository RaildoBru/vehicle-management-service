import express from 'express';
import prisma from '../database/prisma-database.js';
import vehicleController from '../controllers/vehicle.controller.js';

const router = express.Router();

// GET all vehicles
router.get('/', vehicleController.listVehicles);
// GET vehicle by ID
router.get('/:id', vehicleController.getVehicleById);
// POST create new vehicle
router.post('/', vehicleController.createVehicle);
// PUT update vehicle by ID
router.put('/:id', vehicleController.updateVehicle);
//Soft Delete vehicle by ID
router.delete('/:id', vehicleController.softDelete);

router.patch("/:id/status", vehicleController.patchVehicle);

export default router;