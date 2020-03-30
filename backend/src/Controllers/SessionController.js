const connection = require('../database/connections');

module.exports = {

    async create(request, response) {
        const { id } = request.body;

        const ong = await connection('ong')
            .where('id', id)
            .select('name')
            .first();

        if (!ong) {
            return response.status(404).json({ 'error': 'No ONG found with this ID: ' + id });
        }

        return response.json(ong);
    },
};