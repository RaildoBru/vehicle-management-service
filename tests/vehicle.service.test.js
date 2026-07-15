// Mock do prisma database ANTES de importar o service
jest.mock('../src/database/prisma-database.js');

import VehicleService from '../src/services/vehicle.service.js';
import vehicleRepository from '../src/repositories/vehicle.repository.js';
import * as stringUtil from '../src/utils/string.util.js';

jest.mock('../src/repositories/vehicle.repository.js');
jest.mock('../src/utils/string.util.js');

describe('VehicleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listVehicles', () => {
    it('should list vehicles with default filters', async () => {
      const mockVehicles = [
        { id: '1', brand: 'Toyota', model: 'Corolla', price: 25000 },
      ];

      vehicleRepository.listVehicles.mockResolvedValue(mockVehicles);

      const result = await VehicleService.listVehicles({});

      expect(result).toEqual(mockVehicles);
      expect(vehicleRepository.listVehicles).toHaveBeenCalledWith({
        status: 'AVAILABLE',
        sortField: 'price',
        sortOrder: 'asc',
      });
    });

    it('should list vehicles with custom status', async () => {
      const mockVehicles = [];
      vehicleRepository.listVehicles.mockResolvedValue(mockVehicles);

      await VehicleService.listVehicles({ status: 'SOLD' });

      expect(vehicleRepository.listVehicles).toHaveBeenCalledWith({
        status: 'SOLD',
        sortField: 'price',
        sortOrder: 'asc',
      });
    });

    it('should use default status AVAILABLE when status is null', async () => {
      vehicleRepository.listVehicles.mockResolvedValue([]);

      await VehicleService.listVehicles({ status: null });

      expect(vehicleRepository.listVehicles).toHaveBeenCalledWith({
        status: 'AVAILABLE',
        sortField: 'price',
        sortOrder: 'asc',
      });
    });

    it('should use custom sort field', async () => {
      vehicleRepository.listVehicles.mockResolvedValue([]);

      await VehicleService.listVehicles({ sortField: 'brand' });

      expect(vehicleRepository.listVehicles).toHaveBeenCalledWith({
        status: 'AVAILABLE',
        sortField: 'brand',
        sortOrder: 'asc',
      });
    });

    it('should handle desc sort order', async () => {
      vehicleRepository.listVehicles.mockResolvedValue([]);

      await VehicleService.listVehicles({ order: 'desc' });

      const callArgs = vehicleRepository.listVehicles.mock.calls[0][0];
      expect(callArgs.status).toBe('AVAILABLE');
      expect(callArgs.sortField).toBe('price');
      expect(callArgs.sortOrder).toBe('desc');
    });

    it('should default to asc for invalid sort order', async () => {
      vehicleRepository.listVehicles.mockResolvedValue([]);

      await VehicleService.listVehicles({ order: 'invalid' });

      const callArgs = vehicleRepository.listVehicles.mock.calls[0][0];
      expect(callArgs.status).toBe('AVAILABLE');
      expect(callArgs.sortField).toBe('price');
      expect(callArgs.sortOrder).toBe('asc');
    });

    it('should merge custom filters with defaults', async () => {
      vehicleRepository.listVehicles.mockResolvedValue([]);

      await VehicleService.listVehicles({
        status: 'RESERVED',
        sortField: 'year',
        order: 'desc',
        customFilter: 'value',
      });

      expect(vehicleRepository.listVehicles).toHaveBeenCalledWith({
        status: 'RESERVED',
        sortField: 'year',
        order: 'desc',
        customFilter: 'value',
        sortOrder: 'desc',
      });
    });
  });

  describe('listAvailableVehicles', () => {
    it('should call repository listAvailableVehicles', async () => {
      const mockVehicles = [{ id: '1', brand: 'Toyota' }];
      vehicleRepository.listAvailableVehicles = jest.fn().mockResolvedValue(mockVehicles);

      const result = await VehicleService.listAvailableVehicles();

      expect(result).toEqual(mockVehicles);
    });
  });

  describe('getVehicleById', () => {
    it('should get vehicle by id', async () => {
      const mockVehicle = { id: '1', brand: 'Toyota', model: 'Corolla' };
      vehicleRepository.getVehicleById.mockResolvedValue(mockVehicle);

      const result = await VehicleService.getVehicleById('1');

      expect(result).toEqual(mockVehicle);
      expect(vehicleRepository.getVehicleById).toHaveBeenCalledWith('1');
    });

    it('should return null when vehicle not found', async () => {
      vehicleRepository.getVehicleById.mockResolvedValue(null);

      const result = await VehicleService.getVehicleById('999');

      expect(result).toBeNull();
    });
  });

  describe('createVehicle', () => {
    beforeEach(() => {
      stringUtil.capitalizeFirstLetter.mockImplementation((str) => str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase());
    });

    it('should create vehicle with valid data', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 2024,
        color: 'blue',
        price: 25000,
      };

      const mockCreatedVehicle = {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Blue',
        price: 25000,
      };

      vehicleRepository.createVehicle.mockResolvedValue(mockCreatedVehicle);

      const result = await VehicleService.createVehicle(vehicleData);

      expect(result).toEqual(mockCreatedVehicle);
      expect(stringUtil.capitalizeFirstLetter).toHaveBeenCalledWith('toyota');
      expect(stringUtil.capitalizeFirstLetter).toHaveBeenCalledWith('corolla');
      expect(stringUtil.capitalizeFirstLetter).toHaveBeenCalledWith('blue');
    });

    it('should throw error when brand is missing', async () => {
      const vehicleData = {
        model: 'corolla',
        year: 2024,
        color: 'blue',
        price: 25000,
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Missing required fields: brand, model, year, color, price'
      );
    });

    it('should throw error when model is missing', async () => {
      const vehicleData = {
        brand: 'toyota',
        year: 2024,
        color: 'blue',
        price: 25000,
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Missing required fields'
      );
    });

    it('should throw error when year is missing', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        color: 'blue',
        price: 25000,
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Missing required fields'
      );
    });

    it('should throw error when color is missing', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 2024,
        price: 25000,
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Missing required fields'
      );
    });

    it('should throw error when price is missing', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 2024,
        color: 'blue',
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Missing required fields'
      );
    });

    it('should throw error when year is not a number', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 'not-a-number',
        color: 'blue',
        price: 25000,
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Invalid year value'
      );
    });

    it('should throw error when year is before 1900', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 1800,
        color: 'blue',
        price: 25000,
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Invalid year value'
      );
    });

    it('should throw error when year is in the future (more than 1 year ahead)', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: new Date().getFullYear() + 2,
        color: 'blue',
        price: 25000,
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Invalid year value'
      );
    });

    it('should accept current year', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: new Date().getFullYear(),
        color: 'blue',
        price: 25000,
      };

      vehicleRepository.createVehicle.mockResolvedValue({ id: '1', ...vehicleData });

      const result = await VehicleService.createVehicle(vehicleData);
      expect(result).toBeDefined();
    });

    it('should accept next year', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: new Date().getFullYear() + 1,
        color: 'blue',
        price: 25000,
      };

      vehicleRepository.createVehicle.mockResolvedValue({ id: '1', ...vehicleData });

      const result = await VehicleService.createVehicle(vehicleData);
      expect(result).toBeDefined();
    });

    it('should throw error when price is not a number', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 2024,
        color: 'blue',
        price: 'not-a-number',
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Price must be a positive number'
      );
    });

    it('should throw error when price is negative', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 2024,
        color: 'blue',
        price: -5000,
      };

      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Price must be a positive number'
      );
    });

    it('should throw error when price is zero', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 2024,
        color: 'blue',
        price: 0,
      };

      // Price 0 is falsy, so it will trigger the "Missing required fields" error
      await expect(VehicleService.createVehicle(vehicleData)).rejects.toThrow(
        'Missing required fields'
      );
    });

    it('should capitalize brand, model, and color', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 2024,
        color: 'blue',
        price: 25000,
      };

      vehicleRepository.createVehicle.mockResolvedValue({
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Blue',
        price: 25000,
      });

      await VehicleService.createVehicle(vehicleData);

      expect(stringUtil.capitalizeFirstLetter).toHaveBeenCalledWith('toyota');
      expect(stringUtil.capitalizeFirstLetter).toHaveBeenCalledWith('corolla');
      expect(stringUtil.capitalizeFirstLetter).toHaveBeenCalledWith('blue');
    });

    it('should include updatedAt in vehicle data', async () => {
      const vehicleData = {
        brand: 'toyota',
        model: 'corolla',
        year: 2024,
        color: 'blue',
        price: 25000,
      };

      vehicleRepository.createVehicle.mockResolvedValue({ id: '1', ...vehicleData });

      await VehicleService.createVehicle(vehicleData);

      const callArgs = vehicleRepository.createVehicle.mock.calls[0][0];
      expect(callArgs.updatedAt).toBeDefined();
      expect(callArgs.updatedAt instanceof Date).toBe(true);
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle', async () => {
      const updateData = { price: 26000 };
      const mockUpdatedVehicle = { id: '1', brand: 'Toyota', price: 26000 };

      vehicleRepository.updateVehicle.mockResolvedValue(mockUpdatedVehicle);

      const result = await VehicleService.updateVehicle('1', updateData);

      expect(result).toEqual(mockUpdatedVehicle);
      expect(vehicleRepository.updateVehicle).toHaveBeenCalledWith('1', updateData);
    });

    it('should return null when vehicle not found', async () => {
      vehicleRepository.updateVehicle.mockResolvedValue(null);

      const result = await VehicleService.updateVehicle('999', { price: 26000 });

      expect(result).toBeNull();
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      vehicleRepository.updateVehicle.mockRejectedValue(error);

      await expect(VehicleService.updateVehicle('1', { price: 26000 })).rejects.toThrow('Update failed');
    });
  });

  describe('softDelete', () => {
    it('should soft delete vehicle', async () => {
      vehicleRepository.softDelete.mockResolvedValue(true);

      const result = await VehicleService.softDelete('1');

      expect(result).toBe(true);
      expect(vehicleRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should return false when vehicle not found', async () => {
      vehicleRepository.softDelete.mockResolvedValue(false);

      const result = await VehicleService.softDelete('999');

      expect(result).toBe(false);
      expect(vehicleRepository.softDelete).toHaveBeenCalledWith('999');
    });

    it('should handle soft delete errors', async () => {
      const error = new Error('Delete failed');
      vehicleRepository.softDelete.mockRejectedValue(error);

      await expect(VehicleService.softDelete('1')).rejects.toThrow('Delete failed');
    });
  });

  describe('patchVehicle', () => {
    it('should patch vehicle status', async () => {
      const mockPatchedVehicle = { id: '1', status: 'SOLD' };
      vehicleRepository.patchVehicle.mockResolvedValue(mockPatchedVehicle);

      const result = await VehicleService.patchVehicle('1', 'SOLD');

      expect(result).toEqual(mockPatchedVehicle);
      expect(vehicleRepository.patchVehicle).toHaveBeenCalledWith('1', 'SOLD');
    });

    it('should return null when vehicle not found', async () => {
      vehicleRepository.patchVehicle.mockResolvedValue(null);

      const result = await VehicleService.patchVehicle('999', 'SOLD');

      expect(result).toBeNull();
      expect(vehicleRepository.patchVehicle).toHaveBeenCalledWith('999', 'SOLD');
    });

    it('should handle patch errors', async () => {
      const error = new Error('Patch failed');
      vehicleRepository.patchVehicle.mockRejectedValue(error);

      await expect(VehicleService.patchVehicle('1', 'SOLD')).rejects.toThrow('Patch failed');
    });
  });
});