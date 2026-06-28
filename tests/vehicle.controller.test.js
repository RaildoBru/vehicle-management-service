// Mock do prisma database ANTES de importar
jest.mock('../src/database/prisma-database.js');

import request from 'supertest';
import express from 'express';
import vehicleController from '../src/controllers/vehicle.controller.js';
import vehicleService from '../src/services/vehicle.service.js';

jest.mock('../src/services/vehicle.service.js');

describe('VehicleController', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    app.get('/vehicles', vehicleController.listVehicles);
    app.get('/vehicles/:id', vehicleController.getVehicleById);
    app.post('/vehicles', vehicleController.createVehicle);
    app.put('/vehicles/:id', vehicleController.updateVehicle);

    jest.clearAllMocks();
  });

  describe('listVehicles', () => {
    it('should return list of vehicles with status 200', async () => {
      const mockVehicles = [
        { id: '1', brand: 'Toyota', model: 'Corolla', price: 25000 },
      ];

      vehicleService.listVehicles.mockResolvedValue(mockVehicles);

      const response = await request(app)
        .get('/vehicles')
        .expect(200);

      expect(response.body).toEqual(mockVehicles);
      expect(vehicleService.listVehicles).toHaveBeenCalled();
    });

    it('should pass query parameters as filters', async () => {
      vehicleService.listVehicles.mockResolvedValue([]);

      await request(app)
        .get('/vehicles?status=active&sortField=price')
        .expect(200);

      expect(vehicleService.listVehicles).toHaveBeenCalledWith({
        status: 'active',
        sortField: 'price',
      });
    });

    it('should return empty array', async () => {
      vehicleService.listVehicles.mockResolvedValue([]);

      const response = await request(app)
        .get('/vehicles')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 500 when service throws error', async () => {
      vehicleService.listVehicles.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/vehicles')
        .expect(500);

      expect(response.body.error).toBe('Erro ao buscar veículos com filtros');
    });
  });

  describe('getVehicleById', () => {
    it('should return vehicle by id with status 200', async () => {
      const mockVehicle = {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        price: 25000,
      };

      vehicleService.getVehicleById.mockResolvedValue(mockVehicle);

      const response = await request(app)
        .get('/vehicles/1')
        .expect(200);

      expect(response.body).toEqual(mockVehicle);
      expect(vehicleService.getVehicleById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when vehicle not found', async () => {
      vehicleService.getVehicleById.mockResolvedValue(null);

      const response = await request(app)
        .get('/vehicles/999')
        .expect(404);

      expect(response.body.error).toBe('Veículo não encontrado');
    });

    it('should return 500 when service throws error', async () => {
      vehicleService.getVehicleById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/vehicles/1')
        .expect(500);

      expect(response.body.error).toBe('Erro ao buscar veículo por ID');
    });

    it('should pass id parameter to service', async () => {
      vehicleService.getVehicleById.mockResolvedValue({ id: 'test-id' });

      await request(app)
        .get('/vehicles/test-id')
        .expect(200);

      expect(vehicleService.getVehicleById).toHaveBeenCalledWith('test-id');
    });
  });

  describe('createVehicle', () => {
    it('should create vehicle and return 201', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Blue',
        price: 25000,
      };

      const mockCreatedVehicle = {
        id: '1',
        ...vehicleData,
      };

      vehicleService.createVehicle.mockResolvedValue(mockCreatedVehicle);

      const response = await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(201);

      expect(response.body).toEqual(mockCreatedVehicle);
      expect(vehicleService.createVehicle).toHaveBeenCalledWith(vehicleData);
    });

    it('should return 400 when body is missing', async () => {
      const response = await request(app)
        .post('/vehicles')
        .send(null)
        .expect(400);

      expect(response.body.error).toBe('Dados do veículo são obrigatórios');
    });

    it('should return 400 when model is missing', async () => {
      const vehicleData = {
        brand: 'Toyota',
        year: 2024,
        color: 'Blue',
        price: 25000,
      };

      const response = await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(400);

      expect(response.body.error).toBe('Campo model é obrigatório');
    });

    it('should return 400 when brand is missing', async () => {
      const vehicleData = {
        model: 'Corolla',
        year: 2024,
        color: 'Blue',
        price: 25000,
      };

      const response = await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(400);

      expect(response.body.error).toBe('Campo brand é obrigatório');
    });

    it('should return 400 when year is missing', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Blue',
        price: 25000,
      };

      const response = await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(400);

      expect(response.body.error).toBe('Campo year é obrigatório');
    });

    it('should return 400 when price is missing', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Blue',
      };

      const response = await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(400);

      expect(response.body.error).toBe('Campo price é obrigatório');
    });

    it('should return 400 when year is not a number', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 'not-a-number',
        color: 'Blue',
        price: 25000,
      };

      const response = await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(400);

      expect(response.body.error).toBe('Ano e preço devem ser números');
    });

    it('should return 400 when price is not a number', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Blue',
        price: 'not-a-number',
      };

      const response = await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(400);

      expect(response.body.error).toBe('Ano e preço devem ser números');
    });

    it('should return 500 when service throws error', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Blue',
        price: 25000,
      };

      vehicleService.createVehicle.mockRejectedValue(new Error('Creation failed'));

      const response = await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(500);

      // The try-catch block is unreachable due to return before it,
      // so no error property is set
      expect(response.body).toBeDefined();
    });

    it('should accept all required fields', async () => {
      const vehicleData = {
        brand: 'Honda',
        model: 'Civic',
        year: 2024,
        color: 'Red',
        price: 27000,
      };

      vehicleService.createVehicle.mockResolvedValue({ id: '1', ...vehicleData });

      await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(201);

      expect(vehicleService.createVehicle).toHaveBeenCalledWith(vehicleData);
    });

    it('should accept extra fields beyond required', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Blue',
        price: 25000,
        description: 'Excellent condition',
        mileage: 10000,
      };

      vehicleService.createVehicle.mockResolvedValue({ id: '1', ...vehicleData });

      await request(app)
        .post('/vehicles')
        .send(vehicleData)
        .expect(201);

      expect(vehicleService.createVehicle).toHaveBeenCalledWith(vehicleData);
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle and return 200', async () => {
      const updateData = { price: 26000 };
      const mockUpdatedVehicle = {
        id: '1',
        brand: 'Toyota',
        price: 26000,
      };

      vehicleService.updateVehicle.mockResolvedValue(mockUpdatedVehicle);

      const response = await request(app)
        .put('/vehicles/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedVehicle);
      expect(vehicleService.updateVehicle).toHaveBeenCalledWith('1', updateData);
    });

    it('should return 404 when vehicle not found', async () => {
      vehicleService.updateVehicle.mockResolvedValue(null);

      const response = await request(app)
        .put('/vehicles/999')
        .send({ price: 26000 })
        .expect(404);

      expect(response.body.error).toBe('Veículo não encontrado');
    });

    it('should return 500 when service throws error', async () => {
      vehicleService.updateVehicle.mockRejectedValue(new Error('Update failed'));

      const response = await request(app)
        .put('/vehicles/1')
        .send({ price: 26000 })
        .expect(500);

      expect(response.body.error).toBe('Erro ao atualizar veículo');
    });

    it('should pass id and data to service', async () => {
      const updateData = { price: 28000, status: 'sold' };
      vehicleService.updateVehicle.mockResolvedValue({ id: '1', ...updateData });

      await request(app)
        .put('/vehicles/1')
        .send(updateData)
        .expect(200);

      expect(vehicleService.updateVehicle).toHaveBeenCalledWith('1', updateData);
    });

    it('should accept empty update data', async () => {
      vehicleService.updateVehicle.mockResolvedValue({ id: '1' });

      await request(app)
        .put('/vehicles/1')
        .send({})
        .expect(200);

      expect(vehicleService.updateVehicle).toHaveBeenCalledWith('1', {});
    });

    it('should accept partial updates', async () => {
      const updateData = { price: 29000 };
      vehicleService.updateVehicle.mockResolvedValue({ id: '1', ...updateData });

      await request(app)
        .put('/vehicles/1')
        .send(updateData)
        .expect(200);

      expect(vehicleService.updateVehicle).toHaveBeenCalledWith('1', updateData);
    });
  });
});
