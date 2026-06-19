import prisma from "../database/prisma-database.js";

class VehicleRepository {
    async listVehicles(filters = {}) {
        const {
            status,
            sortField = 'price',
            sortOrder = 'asc',
            //brand,
            //model,
            //color,
            //year,
        } = filters;
        
        const where = {};
        
        if (filters.status) {
            where.status = filters.status;
        }
        where.status = filters.status;
        return prisma.vehicles.findMany({
        where: where,
        orderBy: {
                [sortField]: sortOrder,
            },
        });
    }
    async getVehicleById(id) {         
        const result = await prisma.vehicles.findUnique({
            where: { id }
        });
        return await result;
    }
    async createVehicle(data) {
        const createdVehicle = await prisma
            .vehicles
            .create({
                data
            });
        return createdVehicle;
    }
    async updateVehicle(id, data) {
        const updatedVehicle = await prisma.vehicles.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
        return updatedVehicle;
    }
}

export default new VehicleRepository();

