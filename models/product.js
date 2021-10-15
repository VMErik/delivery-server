const db = require('../config/config');
const Product = {};

Product.create = (product) => {
    // iNSERTAMOS Y RETORNAMOS ELID
    const sql = `INSERT INTO  products (
        name, description, price, image1, image2,image3,
        id_category, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`;

    return db.oneOrNone(sql, [
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date(),
        new Date()
    ]);
}

Product.udpate = (product) => {
    const sql = `UPDATE products set 
                name = $2 , 
                description = $3 , 
                price = $4 , 
                image1 = $5 , 
                image2 = $6 , 
                image3 = $7 , 
                id_category = $8 , 
                updated_at = $9
                where id = $1 
                `;
    return db.none(sql, [
        product.id,
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date(),
    ]);
}

Product.findByCategory = (id_category) => {
    sql = `SELECT P.id, P.name, P.description, P.price, P.image1, P.image2, P.image3, P.id_category
            from products as P 
            inner join categories as C on P.id_category = C.id
            where c.id = $1`;
    return db.manyOrNone(sql, id_category);
}


module.exports = Product;