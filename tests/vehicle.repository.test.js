// Mock do prisma
jest.mock('../src/database/prisma-database.js');

import VehicleRepository from '../src/repositories/vehicle.repository.js';
import prisma from '../src/database/prisma-database.js';

describe('VehicleRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listVehicles', () => {
    it('should list all vehicles with default filters', async () => {
      const mockVehicles = [
        { id: '1', brand: 'Toyota', model: 'Corolla', price: 25000, status: 'active' },
        { id: '2', brand: 'Honda', model: 'Civic', price: 27000, status: 'active' },
      ];

      prisma.vehicles.findMany.mockResolvedValue(mockVehicles);

      const result = await VehicleRepository.listVehicles();

      expect(result).toEqual(mockVehicles);
      expect(prisma.vehicles.findMany).toHaveBeenCalledWith({
        select: { id: true, brand: true, model: true, price: true, status: true },
        where: { deletedAt: null },
        orderBy: { price: 'asc' },
      });
    });

    it('should list vehicles filtered by status', async () => {
      const mockVehicles = [
        { id: '1', brand: 'Toyota', model: 'Corolla', price: 25000, status: 'active' },
      ];

      prisma.vehicles.findMany.mockResolvedValue(mockVehicles);

      const result = await VehicleRepository.listVehicles({ status: 'active' });

      expect(result).toEqual(mockVehicles);
      expect(prisma.vehicles.findMany).toHaveBeenCalledWith({
        select: { id: true, brand: true, model: true, price: true, status: true },
        where: { deletedAt: null, status: 'active' },
        orderBy: { price: 'asc' },
      });
    });

    it('should list vehicles with custom sort field', async () => {
      const mockVehicles = [
        { id: '1', brand: 'Audi', model: 'A4', price: 45000, status: 'active' },
      ];

      prisma.vehicles.findMany.mockResolvedValue(mockVehicles);

      const result = await VehicleRepository.listVehicles({ 
        sortField: 'brand',
        sortOrder: 'desc'
      });

      expect(result).toEqual(mockVehicles);
      expect(prisma.vehicles.findMany).toHaveBeenCalledWith({
        select: { id: true, brand: true, model: true, price: true, status: true },
        where: { deletedAt: null },
        orderBy: { brand: 'desc' },
      });
    });

    it('should list vehicles with multiple filters', async () => {
      const mockVehicles = [
        { id: '1', brand: 'Toyota', model: 'Corolla', price: 25000, status: 'active' },
      ];

      prisma.vehicles.findMany.mockResolvedValue(mockVehicles);

      const result = await VehicleRepository.listVehicles({
        status: 'active',
        sortField: 'price',
        sortOrder: 'desc'
      });

      expect(result).toEqual(mockVehicles);
      expect(prisma.vehicles.findMany).toHaveBeenCalledWith({
        select: { id: true, brand: true, model: true, price: true, status: true },
        where: { deletedAt: null, status: 'active' },
        orderBy: { price: 'desc' },
      });
    });

    it('should return empty array when no vehicles found', async () => {
      prisma.vehicles.findMany.mockResolvedValue([]);

      const result = await VehicleRepository.listVehicles();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw error when prisma findMany fails', async () => {
      const errorMessage = 'Database connection error';
      prisma.vehicles.findMany.mockRejectedValue(new Error(errorMessage));

      await expect(VehicleRepository.listVehicles()).rejects.toThrow(errorMessage);
    });
  });

  describe('getVehicleById', () => {
    it('should get vehicle by id', async () => {
      const mockVehicle = {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        price: 25000,
        status: 'active'
      };

      prisma.vehicles.findUnique.mockResolvedValue(mockVehicle);

      const result = await VehicleRepository.getVehicleById('1');

      expect(result).toEqual(mockVehicle);
      expect(prisma.vehicles.findUnique).toHaveBeenCalledWith({
        select: { id: true, brand: true, model: true, price: true, status: true },
        where: { id: '1', deletedAt: null }
      });
    });

    it('should return null when vehicle not found', async () => {
      prisma.vehicles.findUnique.mockResolvedValue(null);

      const result = await VehicleRepository.getVehicleById('999');

      expect(result).toBeNull();
    });

    it('should throw error when findUnique fails', async () => {
      const errorMessage = 'Database error';
      prisma.vehicles.findUnique.mockRejectedValue(new Error(errorMessage));

      await expect(VehicleRepository.getVehicleById('1')).rejects.toThrow(errorMessage);
    });

    it('should handle invalid id format', async () => {
      prisma.vehicles.findUnique.mockResolvedValue(null);

      const result = await VehicleRepository.getVehicleById('invalid-id');

      expect(result).toBeNull();
      expect(prisma.vehicles.findUnique).toHaveBeenCalledWith({
        select: { id: true, brand: true, model: true, price: true, status: true },
        where: { id: 'invalid-id', deletedAt: null }
      });
    });
  });

  describe('createVehicle', () => {
    it('should create a new vehicle', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        price: 25000,
        status: 'active'
      };

      const mockCreatedVehicle = {
        id: '1',
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prisma.vehicles.create.mockResolvedValue(mockCreatedVehicle);

      const result = await VehicleRepository.createVehicle(vehicleData);

      expect(result).toEqual(mockCreatedVehicle);
      expect(prisma.vehicles.create).toHaveBeenCalledWith({
        data: vehicleData,
        omit: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        }
      });
    });

    it('should create vehicle with all required fields', async () => {
      const vehicleData = {
        brand: 'Honda',
        model: 'Civic',
        price: 27000,
        status: 'active',
        color: 'blue',
        year: 2024
      };

      const mockCreatedVehicle = {
        id: '2',
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prisma.vehicles.create.mockResolvedValue(mockCreatedVehicle);

      const result = await VehicleRepository.createVehicle(vehicleData);

      expect(result).toEqual(mockCreatedVehicle);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });

    it('should throw error when create fails', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        price: 25000
      };

      const errorMessage = 'Invalid data provided';
      prisma.vehicles.create.mockRejectedValue(new Error(errorMessage));

      await expect(VehicleRepository.createVehicle(vehicleData)).rejects.toThrow(errorMessage);
    });

    it('should handle duplicate vehicle creation', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Corolla',
        price: 25000
      };

      const errorMessage = 'Unique constraint failed';
      prisma.vehicles.create.mockRejectedValue(new Error(errorMessage));

      await expect(VehicleRepository.createVehicle(vehicleData)).rejects.toThrow(errorMessage);
    });

    it('should preserve all data fields when creating', async () => {
      const vehicleData = {
        brand: 'BMW',
        model: 'X5',
        price: 85000,
        status: 'active',
        color: 'black',
        year: 2024,
        description: 'Luxury SUV'
      };

      const mockCreatedVehicle = {
        id: '3',
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prisma.vehicles.create.mockResolvedValue(mockCreatedVehicle);

      const result = await VehicleRepository.createVehicle(vehicleData);

      expect(result).toEqual(mockCreatedVehicle);
      expect(result.description).toBe(vehicleData.description);
    });
  });

  describe('updateVehicle', () => {
    it('should update an existing vehicle', async () => {
      const updateData = { price: 26000, status: 'inactive' };
      
      const mockUpdatedVehicle = {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        price: 26000,
        status: 'inactive',
        updatedAt: new Date()
      };

      prisma.vehicles.update.mockResolvedValue(mockUpdatedVehicle);

      const result = await VehicleRepository.updateVehicle('1', updateData);

      expect(result).toEqual(mockUpdatedVehicle);
      expect(prisma.vehicles.update).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
        data: {
          ...updateData,
          updatedAt: expect.any(Date)
        },
        omit: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        }
      });
    });

    it('should update single field only', async () => {
      const updateData = { price: 28000 };

      const mockUpdatedVehicle = {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        price: 28000,
        status: 'active',
        updatedAt: new Date()
      };

      prisma.vehicles.update.mockResolvedValue(mockUpdatedVehicle);

      const result = await VehicleRepository.updateVehicle('1', updateData);

      expect(result.price).toBe(28000);
      expect(prisma.vehicles.update).toHaveBeenCalled();
    });

    it('should always update the updatedAt timestamp', async () => {
      const updateData = { price: 29000 };

      prisma.vehicles.update.mockResolvedValue({
        id: '1',
        price: 29000,
        updatedAt: new Date()
      });

      await VehicleRepository.updateVehicle('1', updateData);

      const callArgs = prisma.vehicles.update.mock.calls[0][0];
      expect(callArgs.data.updatedAt).toBeDefined();
      expect(callArgs.data.updatedAt instanceof Date).toBe(true);
    });

    it('should throw error when vehicle not found', async () => {
      const errorMessage = 'Vehicle not found';
      prisma.vehicles.update.mockRejectedValue(new Error(errorMessage));

      await expect(VehicleRepository.updateVehicle('999', { price: 30000 })).rejects.toThrow(errorMessage);
    });

    it('should throw error when update fails due to validation', async () => {
      const errorMessage = 'Invalid update data';
      prisma.vehicles.update.mockRejectedValue(new Error(errorMessage));

      const updateData = { price: -1000 }; // Invalid negative price

      await expect(VehicleRepository.updateVehicle('1', updateData)).rejects.toThrow(errorMessage);
    });

    it('should merge update data with existing data', async () => {
      const originalVehicle = {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        price: 25000,
        status: 'active'
      };

      const updateData = { price: 26000 };

      const mockUpdatedVehicle = {
        ...originalVehicle,
        ...updateData,
        updatedAt: new Date()
      };

      prisma.vehicles.update.mockResolvedValue(mockUpdatedVehicle);

      const result = await VehicleRepository.updateVehicle('1', updateData);

      expect(result.brand).toBe('Toyota'); // unchanged fields preserved
      expect(result.price).toBe(26000); // updated field changed
    });

    it('should update multiple fields at once', async () => {
      const updateData = {
        price: 30000,
        status: 'sold',
        color: 'red'
      };

      const mockUpdatedVehicle = {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        price: 30000,
        status: 'sold',
        color: 'red',
        updatedAt: new Date()
      };

      prisma.vehicles.update.mockResolvedValue(mockUpdatedVehicle);

      const result = await VehicleRepository.updateVehicle('1', updateData);

      expect(result.price).toBe(30000);
      expect(result.status).toBe('sold');
      expect(result.color).toBe('red');
    });
  });

  describe('softDelete and patchVehicle', () => {
    it('should soft delete a vehicle', async () => {
      const mockDeleted = { id: '1', deletedAt: new Date() };
      prisma.vehicles.update.mockResolvedValue(mockDeleted);

      const result = await VehicleRepository.softDelete('1');

      expect(result).toEqual(mockDeleted);
      expect(prisma.vehicles.update).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
        data: { deletedAt: expect.any(Date) }
      });
    });

    it('should patch vehicle status', async () => {
      const status = { status: 'SOLD' };
      const patched = { id: '1', status: 'SOLD', updatedAt: new Date() };
      prisma.vehicles.update.mockResolvedValue(patched);

      const result = await VehicleRepository.patchVehicle('1', status);

      expect(result).toEqual(patched);
      expect(prisma.vehicles.update).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
        data: {
          ...status,
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('Repository Integration', () => {
    it('should handle complete vehicle lifecycle', async () => {
      // Create
      const createData = {
        brand: 'Tesla',
        model: 'Model 3',
        price: 50000,
        status: 'active'
      };

      const createdVehicle = {
        id: '123',
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prisma.vehicles.create.mockResolvedValue(createdVehicle);

      const result1 = await VehicleRepository.createVehicle(createData);
      expect(result1.id).toBe('123');

      // Get
      prisma.vehicles.findUnique.mockResolvedValue(createdVehicle);
      const result2 = await VehicleRepository.getVehicleById('123');
      expect(result2.id).toBe('123');

      // Update
      const updateData = { price: 52000 };
      const updatedVehicle = {
        ...createdVehicle,
        ...updateData,
        updatedAt: new Date()
      };

      prisma.vehicles.update.mockResolvedValue(updatedVehicle);
      const result3 = await VehicleRepository.updateVehicle('123', updateData);
      expect(result3.price).toBe(52000);

      // List
      prisma.vehicles.findMany.mockResolvedValue([updatedVehicle]);
      const result4 = await VehicleRepository.listVehicles();
      expect(result4).toContainEqual(expect.objectContaining({ id: '123' }));
    });

    it('should handle errors gracefully across operations', async () => {
      const dbError = new Error('Database connection lost');

      prisma.vehicles.create.mockRejectedValue(dbError);
      prisma.vehicles.findUnique.mockRejectedValue(dbError);
      prisma.vehicles.update.mockRejectedValue(dbError);
      prisma.vehicles.findMany.mockRejectedValue(dbError);

      await expect(VehicleRepository.createVehicle({})).rejects.toThrow();
      await expect(VehicleRepository.getVehicleById('1')).rejects.toThrow();
      await expect(VehicleRepository.updateVehicle('1', {})).rejects.toThrow();
      await expect(VehicleRepository.listVehicles()).rejects.toThrow();
    });
  });
});
