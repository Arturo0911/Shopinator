const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('../lib/helpers');
const pool = require('../connection');
const fs = require('fs-extra');
const path = require('path');
const { randomNumber } = require('../lib/lib');
//const compra = require('../controllers/addcar');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'clave',
    passReqToCallback: true
}, async(req, usuario, clave, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE usuario =?', [usuario]);
    if (rows.length > 0) {
        const user = rows[0];
        const ValidPassword = await helpers.matchPassword(clave, user.clave);
        if (ValidPassword) {
            done(null, user, req.flash('success', 'Bienvenido/a', user.nombres));
        } else {
            done(null, false, req.flash('messagges', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('messagges', 'Usuarios no existen'))
    }
}));


passport.use('local.usersadd', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'clave',
    passReqToCallback: true
}, async(req, usuario, clave, done) => {
    const nombreFoto = randomNumber();
    const PathImg = req.file.path;
    const extension = path.extname(req.file.originalname).toLowerCase();
    const destino = path.resolve(`src/public/uploads/users/${nombreFoto}${extension}`);
    const Nuevo_usuario = {
        cedula: req.body.cedula,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        imagen: nombreFoto + extension,
        telefono: req.body.telefono,
        email: req.body.email,
        usuario: req.body.usuario,
        clave: req.body.clave
    };

    Nuevo_usuario.clave = await helpers.encryptPassword(clave);
    if (extension === '.png' || extension === '.jpg' || extension === '.jpeg' || extension === '.gif') {
        fs.rename(PathImg, destino);
    }
    //console.log(Nuevo_usuario);
    const resultado = await pool.query('INSERT INTO users SET?', [Nuevo_usuario]);
    //console.log(resultado);
    //resultado.insertId = Nuevo_usuario.cedula;
    return done(null, Nuevo_usuario);

}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.cedula);
});

passport.deserializeUser(async(cedula, done) => {
    const rows = await pool.query('SELECT *FROM users where cedula = ?', [cedula]);
    done(null, rows[0]);
});