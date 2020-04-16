const carrito = [];
const compra = {};

compra.Crear = (req) => {
    carrito.push(req);
    return carrito;
}

compra.Eliminar_item = (req) => {
    let lugar = carrito.indexOf(req);
    carrito.splice(lugar, 1);
    return carrito;
}

compra.Suprimir = (req) => {
    carrito.forEach(elemento => {
        if (parseInt(req) === elemento.id) {
            const dato = elemento;
            compra.Eliminar_item(dato);
        }
    });
    return carrito;
}

compra.lista = () => {
    return carrito;
}

compra.Delete = () => {
    if (carrito.length > 0) {
        while (carrito.length > 0) {
            carrito.pop();
        }
    }
    return carrito;
}

module.exports = compra;