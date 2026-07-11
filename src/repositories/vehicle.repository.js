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
        // Exclude soft-deleted records
        where.deletedAt = null;
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
            where: { id, deletedAt: null }
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
            where: { id,deletedAt: null },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
        return updatedVehicle;
    }

    async softDelete(id){
        const softDelete = await prisma.vehicles.update({
            where: { id,deletedAt: null },
            data:{
                deletedAt: new Date(),
            }
        });
        return softDelete;
    }
    async patchVehicle(id, status) {
        const patchedVehicle = await prisma.vehicles.update({
            where: { id, deletedAt: null },
            data: {
                ...status,
                updatedAt: new Date(),
            },
        });
        return patchedVehicle;
    }
}

export default new VehicleRepository();

