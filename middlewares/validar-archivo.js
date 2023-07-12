const { request, response } = require('express');

const validarArchivoSubida = (req = request , res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: "No hay archivos en la petición realizada ... Validación de Archivo"
        });
    }

    if(req.files.archivo.size > 4000000){
        return res.status(400).json({
            msg: "El archivo subido no debe exceder los 4MB de peso ... Validación de Archivo"
        });
    }

    next();

}

module.exports = {
    validarArchivoSubida
}