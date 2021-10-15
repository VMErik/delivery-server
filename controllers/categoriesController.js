const { response } = require('express');
const Category = require('../models/category');

module.exports = {


    async getAll(req, res, next) {
        try {
            const data = await Category.getAll();
            console.log(`Categorias ${JSON.stringify(data)}`);
            return res.status(201).json(data);

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al obtener las categorias',
                success: false,
                error: error
            });
        }
    },


    async create(req, res, next) {

        try {

            //Capturamos todos los  datos
            const category = req.body;
            console.log(category);

            const data = await Category.create(category);
            // Retornamosun estatus, y retornamos el id solamente que obtenemos del modelo
            return res.status(201).json({
                message: 'La categoria se ha almacenado correctamente',
                success: true,
                data: data.id
            });

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al crear la categoria',
                success: false,
                error: error
            });
        }

    }
}