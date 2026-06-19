import vehicleService from '../services/vehicle.service.js';

class VehicleController {
    async listVehicles(req, res) {
        try {
            const filters = req.query; // Supondo que os filtros venham como query parameters
            const vehicles = await vehicleService.listVehicles(filters);
            return res.status(200).json(vehicles);

        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar veículos com filtros", details: error });
        }
    }
    async getVehicleById(req, res) {
        try {
            const { id } = req.params;
            const vehicle = await vehicleService.getVehicleById(id);
            if (!vehicle) {
                return res.status(404).json({ error: "Veículo não encontrado" });
            }
            return res.status(200).json(vehicle);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar veículo por ID", details: error });
        }
    }

    async createVehicle(req, res) {
        
        //Mudar a validação para outro lugar depois, talvez um middleware de validação ou algo do tipo
        if (!req.body) {
            return res.status(400).json({ error: "Dados do veículo são obrigatórios" });
        }
        if (!req.body.model ) {
            return res.status(400).json({ error: "Campo model é obrigatório" });
        }
        if (!req.body.brand) {
            return res.status(400).json({ error: "Campo brand é obrigatório" });
        }
        if (!req.body.year) {
            return res.status(400).json({ error: "Campo year é obrigatório" });
        }
        if (!req.body.price) {
            return res.status(400).json({ error: "Campo price é obrigatório" });
        }
        if (isNaN(req.body.year) || isNaN(req.body.price)) {
            return res.status(400).json({ error: "Ano e preço devem ser números" });
        }

        const data = req.body; // Supondo que os dados do veículo venham no corpo da requisição
        const newVehicle = await vehicleService.createVehicle(data);
            return res.status(201).json(newVehicle);
        try {
            
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar veículo", details: error });
        }   
    }
    async updateVehicle(req, res) {
        const { id } = req.params;
        const data = req.body;
        try {
            const updatedVehicle = await vehicleService.updateVehicle(id, data);
            if (!updatedVehicle) {
                return res.status(404).json({ error: "Veículo não encontrado" });
            }
            return res.status(200).json(updatedVehicle);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar veículo", details: error });
        }
    }

}

export default new VehicleController();
