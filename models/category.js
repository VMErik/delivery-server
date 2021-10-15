const db = require('../config/config');
const Category = {};


Category.getAll = () => {
    const sql = 'select id, name, description from categories order by name';
    // Como no tenemos parametro solo pasamos el sql
    return db.manyOrNone(sql)
}


Category.create = (category) => {
    // Ponemos el returning id, para indicar que retornaremos el id de lo que acabamos de crear
    const sql = `INSERT INTO categories (name, description, created_at, updated_at ) 
                VALUES ($1,$2,$3,$4) RETURNING id`;
    return db.oneOrNone(sql, [
        category.name,
        category.description,
        new Date(),
        new Date()
    ]);
}

// ExportamosCategory para poder utilizar todo 
module.exports = Category;