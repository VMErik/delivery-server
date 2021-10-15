const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const rol = require('../models/rol');
const storage = require('../utils/cloud_storage');
const { findById } = require('../models/user');

module.exports = {
    // Agregammos para poder obtener todos nuestros usuarios
    async getAll(req, res, next) {

        try {
            const data = await User.getAll();
            console.log(`Usuarios : ${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`ERROR :${error}`);
            return res.status(501).json({

                // Retornamos un mapa con la info del errir 
                success: false,
                message: `Error al obtener los usuarios`,
                error: error.message
            });
        }
    },
    // Para buscar por id 
    async findById(req, res, next) {

        try {
            const id = req.params.id;
            const data = await User.findByUserId(id);
            console.log(`Usuarios : ${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`ERROR :${error}`);
            return res.status(501).json({

                // Retornamos un mapa con la info del errir 
                success: false,
                message: `Error al obtener el usuario por id`,
                error: error.message
            });
        }
    },

    // Agregamos para poder  registrar un usuario
    async create(req, res, next) {

        try {

            // Obteneomos los parametros a partir del Body
            const user = req.body;
            const data = await User.create(user);
            console.log(`Usuario creado : ${data}`);

            // Le generamos el rol 
            await rol.create(data.id, 1);

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora inicie sesión',
                data: data.id
            });
        } catch (error) {
            console.log(`ERROR :${error}`);
            return res.status(501).json({
                // Retornamos un mapa con la info del errir 
                success: false,
                message: `Error al registrar el usuario`,
                error: error.message
            });
        }
    },

    //Registrar con una imagen 
    async createWithImage(req, res, next) {

        try {
            // Obteneomos los parametros a partir del Body
            const user = JSON.parse(req.body.user);

            console.log(`Datos enviados del usuario :${user}`);
            // Esto es lo que se encarga del agregar la imagen
            const files = req.files;
            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // Creamos el nombre del archivo
                const url = await storage(files[0], pathImage); // Enviamos el nombre del archivo

                if (url != undefined && url != null) {
                    // La imagen se almacen correctamente
                    user.image = url;
                }

            }
            const data = await User.create(user);
            console.log(`Usuario creado : ${data}`);

            // Le generamos el rol 
            await rol.create(data.id, 1);

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora inicie sesión',
                data: data.id
            });
        } catch (error) {
            console.log(`ERROR :${error}`);
            return res.status(501).json({
                // Retornamos un mapa con la info del errir 
                success: false,
                message: `Error al registrar el usuario`,
                error: error.message
            });
        }
    },


    async update(req, res, next) {

        try {
            // Obteneomos los parametros a partir del Body
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario :${ JSON.stringify( user ) }`);
            // Esto es lo que se encarga del agregar la imagen
            const files = req.files;
            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // Creamos el nombre del archivo
                const url = await storage(files[0], pathImage); // Enviamos el nombre del archivo

                if (url != undefined && url != null) {
                    // La imagen se almacen correctamente
                    user.image = url;
                }
            }
            await User.update(user);
            return res.status(201).json({
                success: true,
                message: 'El registro se actualizo correctamente',
            });
        } catch (error) {
            console.log(`ERROR :${error}`);
            return res.status(501).json({
                // Retornamos un mapa con la info del errir 
                success: false,
                message: `Error al actualizar el usuario`,
                error: error.message
            });
        }
    },

    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const myUser = await User.findByEmail(email);
            if (!myUser) {
                return myUser.status(401).json({
                    success: false,
                    message: 'El correo no fue encontrado'
                });
            }
            if (User.isPasswordMatch(password, myUser.password)) {
                // Creamos el token 
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {
                    expiresIn: (60 * 60 * 24) // 1 hora
                });
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                };

                await User.updateToken(myUser.id, `JWT ${token}`);

                console.log(`USUARIO ENVIADO ${data}`);

                return res.status(201).json({
                    success: true,
                    data: data,
                    message: 'El usuario ha sido autenticado'
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                });
            }
        } catch (e) {
            console.log(`Error ${e}`);
            return res.status(501).json({
                success: false,
                message: 'Eror al momento de hacer login',
                error: e
            });
        }
    },

    async logout(req, res, next) {
        try {
            const id = req.body.id;
            await User.updateToken(id, null);

            return res.status(201).json({
                success: true,
                data: null,
                message: 'La sesion del usuario se ha cerrado correctamente'
            });

        } catch (e) {
            console.log(`Error ${e}`);
            return res.status(501).json({
                success: false,
                message: 'Eror al momento de cerrar sesion',
                error: e
            })
        }

    }
};