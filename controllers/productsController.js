const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');

module.exports = {

    async findByCategory(req, res, next) {
        try {
            const id_category = req.params.id_category;

            const data = await Product.findByCategory(id_category);

            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener las categorias',
                error: error
            });
        }
    },

    async create(req, res, next) {
        let product = JSON.parse(req.body.product);
        console.log(`Producto ${JSON.stringify(product)}`);
        // Obteemos los archivos
        const files = req.files;

        let inserts = 0;
        if (files.length === 0) {
            return res.status(501).json({
                message: 'Error al registrar el producto no tiene imagen',
                success: false
            })
        } else {
            try {
                // Se almacena la informacion del producto
                const data = await Product.create(product);
                product.id = data.id;

                const start = async() => {
                    await asyncForEach(files, async(file) => {
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(file, pathImage);

                        if (url !== undefined && url !== null) {
                            if (inserts == 0) { // Guardo la imagen 1
                                product.image1 = url;
                            } else if (inserts == 1) {
                                product.image2 = url;
                            } else if (inserts == 2) {
                                product.image3 = url;
                            }
                        }
                        await Product.udpate(product);
                        inserts = inserts + 1;
                        if (inserts == files.length) {
                            // Validamos si ya se insertaron las imagenes que se enviaron
                            return res.status(201).json({
                                success: true,
                                message: 'El producto se ha registrado correctamente'
                            });
                        }
                    });
                }

                // Inicializamos el registro de todas las imagenes
                start();

            } catch (error) {
                console.log(`Error ${error}`);
                return res.status(501).json({
                    success: false,
                    message: 'Error al registrar el producto',
                    error: error
                });
            }
        }

    }

}