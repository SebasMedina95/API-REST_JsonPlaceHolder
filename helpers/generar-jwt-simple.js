const path = require('path');
const jwt = require('jwt-simple');
const secret = process.env.SECRET_KEY_JWT;
const moment = require('moment');

const crearToken = (user) => {

    const payload = { 
    
        id       : user._id,
        name     : user.first_name,
        lastname : user.last_name,
        nick     : user.nick,
        email    : user.email,
        role     : user.role,
        avatar   : user.avatar,
        iat      : moment().unix(), //Fecha creación ilegible
        exp      : moment().add(1, 'days').unix()

    }; //Cuerpo del JWT

    //Se codifica el token
    return jwt.encode(payload, secret);

}

module.exports = {
    crearToken
}