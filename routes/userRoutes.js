// Aqui definiremos las rutas para ejecutar nuestros metodos 
const UserController = require('../controllers/usersController');

const passport = require('passport');

// Expostarmos todo el modulo
module.exports = (app, upload) => {
    // Definimos la ruta, normalmente api, modelo y la accion
    // Cuandoo se solicite esa ruta, ejecutamos el UserController.getasall
    app.get('/api/users/getAll', UserController.getAll);
    // Traemos por id, el passport es para uatenticas
    app.get('/api/users/findById/:id', passport.authenticate('jwt', { session: false }), UserController.findById);
    // Deinfimos nuesstro post 
    // Inidcamos que subiremos una imagen con el upload.array
    app.post('/api/users/create', upload.array('image', 1), UserController.createWithImage);
    //
    app.post('/api/users/login', UserController.login);
    // Para cerrar la session
    app.post('/api/users/logout', UserController.logout);

    // Esta ruta es para actualizar, el passpport es para autenticar
    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), UserController.update);



};