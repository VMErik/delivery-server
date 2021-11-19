const db = require('../config/config');

const crypto = require('crypto');

//Debe de llamars eigual que nuestro modelo
const User = {};
// Definimos un metodo
User.getAll = () => {
    const sql = `SELECT * FROM users`;

    // Utilizamos el metodo para poder hacer la consulta
    return db.manyOrNone(sql);
};

// Creamos otro nuevo metodo
// Recibimos un usuario
User.create = (user) => {

    // Encripatamos el pass
    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;

    // lO CREAMOS Y RETORNAMOS NUEESTRO ID
    const sql = `INSERT INTO users (email,name,lastname,phone,image,password,created_at,updated_at)
                 values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`;
    // POr que retomamos nuestro id o nulo en caso de que no se haga
    return db.oneOrNone(sql, [
        // Mandamos nuestro arreglo de valores, que es user
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        user.password,
        new Date(),
        new Date()
    ]);
};

User.update = (user) => {
    const sql = `UPDATE users SET name  = $2 , lastname = $3 , phone = $4 , image = $5 , updated_at = $6
                 WHERE id = $1 `;
    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ]);

}


User.updateToken = (id, token) => {
    const sql = `UPDATE users SET session_token = $2
                 WHERE id = $1 `;
    return db.none(sql, [
        id,
        token
    ]);

}



User.findById = (id, callback) => {
    const sql = `select id, email, name, lastname, image, phone, password,session_token 
                 from users where id =  $1`;
    return db.oneOrNone(sql, id).then(user => { callback(null, user) });

}

User.findByEmail = (email) => {
    const sql = `select U.id, U.email, U.name, U.lastname, U.image, U.phone, U.password,U.session_token , 
                    json_agg(
                        json_build_object(
                            'id', R.id , 
                            'name'  , R.name , 
                            'image' ,  R.image, 
                            'route' ,  R.route
                        )
                    ) as roles
                    from users  AS U
                    inner join user_has_roles AS UHR on UHR.id_user = U.id
                    inner join roles as R on R.id = UHR.id_rol
                    where U.email =  $1
                    group by U.id`;
    return db.oneOrNone(sql, email);

}



User.findDeliveryMen = () => {
    const sql = `select U.id, U.email, U.name, U.lastname, U.image, U.phone, U.password,U.session_token 
                    from users  AS U
                    inner join user_has_roles AS UHR on UHR.id_user = U.id
                    inner join roles as R on R.id = UHR.id_rol
                    where R.id = 3;`;
    return db.manyOrNone(sql);
}


User.findByUserId = (id) => {
    const sql = `select U.id, U.email, U.name, U.lastname, U.image, U.phone, U.password,U.session_token , 
                    json_agg(
                        json_build_object(
                            'id', R.id , 
                            'name'  , R.name , 
                            'image' ,  R.image, 
                            'route' ,  R.route
                        )
                    ) as roles
                    from users  AS U
                    inner join user_has_roles AS UHR on UHR.id_user = U.id
                    inner join roles as R on R.id = UHR.id_rol
                    where U.id =  $1
                    group by U.id`;
    return db.oneOrNone(sql, id);
}



User.isPasswordMatch = (userPassword, hash) => {
    const myPasswordGashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if (myPasswordGashed === hash) {
        return true;
    }
    return false;
}

module.exports = User;