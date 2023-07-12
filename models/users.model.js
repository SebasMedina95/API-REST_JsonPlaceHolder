//Sacamos del mongoose lo que necesitamos solamente
const { Schema, model } = require('mongoose');

const UserSchema = Schema({

    name: {
        type: String,
        required: [true, 'El name es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },

    avatar: {
        type: String,
        default: "default.png"
    },
    status: {
        type: Boolean,
        default: true
    },
    create_at: {
        type: Date,
        default: Date.now
    },

});

module.exports = model( 'User' , UserSchema, 'users' );