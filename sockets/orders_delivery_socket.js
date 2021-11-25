module.exports = (io) => {
    //CREAMOS UNA RAMA PARA LAS CONEXIONES
    const orderDeliveryNamespace = io.of('/orders/delivery');
    orderDeliveryNamespace.on('connection', function(socket) {
        console.log('USUARIO CONECTADO AL NAMESPACE /orders/delivery');

        socket.on('position', function(data) {
            console.log(`EMITIO ${ JSON.stringify( data)}`);
            // Con este emitimos la data solo a una orden en especifico
            orderDeliveryNamespace.emit(`position/${data.id_order}`, { lat: data.lat, lng: data.lng });
        });

        socket.on('disconnect', function(data) {
            console.log('usuario desconectado');
        });
    });
}