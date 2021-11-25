const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');


module.exports = {
    async create(req, res, next) {
        try {
            // La declaramos como let, por que es una variable, no es una constante
            let order = req.body;
            order.status = 'PAGADO';
            const data = await Order.create(order);

            // Suponemos que ya se creo la orden 
            // Empezamos a recorrer todos los productos agregados en la orden 
            for (const product of order.products) {
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se creo correctamente',
                data: data
            });
        } catch (e) {
            console.log(`Error ${e}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al crear la orden',
                error: e
            });
        }
    },

    async updateToDispatched(req, res, next) {
        try {
            // La declaramos como let, por que es una variable, no es una constante
            let order = req.body;
            order.status = 'DESPACHADO';
            await Order.udpate(order);
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            });
        } catch (e) {
            console.log(`Error ${e}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar la orden',
                error: e
            });
        }
    },

    async updateToOnTheWay(req, res, next) {
        try {
            // La declaramos como let, por que es una variable, no es una constante
            let order = req.body;
            order.status = 'EN CAMINO';
            await Order.udpate(order);
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            });
        } catch (e) {
            console.log(`Error ${e}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar la orden',
                error: e
            });
        }
    },


    async updateToDelivered(req, res, next) {
        try {
            // La declaramos como let, por que es una variable, no es una constante
            let order = req.body;
            order.status = 'ENTREGADO';
            await Order.udpate(order);
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            });
        } catch (e) {
            console.log(`Error ${e}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar la orden',
                error: e
            });
        }
    },

    async updateLatLng(req, res, next) {
        try {
            // La declaramos como let, por que es una variable, no es una constante
            let order = req.body;
            await Order.udpateLatLng(order);
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente - lat, lng',
            });
        } catch (e) {
            console.log(`Error ${e}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar la orden',
                error: e
            });
        }
    },

    async findByStatus(req, res, next) {
        try {
            const status = req.params.status;
            const data = await Order.findByStatus(status);
            console.log(`Orders ${JSON.stringify(data)}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al obtener las ordenes por estatus',
                success: false,
                error: error
            });
        }
    },


    async findByDeliveryAndStatus(req, res, next) {
        try {
            const idDelivery = req.params.idDelivery;
            const status = req.params.status;

            const data = await Order.findByDeliveryAndStatus(idDelivery, status);
            console.log(`Orders delivery${JSON.stringify(data)}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al obtener las ordenes por estatus',
                success: false,
                error: error
            });
        }
    },

    async findByClientAndStatus(req, res, next) {
        try {
            const idClient = req.params.idClient;
            const status = req.params.status;

            const data = await Order.findByClientAndStatus(idClient, status);
            console.log(`Orders client ${JSON.stringify(data)}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al obtener las ordenes por estatus',
                success: false,
                error: error
            });
        }
    },


}