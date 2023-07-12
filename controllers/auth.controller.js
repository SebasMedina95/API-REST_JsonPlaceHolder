const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/users.model');
const { crearToken } = require('../helpers/generar-jwt-simple');


const login = async(req = request, res = response) => {

    const { email , password } = req.body;

    try {

        //Verificar si el email existe
        const userSearch = await User.findOne({ email })
        if(!userSearch){
            return res.status(400).json({
                status : "ERROR",
                method : "Login del sistema desde el controlador",
                message : "Existe un problema con las credenciales, por favor verifique.",
                result_desc : "Error Email",
            })
        }

        //Verificar si el usuario esta activo
        if(!userSearch.status){
            return res.status(400).json({
                status : "ERROR",
                method : "Login del sistema desde el controlador",
                message : "Existe un problema con las credenciales, por favor verifique.",
                result_desc : "Error Status - Inactivo",
            })
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync( password , userSearch.password );
        if(!validPassword){
            return res.status(400).json({
                status : "ERROR",
                method : "Login del sistema desde el controlador",
                message : "Existe un problema con las credenciales, por favor verifique.",
                result_desc : "Error Password",
            })
        }

        //Generamos el token con jwt-simple
        const token = crearToken(userSearch);

        return res.status(201).json({
            status : "OK",
            method : "Login del sistema desde el controlador",
            message : "Se estableció la comunicación POST para logearse al sistema",
            result_desc : "Usuario logeado correctamente",
            result : {
                user: {
                    "Nombre"   :userSearch.name,
                    "Email" : userSearch.email,
                    "avatar" : userSearch.avatar,
                },
            token
            }
        });
        
    } catch (error) {
        
        console.log(error);
        return res.status(400).json({
            status : "ERROR",
            method : "Login del sistema desde el controlador",
            message : "No fue posible establecer la comunicación POST para logearse al sistema",
            result_desc : "Error al logearse o al generar JWT respectivo",
            comments : [
                { "c1": "Pendiente el JWT" },
                { "c2": "Pendiente Accesos" }
            ],
            result : {
                email,
                password,
                error
            }
        });

    }

}

module.exports = {
    login
}