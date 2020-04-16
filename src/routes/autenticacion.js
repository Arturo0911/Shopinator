const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const pool = require('../connection');




router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});
router.post('/signin', isNotLoggedIn, async(req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});



router.get('/usersadd', isNotLoggedIn, (req, res) => {
    res.render('auth/usersadd');
});
router.post('/usersadd', isNotLoggedIn, passport.authenticate('local.usersadd', {
    successRedirect: '/signin',
    failureRedirect: '/usersadd',
    failuerFlash: true
}));




// Perfil
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');

    //compra_.Cancelar;
});

/*function Limpiar() {
    return compra_.Cancelar;
}*/

router.get('/logout', isLoggedIn, async(req, res) => {
    req.logOut();
    res.redirect('/signin');

});
module.exports = router;