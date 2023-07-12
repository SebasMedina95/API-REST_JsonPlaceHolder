const { response, request } = require('express'); 
const bcryptjs = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const User = require('../models/users.model');

const { subirArchivoUsuario } = require('../helpers/subir-archivo');


const prueba_comunicacion = async(req = request, res = response) => {

    return res.status(200).json({
        estado  : "Conectado",
        mensaje : 'Controlador conectado con la ruta USERS LOCAL',
    });

}

const agregarUsuario = async(req = request, res = response) => {

    const body = req.body;

    const { password , avatar, ...restoBody } = body;

    const userInstance = new User(body)

    //Encripto la contraseña
    const salt = bcryptjs.genSaltSync();
    userInstance.password = bcryptjs.hashSync( password , salt );

    if(req.files && Object.keys(req.files).length !== 0 && req.files.avatar){
        const myUploadFile = await subirArchivoUsuario(req.files , ['jpg' , 'png'], 'users');
        userInstance.avatar = myUploadFile;
    }else{
        userInstance.avatar = "default.png";
    }

    //Convertiremos en minúsculas el nick y el email por seguridad
    userInstance.email = userInstance.email.toLowerCase();

    await userInstance.save();

    return res.status(201).json({
        status : "OK",
        method : "Agregar usuario desde el controlador",
        message : "Se estableció la comunicación POST para agregar usuarios",
        result_desc : "Usuario agregado correctamente",
        result : userInstance,
        userAuth : req.authenticatedUser
    });

}

const obtenerUsuario = async(req = request, res = response) => {

    const { id } = req.params;
    const userAuth = req.authenticatedUser;

    const getUser = await User.findById( id ).select( {password:0 , status:0, __v:0} ).where({ status : true });

    return res.status(201).json({
        status : "OK",
        method : "Obteniendo un usuario desde el controlador",
        message : "Se estableció la comunicación GET para obtener un usuario por su ID",
        result_desc : "Usuario obtenido",
        result : getUser,
        userAuth,
    });

}

const actualizarUsuario = async(req = request, res = response) => {

    const { id } = req.params;
    const userAuth = req.authenticatedUser;
    
    const { _id, password, avatar, ...restoBody } = req.body;
    const userUpdate = await User.findById(id);

    //Quiere actualizar la contraseña
    if(password){
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        restoBody.password = bcryptjs.hashSync( password , salt );
    }

    if(req.files && Object.keys(req.files).length !== 0 && req.files.avatar){

        const avatarName = req.files.avatar;
        const cutName = req.files.avatar.name.split('.');
        const extensionCaptured = cutName[cutName.length-1];
        const extensionesPermited = ['png' , 'jpg' , 'jpeg' , 'gif'];

        //EXTRA - Hagamos una pre validación de extensiones para prevenir:
        if(!extensionesPermited.includes(extensionCaptured)){
            return res.status(400).json({
                status : "ERROR",
                method : "Actualización de usuario",
                message : `La extensión ${extensionCaptured} no es permitida, solo se permiten ${extensionesPermited}`
            })
        }

        //EXTRA - Hagamos una pre validación de tamaños para prevenir
        if(avatarName.size > 4000000){
            return res.status(400).json({
                status : "ERROR",
                method : "Actualización de usuario",
                message : 'El tamaño del archivo no debe sobrepasar las 4 MB'
            })
        }

        //Preguntamos primero si existe una imagen ya registrada, si es así, debemos quitarla primero
        if(userUpdate.avatar != "default.png" && userUpdate.avatar != ""){

            const pathImage = path.join(__dirname, '../uploads/users',  userUpdate.avatar);
            if(fs.existsSync(pathImage)){
                fs.unlinkSync( pathImage ); //Eliminamos si existe la imagen
            }

        }

        const myUploadFile = await subirArchivoUsuario(req.files , ['jpg' , 'png'], 'users');
        restoBody.avatar = myUploadFile;

    }else{

        //Dejamos el que ya había
        restoBody.avatar = userUpdate.avatar;

    }

    const update = await User.findByIdAndUpdate( id, restoBody, {new: true})

    return res.status(200).json({
        status : "OK",
        method : "Actualizar usuario desde el controlador",
        message : "Se estableció la comunicación PUT para actualizar usuarios",
        result_desc : "Usuario actualizado correctamente",
        userAuth,
        result : update,
    });

}


module.exports = {
    prueba_comunicacion,
    agregarUsuario,
    obtenerUsuario,
    actualizarUsuario
}