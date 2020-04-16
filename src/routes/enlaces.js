const express = require('express');
const router = express.Router(); // aqui enrutaremos las paginas
const pool = require('../connection');
//const fs = require('fs');
const home = require('../controllers/home');
const image = require('../controllers/image');
const path = require('path');
const { randomNumber } = require('../lib/lib');
const buy = require('./buy');
//const { CarShop } = require('./buy');
const fs = require('fs-extra');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers')
const compra = require('../controllers/addcar');




// Editar perfil


// para realizar las ediciones de usuario
router.get('/Editar/:cedula', isLoggedIn, async(req, res) => {
    const { cedula } = req.params;
    const edicion = await pool.query('SELECT *FROM users WHERE cedula =?', [cedula]);
    res.render('links/editar', { edit: edicion[0] });
});



router.post('/Editar/:cedula', isLoggedIn, async(req, res) => {
    const FotoName = randomNumber();
    const PathImg = req.file.path;
    const extensionn = path.extname(req.file.originalname).toLocaleLowerCase();
    const destino = path.resolve(`src/public/uploads/users/${FotoName}${extensionn}`);

    const { cedula } = req.params;
    const EditaUsers = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        imagen: FotoName + extensionn,
        email: req.body.email,
        usuario: req.body.usuario,
        clave: req.body.clave
    };
    EditaUsers.clave = await helpers.encryptPassword(EditaUsers.clave);
    if (extensionn === '.png' || extensionn === '.jpg' || extensionn === '.jpeg' || extensionn === '.gif') {
        fs.rename(PathImg, destino);
    }
    const resultEdit = await pool.query('UPDATE users set ? WHERE cedula=?', [EditaUsers, cedula]);
    res.redirect('/main/vista');
});

// ========================================

// ====================================== las imagenes
router.get('/images', home.index);
router.get('/images/:image_id', image.index);


router.post('/images', image.create);
router.post('/images/:image_id/comment', image.comment);

router.delete('/images/:image_id', image.remove);
/*
router.post('/images/:image_id/like', image.comment);
router.get('/images/:image_id', home.index);
*/


// ========================================

router.get('/vista', isLoggedIn, (req, res) => {
    res.render('profile');
});

/*router.post('/vista', isLoggedIn, async(req, res) => {
    res.redirect('/main/inventario');
});*/

// ========================================


// ======================================== AGREGAR ITEMS AL INVENTARIO DE CADA PERSONA

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async(req, res) => {
    //const inventario = req.body;
    const imgUrl_data = randomNumber();
    const extension = path.extname(req.file.originalname).toLowerCase();
    const imagePath = req.file.path;
    const NewTargetPath = path.resolve(`src/public/uploads/items/${imgUrl_data}${extension}`);
    let img = imgUrl_data + extension;
    const inventario = {
        serie: req.body.serie,
        imagen: img,
        stock: req.body.stock,
        id_propietario: req.user.cedula,
        fullname: req.user.nombres + '' + req.user.apellidos,
        alias: req.body.alias,
        nombre_producto: req.body.nombre_producto,
        caracteristica: req.body.caracteristica
    };
    if (extension === '.png' || extension === '.jpg' || extension === '.jpeg' || extension === '.gif') {
        fs.rename(imagePath, NewTargetPath);
    }
    //console.log('el objeto que se va a enviar a la base de datos: ', inventario);
    await pool.query('INSERT INTO Agregar_productos set ?', [inventario]);
    req.flash('success', 'Se agregó correctamente los valores al inventario. ');
    res.redirect('/main/inventario') //console.log(inventario);
});

// ======================================== 



// ================================================= LA VISTA DEL INVENTARIO DE CADA UNO
router.get('/inventario', isLoggedIn, async(req, res) => {
    const enlaces = await pool.query('SELECT *FROM Agregar_productos WHERE id_propietario= ?', [req.user.cedula]);
    res.render('links/inventario', { enlaces: enlaces });

});


// ======================================== FILTROS DE LOS ITEMS
// YA ESTA ESPECIFICADO EN EL FILTRO QUE SE DEBEN MOSTRAR LOS ITEMS
// QUE NO SEAN DE LA PERSONA QUE ESTÁ LOGUEADO
router.get('/filtro', isLoggedIn, async(req, res) => {
    const Total_elements = await pool.query('SELECT * FROM Agregar_productos WHERE id_propietario != ?', [req.user.cedula]);
    res.render('links/primer_filtro', { elemetos_toales: Total_elements });
});

router.post('/filtro', isLoggedIn, async(req, res) => {
    const filtro = '%' + req.body.filtro + '%';
    try {
        const valores = await pool.query('SELECT *FROM Agregar_productos WHERE nombre_producto LIKE ? AND id_propietario != ?', [filtro, req.user.cedula]);
        res.render('links/filtro', { values: valores });
    } catch (e) {
        console.log('type error: ', e);
    }

});


//========================================================= venta efectuada
// aqui estamos seleccionando de todos los items que se muestran y agregarlos al carrito de  compras
router.get('/PurchaseItem/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const Resultado_compra = await pool.query('SELECT *FROM Agregar_productos WHERE id =?', [id]);
    compra.Crear(Resultado_compra[0]);
    const propietario = Resultado_compra[0].id_propietario
    const resultado_propietario = await pool.query('SELECT *FROM users WHERE cedula =?', [propietario]);
    //res.render('links/buy', { result: Resultado_compra, Vendedor: resultado_propietario });
    req.flash('success', 'item agregado al carrito de compras');
    res.redirect('/main/filtro');
});


// aqui solo estoy verificando la información de cada item, por lo general solo es para la información del propietario
router.get('/info/:id', async(req, res) => {
    const { id } = req.params;
    const Resultado_compra = await pool.query('SELECT *FROM Agregar_productos WHERE id =?', [id]);
    const propietario = Resultado_compra[0].id_propietario
    const resultado_propietario = await pool.query('SELECT *FROM users WHERE cedula =?', [propietario]);
    res.render('links/buy', { result: Resultado_compra, Vendedor: resultado_propietario });
});

/*router.get('/carItems', isLoggedIn, async(req, res) => {
    //console.log('funcion compra lisa:', compra.lista);
    res.render('transactions/total', { items: compra.Delete });

});*/


// aqui renderizo todos los items agregados al carrito para verificar si elimino uno o si quiero eliminar todos xD
router.get('/carItems', isLoggedIn, async(req, res) => {
    compra.Delete_all;
    res.render('transactions/total', { items: compra.lista });
});


// aqui elimino cada item que selecciones, cabe recalcar que todo esto es llamando al archivo llamado Addcarjs
router.get('/carItems/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    compra.Suprimir(id);
    //compra.lista;
    res.redirect('/main/carItems');
});

/*router.post('/process', async(req, res) => {
    res.send('Items comprados...');
});*/

//router.get('/Withoutitems', isLoggedIn, compra.Cancelar);

// para eliminar todo el contenido de mi carrito de compras.
router.get('/Withoutitems', isLoggedIn, async(req, res) => {
    req.flash('success', 'Se eliminó todos los items del carrito...');
    res.render('transactions/total', { items: compra.Delete });
});

/*  */

// esto es una prueba de que se está adquiriendo los items seleccionados, no le paren bola  a esto xD
router.get('/adquirir/:id', isLoggedIn, buy.CarShop);

module.exports = router;