const OrderController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {
    // Creamos nuestras rutas 
    app.post('/api/orders/create', passport.authenticate('jwt', { session: false }), OrderController.create);
}