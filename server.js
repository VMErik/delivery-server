// Indispensable para crear nuestro servidor express
const express = require('express');
// Creamos nuestra app
const app = express();
// Lo ocuparemos para levantar nuestro server
const http = require('http');

// Creamos nuestro server
const server = http.createServer(app);
// Con morgan haremos una depuracion de nuestros errores
const logger = require('morgan');
// Para la comunicacion con el server sin problema
const cors = require('cors');



const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

const passport = require('passport');

// Iniciañozamps nuestro firebase admins
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});


// Aqui instanciamos las rutas 
const users = require('./routes/userRoutes');
const categories = require('./routes/categoriesRoutes');
const address = require('./routes/addressRoutes');
const products = require('./routes/productsRoutes');
const orders = require('./routes/ordersRoutes');


// Especificamos que correra por el puerto 3000, en caso de que no tenga nada el env.PORT
const port = process.env.PORT || 3000;

// Usaremos nuestro loguer de desarrollador
app.use(logger('dev'));
// Nuestra aplicacion se comunicra por json
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
// Usamos CORS dentro de nuestra app
app.use(cors());

// Iniciamlizamos passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');
// Seteamos el puerto a nuestra app
app.set('port', port);

// le pasamos a nuestas rutas de Users, nuestra app
users(app, upload);
// Inicializamos nuestras rutas de categories
categories(app);
address(app);
orders(app);
products(app, upload);
// levantamos nuestro server 
server.listen(3000, '192.168.100.11' || 'localhost', function() {
    // Cuando levantamos el server mandamos este mensaje
    console.log('Aplicacion de NodeJs ' + process.pid + ' iniciada en el puerto ' + port);
});



//ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

//Esto lo hacemos para poder hacer uso de sto fuera de este archivo 
module.exports = {
    app: app,
    server: server
};

// 200 respuesta exitosa
// 404 no se ecuenra la ulr
// 500 error en el servidor