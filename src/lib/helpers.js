const bcrypt = require('bcryptjs');
const helpers = {};
// ahora creare un modulo para exportar
// helpers

helpers.encryptPassword = async(password) => { // creamos el bcrypt
    const salt = await bcrypt.genSalt(10); // numero de procesos para hashear
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async(password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log('error: ', e)
    }
};

module.exports = helpers;