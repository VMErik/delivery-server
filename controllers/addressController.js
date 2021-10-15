const Address = require('../models/address');

module.exports = {
    async create(req, res, next) {
        try {
            const address = req.body;
            const data = await Address.create(address);
            return res.status(201).json({
                success: true,
                message: 'Se almaceno la direccion',
                data: data
            });
        } catch (e) {
            console.log(`Error ${e}`);
            return res.status(501).json({
                success: false,
                message: 'No se pudo crear la direccion',
                error: e
            });
        }
    },


    async findByUser(req, res, next) {
        try {
            console.log('Entramps a las direcciones');
            const id_user = req.params.id_user;
            const data = await Address.findByUser(id_user);
            console.log(`Categorias ${JSON.stringify(data)}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al obtener las direcciones en la base de datos',
                success: false,
                error: error
            });
        }
    },

}