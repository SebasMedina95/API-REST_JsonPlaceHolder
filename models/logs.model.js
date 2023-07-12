//Sacamos del mongoose lo que necesitamos solamente
const { Schema, model } = require('mongoose');

const LogSchema = Schema({

    user: {
        type: Schema.Types.ObjectId, //Tiene que ser otro objeto de mongo
        ref: 'User' //Esquema al que nos referiremos
    },
    method: {
        type: String,
        required: [true, 'El method es obligatorio']
    },
    data: {
        type: String,
        required: [true, 'El data es obligatorio'],
    },
    create_at: {
        type: Date,
        default: Date.now
    },

});

module.exports = model( 'Log' , LogSchema, 'logs' );