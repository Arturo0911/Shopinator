const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');
const multer = require('multer');
const mysqlStore = require('express-mysql-session');
const errorhandler = require('errorhandler');
const session = require('express-session');
const { database } = require('./credenciales');
const car = require('./controllers/addcar');

require('./lib/passport');
const app = express(); // aqui estoy ejecutando el servidor lo ponemos com objeto


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); // seteamos el archivo de las vistas
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), // de aqui vienen referenciadas del directorio llamado layaouts todas las demas vistas
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs', // la extension de mis archivos handlebars
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


app.use(session({
    secret: 'Developer',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({
    dest: path.join(__dirname, 'public/uploads/temp')
}).single('image')); // redirigiendo el destino de archivos donde se van a guardar las imagenes


// variables globales

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.messagge = req.flash('messagge');
    app.locals.user = req.user;
    /*app.locals.addcar = req.car;
    app.locals.addcar = req.car;
    app.locals.addcar = req.car;*/
    next();
});



// RUTAS
app.use(require('./routes/inicio')); // ruta de inicio será para cear usuarios
app.use(require('./routes/autenticacion'));
app.use('/main', require('./routes/enlaces')); // enrutador principal para las compras


app.use('/public', express.static(path.join(__dirname, 'public')));
app.listen(app.get('port'), () => {
    console.log('El servidor está conectado en el puerto: ', app.get('port'));

});