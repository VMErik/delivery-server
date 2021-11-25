const db = require('../config/config');

const Order = {};

Order.findByStatus = (status) => {

    const sql = `SELECT  O.id , O.id_client , O.id_delivery , O.id_address , O.status , O.timestamp , 
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', P.id,
                            'name', P.name,
                            'description', P.description,
                            'price', P.price,
                            'image1', P.image1,
                            'image2', P.image2,
                            'image3', P.image3,
                            'quantity' , OHP.quantity
                        )
                    ) AS Products,
                    JSON_BUILD_OBJECT(
                        'id' ,  U.id, 
                        'name' , U.name,
                        'lastname' , U.lastname , 
                        'image' , U.image
                    ) AS Client ,
                    JSON_BUILD_OBJECT(
                        'id' ,  U2.id, 
                        'name' , U2.name,
                        'lastname' , U2.lastname , 
                        'image' , U2.image
                    ) AS Delivery ,
                    JSON_BUILD_OBJECT(
                        'id' ,  A.id, 
                        'address' , A.address,
                        'neighborhood' , A.neighborhood , 
                        'lat' , A.lat , 
                        'lng' , A.lng 
                    ) AS Address 
                    FROM ORDERS AS O
                    INNER JOIN USERS AS U ON O.id_client = U.id
                    LEFT JOIN USERS AS U2 ON O.id_delivery = U2.id
                    INNER JOIN ADDRESS AS A ON A.id = O.id_address
                    INNER JOIN ORDER_HAS_PRODUCTS AS OHP ON OHP.id_order =  O.id
                    INNER JOIN PRODUCTS AS P ON P.id = OHP.id_product
                    WHERE O.status = $1
                    GROUP BY O.id, U.id, A.id , U2.id`;

    return db.manyOrNone(sql, status);
}


Order.findByClientAndStatus = (idClient, status) => {

    const sql = `SELECT  O.id , O.id_client , O.id_delivery , O.id_address , O.status , O.timestamp , O.lat, O.lng , 
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', P.id,
                            'name', P.name,
                            'description', P.description,
                            'price', P.price,
                            'image1', P.image1,
                            'image2', P.image2,
                            'image3', P.image3,
                            'quantity' , OHP.quantity
                        )
                    ) AS Products,
                    JSON_BUILD_OBJECT(
                        'id' ,  U.id, 
                        'name' , U.name,
                        'lastname' , U.lastname , 
                        'image' , U.image
                    ) AS Client ,
                    JSON_BUILD_OBJECT(
                        'id' ,  U2.id, 
                        'name' , U2.name,
                        'lastname' , U2.lastname , 
                        'image' , U2.image
                    ) AS Delivery ,
                    JSON_BUILD_OBJECT(
                        'id' ,  A.id, 
                        'address' , A.address,
                        'neighborhood' , A.neighborhood , 
                        'lat' , A.lat , 
                        'lng' , A.lng 
                    ) AS Address 
                    FROM ORDERS AS O
                    INNER JOIN USERS AS U ON O.id_client = U.id
                    LEFT JOIN USERS AS U2 ON O.id_delivery = U2.id
                    INNER JOIN ADDRESS AS A ON A.id = O.id_address
                    INNER JOIN ORDER_HAS_PRODUCTS AS OHP ON OHP.id_order =  O.id
                    INNER JOIN PRODUCTS AS P ON P.id = OHP.id_product
                    WHERE O.status = $2 and O.id_client = $1
                    GROUP BY O.id, U.id, A.id , U2.id`;

    return db.manyOrNone(sql, [idClient, status]);
}


Order.findByDeliveryAndStatus = (idDelivery, status) => {

    const sql = `SELECT  O.id , O.id_client , O.id_delivery , O.id_address , O.status , O.timestamp , 
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', P.id,
                            'name', P.name,
                            'description', P.description,
                            'price', P.price,
                            'image1', P.image1,
                            'image2', P.image2,
                            'image3', P.image3,
                            'quantity' , OHP.quantity
                        )
                    ) AS Products,
                    JSON_BUILD_OBJECT(
                        'id' ,  U.id, 
                        'name' , U.name,
                        'lastname' , U.lastname , 
                        'image' , U.image
                    ) AS Client ,
                    JSON_BUILD_OBJECT(
                        'id' ,  U2.id, 
                        'name' , U2.name,
                        'lastname' , U2.lastname , 
                        'image' , U2.image
                    ) AS Delivery ,
                    JSON_BUILD_OBJECT(
                        'id' ,  A.id, 
                        'address' , A.address,
                        'neighborhood' , A.neighborhood , 
                        'lat' , A.lat , 
                        'lng' , A.lng 
                    ) AS Address 
                    FROM ORDERS AS O
                    INNER JOIN USERS AS U ON O.id_client = U.id
                    LEFT JOIN USERS AS U2 ON O.id_delivery = U2.id
                    INNER JOIN ADDRESS AS A ON A.id = O.id_address
                    INNER JOIN ORDER_HAS_PRODUCTS AS OHP ON OHP.id_order =  O.id
                    INNER JOIN PRODUCTS AS P ON P.id = OHP.id_product
                    WHERE O.status = $2 and O.id_delivery = $1
                    GROUP BY O.id, U.id, A.id , U2.id`;

    return db.manyOrNone(sql, [idDelivery, status]);
}

Order.create = (order) => {
    const sql = `INSERT INTO orders (id_client, id_address,status,timestamp,created_at,updated_at) 
                VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`;
    return db.oneOrNone(sql, [
        order.id_client,
        order.id_address,
        order.status,
        Date.now,
        new Date(),
        new Date()
    ]);
}


Order.udpate = (order) => {
    const sql = `UPDATE orders set id_client = $2, id_address = $3, id_delivery = $4 , status = $5, updated_at =  $6 
                where id = $1`;
    return db.none(sql, [
        order.id,
        order.id_client,
        order.id_address,
        order.id_delivery,
        order.status,
        new Date()
    ]);
}



Order.udpateLatLng = (order) => {
    const sql = `UPDATE orders set lat = $2, lng = $3 
                where id = $1`;
    return db.none(sql, [
        order.id,
        order.lat,
        order.lng
    ]);
}



module.exports = Order;