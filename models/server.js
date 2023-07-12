const express = require('express');
const path = require("path"); 
const cors = require('cors'); 
const fileUpload = require('express-fileupload') 

const { dbConnection } = require('../database/config.db');


class Server {

    constructor(){

        this.app = express();
        this.myPort = process.env.PORT;

        this.paths = {
            //"Para local"
            auth  : '/api/auth',
            users : '/api/users',
            //"Para Api JsonPlaceHolder"
            logs  : '/api/jsonplaceholder/logs',
        }

        //Conectarnos a la base de datos Mongo
        this.conectarDB();

        //Middlewares (Funciones que añaden mas funcionalidades)
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();

    }

    async conectarDB(){
        await dbConnection();
    }

    //Definición de rutas de trabajo
    routes(){
        
        this.app.use(this.paths.auth, require('../routes/auth.route'));
        this.app.use(this.paths.logs, require('../routes/logs.route'));
        this.app.use(this.paths.users, require('../routes/users.route'));

    }

    //Puerto de escucha para la aplicación
    listen(){
        this.app.listen(this.myPort, () => {
            console.log('.......................................................');
            console.log(`La aplicación ejemplo está corriendo por el puerto ${this.myPort}`)
        });
    }

    //Función que se ejecuta antes de llamar al controlador en teoría o de continuar con la lógica
    middlewares(){

        this.app.use( cors() );

        this.app.use( express.json() );
        this.app.use( express.urlencoded({extended : true}) );

        this.app.use( express.static('public') );

        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

}

module.exports = Server;