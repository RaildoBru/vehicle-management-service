

/**
 * Lista todos os veículos ou filtra por query (ex: ?make=Ford)
 */
/*
async function listVehicles(req, res) {
	try {
		const filters = { ...req.query };
		const vehicles = await Vehicle.find(filters).lean();
		return res.status(200).json({ data: vehicles });
	} catch (err) {
		console.error('Error listing vehicles:', err);
		return res.status(500).json({ error: 'Erro ao listar veículos' });
	}
}

module.exports = {
	listVehicles,
};
*/