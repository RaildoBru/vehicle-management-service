import vehicleRepository from '../repositories/vehicle.repository.js';
import { capitalizeFirstLetter } from '../utils/string.util.js';

class VehicleService {
    async listAvailableVehicles() {
        return await vehicleRepository.listAvailableVehicles();
    }
    async listVehicles(filters) {
        
        filters = filters || {};

        const status = (filters.status || 'AVAILABLE').trim().toUpperCase();
        const sortField = filters.sortField || 'price';
        const sortOrder = filters.order === 'desc' ? 'desc' : 'asc';

        const finalFilters = {
            ...filters,
            status,
            sortField,
            sortOrder,
        };
        return await vehicleRepository.listVehicles(finalFilters);
    }

    async getVehicleById(id) {
       return await vehicleRepository.getVehicleById(id);
    }
    async createVehicle(data) {
        //Falta algumas validações e melhorias.
        if (!data.brand || !data.model || !data.year || !data.color || !data.price) {
            throw new Error('Missing required fields: brand, model, year, color, price');
        }

        if (typeof data.year !== 'number' || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
            throw new Error('Invalid year value');
        }

        if (typeof data.price !== 'number' || data.price <= 0) {
            throw new Error('Price must be a positive number');
        }

        const vehicleData = {
            brand: capitalizeFirstLetter(data.brand),
            model: capitalizeFirstLetter(data.model),
            year: data.year,
            color: capitalizeFirstLetter(data.color) || 'Unknown',
            price: data.price,
        };

        // include timestamps before persisting
        const vehicleDataWithTimestamps = {
            ...vehicleData,
            updatedAt: new Date(),
        };

        return await vehicleRepository.createVehicle(vehicleDataWithTimestamps);
    }
    async updateVehicle(id, data) {
        return await vehicleRepository.updateVehicle(id, data);
    }
    async softDelete(id){
        return await vehicleRepository.softDelete(id);
    }
    async patchVehicle(id, status) {
        return await vehicleRepository.patchVehicle(id, status);
    }
}

export default new VehicleService();