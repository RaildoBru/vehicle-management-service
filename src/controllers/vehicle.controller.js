import vehicleService from '../services/vehicle.service.js';

class VehicleController {
    async listVehicles(req, res) {
        try {
            const filters = req.query;
            const vehicles = await vehicleService.listVehicles(filters);
            return res.status(200).json(vehicles);

        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar veículos com filtros"});
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
            res.status(500).json({ error: "Erro ao buscar veículo por ID"});
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

        try {
            const data = req.body;
            const newVehicle = await vehicleService.createVehicle(data);
            return res.status(201).json(newVehicle);
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar veículo"});
        }
    }
    async updateVehicle(req, res) {
        const { id } = req.params;
        const { status, ...data } = req.body;

        if (status) {
            return res.status(422).json({
                message: 'O campo status deve ser atualizado através de uma operação específica.'
            });
        }

        try {
            const updatedVehicle = await vehicleService.updateVehicle(id, data);
            if (!updatedVehicle) {
                return res.status(404).json({ error: "Veículo não encontrado" });
            }
            return res.status(200).json(updatedVehicle);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o veículo"});
        }
    }
    async softDelete(req, res){
        const { id } = req.params;
        try {
            const deletedVehicle = await vehicleService.softDelete(id);
            if(!deletedVehicle){
                return res.status(404).json({ error: "Veículo não encontrado" });
            }
            return res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar o veículo"});
        }
    }
    async patchVehicle(req, res) {
        const { id } = req.params;
        const data = req.body;
        try {
            const patchedVehicle = await vehicleService.patchVehicle(id, data);
            if (!patchedVehicle) {
                return res.status(404).json({ error: "Veículo não encontrado" });
            }
            return res.status(200).json(patchedVehicle);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar parcialmente o veículo"});
        }
    }

}

export default new VehicleController();
