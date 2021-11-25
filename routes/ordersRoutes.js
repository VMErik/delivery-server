const OrderController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {
    // Creamos nuestras rutas 
    app.post('/api/orders/create', passport.authenticate('jwt', { session: false }), OrderController.create);

    app.get('/api/orders/findByStatus/:status', passport.authenticate('jwt', { session: false }), OrderController.findByStatus);

    app.get('/api/orders/findByDeliveryAndStatus/:idDelivery/:status', passport.authenticate('jwt', { session: false }), OrderController.findByDeliveryAndStatus);

    app.get('/api/orders/findByClientAndStatus/:idClient/:status', passport.authenticate('jwt', { session: false }), OrderController.findByClientAndStatus);


    // Creamos nuestras rutas  de pput
    app.put('/api/orders/updateToDispatched', passport.authenticate('jwt', { session: false }), OrderController.updateToDispatched);

    app.put('/api/orders/updateLatLng', passport.authenticate('jwt', { session: false }), OrderController.updateLatLng);

    app.put('/api/orders/updateToOnTheWay', passport.authenticate('jwt', { session: false }), OrderController.updateToOnTheWay);

    app.put('/api/orders/updateToDelivered', passport.authenticate('jwt', { session: false }), OrderController.updateToDelivered);


}