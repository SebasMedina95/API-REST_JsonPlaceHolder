const mongoose = require('mongoose');

const User = require('../models/users.model');

const emailValido = async( email = '' ) => {

    email = email.toLowerCase();
    const existeEmail = await User.findOne({ email });
    if( existeEmail ){
        throw new Error(`El email << ${email} >> ya está registrado en la BD Mongo`); 
    }
}

const emailValido_edit = async( email = '' , id = '' ) => {

    email = email.toLowerCase();
    const existeEmail = await User.findOne({ email });
    
    if( existeEmail && existeEmail._id != id ){
        throw new Error(`El email << ${email} >> ya está registrado en la BD Mongo`); 
    }
}

const existeUserPorId = async( id ) => {

    if (mongoose.Types.ObjectId.isValid(id)) {

        const existId = await User.findById(id);
     if (!existId) {
        throw new Error(`El Usuario con ID ${id} no existe en la BD Mongo`);
        }
    }else{
        throw new Error(`El Usuario con ID ${id} no es válido, no tiene la forma ID Mongo`);
    }

}



module.exports = {
    emailValido,
    emailValido_edit,
    existeUserPorId
}