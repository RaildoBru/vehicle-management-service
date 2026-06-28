import express from 'express';

import healthRoutes from './health.routes.js';
import vehicleRoutes from './vehicle.routes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/vehicles', vehicleRoutes);
export default router;