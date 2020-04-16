const buys = {};
let items = [];
let Addcar = [];
const pool = require('../connection');
//const number_shop = 0;


/*buys.BuyItem = async(req, res) => {
    const { serie } = req.params;
    const { id_propietario } = req.params;
    const Resultado_compra = await pool.query('SELECT *FROM Agregar_productos WHERE serie =?', [serie]);
    const resultado_propietario = await pool.query('SELECT *FROM users WHERE cedula =?', [id_propietario]);
    res.render('transactions/buy', { result: Resultado_compra, propietario: resultado_propietario });
}*/

buys.CarShop = async(req, res) => {
    const { id } = req.params;
    const compra = await pool.query('SELECT *FROM Agregar_productos WHERE id=?', [id]);
    items.push(compra[0]);

    /*items = {
        'serie': serie
    };*/
    //return items;
    //number_shop = items.length;
    console.log('objeto compra: ', compra);
    console.log('objeto item: ', items);
    //alert('prueba');
    res.send('Adquiriendo xDD');
    this.AddShop;
};




module.exports = buys;