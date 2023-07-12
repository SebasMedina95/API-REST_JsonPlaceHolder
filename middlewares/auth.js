const { response, request } = require('express'); 
const path = require('path'); 
const jwt = require('jwt-simple'); 
const secret = process.env.SECRET_KEY_JWT;
const moment = require('moment');

const auth = async(req = request, res = response, next) => {

    const tokenHeader = req.header('myTokenAuth'); //VENDRA EN LOS HEADERS!!!!

    if(!tokenHeader){

        return res.status(403).json({
            status: "ERROR",
            message: "La petición no tiene la cabecera de autenticación",
            infoAdd: "Error con el TOKEN",
        });

    }

    //Limpieza de token.
    //Quitamos las posibles comillas que se pueden traer para que nos quede pulpo
    const token = tokenHeader.replace(/['"]+/g, '');

    try {

        const payload = jwt.decode( token , secret );

        if(payload.exp <= moment.unix()){
            return res.status(404).json({
                status: "ERROR",
                message: "El Token expiró, debe solicitar uno nuevo",
                infoAdd: "Error con el TOKEN"
            });
        }


        req.authenticatedUser = payload;
        
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            status: "ERROR",
            message: "Token invalido",
            infoAdd: "Error con el TOKEN",
            error
        });
    }

    next();

}

module.exports = {
    auth
}