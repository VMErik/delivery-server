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


}