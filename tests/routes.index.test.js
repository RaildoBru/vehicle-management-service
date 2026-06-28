// Mock do prisma database ANTES de importar
jest.mock('../src/database/prisma-database.js');

import express from 'express';
import mainRoutes from '../src/routes/index.js';

describe('Main Routes (index.js)', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/', mainRoutes);
  });

  describe('Route Organization', () => {
    it('should mount health routes', () => {
      const routes = mainRoutes.stack.filter(r => r.route || r.name === 'router');
      expect(routes.length).toBeGreaterThan(0);
    });

    it('should have routes configured', () => {
      expect(mainRoutes.stack.length).toBeGreaterThan(0);
    });

    it('should have at least 2 main routes (health and vehicles)', () => {
      const routes = mainRoutes.stack.filter(r => r.name === 'router');
      expect(routes.length).toBeGreaterThanOrEqual(2);
    });
  });
});
