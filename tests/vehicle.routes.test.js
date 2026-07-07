// Mock do prisma database ANTES de importar
jest.mock('../src/database/prisma-database.js');

import express from 'express';
import vehicleRoutes from '../src/routes/vehicle.routes.js';

describe('Vehicle Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/vehicles', vehicleRoutes);

    jest.clearAllMocks();
  });

  describe('Route Configuration', () => {
    it('should have GET route for listing vehicles', () => {
      const routes = vehicleRoutes.stack
        .filter(r => r.route)
        .map(r => ({ methods: Object.keys(r.route.methods), path: r.route.path }));

      expect(routes.some(r => r.methods.includes('get') && r.path === '/')).toBe(true);
    });

    it('should have GET route for vehicle by id', () => {
      const routes = vehicleRoutes.stack
        .filter(r => r.route)
        .map(r => ({ methods: Object.keys(r.route.methods), path: r.route.path }));

      expect(routes.some(r => r.methods.includes('get') && r.path === '/:id')).toBe(true);
    });

    it('should have POST route for creating vehicle', () => {
      const routes = vehicleRoutes.stack
        .filter(r => r.route)
        .map(r => ({ methods: Object.keys(r.route.methods), path: r.route.path }));

      expect(routes.some(r => r.methods.includes('post') && r.path === '/')).toBe(true);
    });

    it('should have PUT route for updating vehicle', () => {
      const routes = vehicleRoutes.stack
        .filter(r => r.route)
        .map(r => ({ methods: Object.keys(r.route.methods), path: r.route.path }));

      expect(routes.some(r => r.methods.includes('put') && r.path === '/:id')).toBe(true);
    });

    it('should have DELETE route for soft deleting vehicle', () => {
      const routes = vehicleRoutes.stack
        .filter(r => r.route)
        .map(r => ({ methods: Object.keys(r.route.methods), path: r.route.path }));

      expect(routes.some(r => r.methods.includes('delete') && r.path === '/:id')).toBe(true);
    });

    it('should have 6 routes configured', () => {
      const routes = [];
      vehicleRoutes.stack.forEach((r) => {
        if (r.route) {
          routes.push({
            methods: Object.keys(r.route.methods),
            path: r.route.path,
          });
        }
      });

      expect(routes.length).toBe(6);
    });
  });
});
