const express = require('express');

const compra = require('../controllers/addcar');
const router = express.Router();

router.get('/', (req, res) => {
    compra.Delete_all;
    res.render('index');
});

module.exports = router;