const connection = require('../database/connections');

module.exports = {

    async index(request, response) {
        const numIncidents = 5;
        const { page = 1 } = request.query;

        const [count] = await connection('incident').count();

        const incidents = await connection('incident')
            .select([
                'incident.*',
                'ong.name',
                'ong.email',
                'ong.whatsapp',
                'ong.city',
                'ong.uf'])
            .join('ong', 'ong.id', '=', 'incident.ong_id')
            .limit(numIncidents)
            .offset((page - 1) * numIncidents);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async indexOng(request, response) {
        const ong_id = request.headers.authorization;
        const incidents = await connection('incident')
            .where('ong_id', ong_id)
            .select('*');
        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;


        const [id] = await connection('incident').insert({
            title,
            description,
            value,
            ong_id
        });


        return response.json({ id });

    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incident')
            .where('id', id)
            .select('ong_id')
            .first();

        if (ong_id != incident.ong_id) {
            return response.status(404).json({ 'error': 'Operation not permitted!' });
        }

        await connection('incident')
            .where('id', id)
            .delete();

        return response.status(204).send();

    },

}