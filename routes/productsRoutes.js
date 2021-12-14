const ProductsController = require('../controllers/productsController');
const passport = require('passport');


module.exports = (app, upload) => {

    // Le indicamos que esperamos tres imagenes, y que esta protegido
    app.post('/api/products/create', passport.authenticate('jwt', { session: false }), upload.array('image', 3), ProductsController.create);


    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', { session: false }), ProductsController.findByCategory);

    app.get('/api/products/findByCategoryAndProductName/:id_category/:product_name', passport.authenticate('jwt', { session: false }), ProductsController.findByCategoryAndProductName);


}