const { response, request } = require('express');
const axios = require('axios');
const xl = require('excel4node');

const Log = require('../models/logs.model');


const prueba_logs = async(req = request, res = response) => {

    return res.status(200).json({
        status : "OK",
        message : "Comunicación establecida."
    })

}

const obtener_users = async(req = request, res = response) => {

    const { limite } = req.query;

    try {
        
        const instancia = axios.create({
            baseURL: `https://jsonplaceholder.typicode.com/users`,
            params: {
                '_limit' : limite,
            }
        });

        const resp = await instancia.get();
        const resultString = JSON.stringify(resp.data);

        //Guardamos registro de petición
        const logInstance = new Log({
            user : req.authenticatedUser.id, //Logeado,
            method : "Solicitar usuarios a API JsonPlaceHolder",
            data : resultString
        });

        logInstance.save();

        return res.status(200).json({
            status : "OK",
            result : resp.data,
            log : logInstance
        })

    } catch (error) {
        console.log(error)
    }

}

const obtener_posts = async(req = request, res = response) => {

    const { limite } = req.query;

    try {
        
        const instancia = axios.create({
            baseURL: `https://jsonplaceholder.typicode.com/posts`,
            params: {
                '_limit' : limite,
            }
        });

        const resp = await instancia.get();
        const resultString = JSON.stringify(resp.data);

        //Guardamos registro de petición
        const logInstance = new Log({
            user : req.authenticatedUser.id, //Logeado,
            method : "Solicitar publicaciones a API JsonPlaceHolder",
            data : resultString
        });

        logInstance.save();

        return res.status(200).json({
            status : "OK",
            result : resp.data,
            log : logInstance
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            status : "ERROR",
            message : "No se pudo realizar la consulta, verifique URL"
        })

    }

}

const obtener_photos = async(req = request, res = response) => {

    const { id , limite} = req.query;
    const arrayResultPhotos = [];
    
    try {
        
        //Primero debemos buscar los álbum por usuario
        const instanciaAlbums = axios.create({
            baseURL: `https://jsonplaceholder.typicode.com/users/${id}/albums`,
            params: {
                '_limit' : limite,
            }
        });

        const respAlbums = await instanciaAlbums.get();

        //Guardo en array los albums para usarlos como consulta siguiente:
        let arrayAlbums = [];
        respAlbums.data.map( album => {

            arrayAlbums.push( album.id );

        });

        for (let i = 0; i < arrayAlbums.length; i++) {
            
            let instanciaPhotos = axios.create({
                baseURL: `https://jsonplaceholder.typicode.com/albums/${arrayAlbums[i]}/photos`,
                params: {
                    '_limit' : limite,
                }
            });

            let respPhotos = await instanciaPhotos.get();
            arrayResultPhotos.push(respPhotos.data);
            
        }

        const resultString = JSON.stringify(arrayResultPhotos);

        //Guardamos registro de petición
        const logInstance = new Log({
            user : req.authenticatedUser.id, //Logeado,
            method : "Solicitar fotos a API JsonPlaceHolder",
            data : resultString
        });

        logInstance.save();

        return res.status(200).json({
            status : "OK",
            arrayResultPhotos,
            log: logInstance
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status : "ERROR",
            message : "No se pudo realizar la consulta, verifique URL"
        })
    }

}

const listar_logs = async(req = request, res = response) => {

    const myAuth = req.authenticatedUser;

    const logsDB = await Log.find();

    const resultString = JSON.stringify(logsDB);

    //Guardamos registro de petición
    const logInstance = new Log({
        user : req.authenticatedUser.id, //Logeado,
        method : "Solicitar listado de LOGS a API Local (Como acción general)",
        data : resultString
    });

    logInstance.save();

    res.status(200).json({
        msg : 'Listado de LOGS generados a traves de las peticiones',
        cantidad: logsDB.length,
        result: logsDB,
        myAuth
    });

}

const eliminar_logs = async(req = request, res = response) => {

    const { id } = req.params;
    const logsDB = await Log.findById(id);

    const eliminarProducto = await Log.findByIdAndDelete(id , {new: true});

    res.status(200).json({
        status : "OK",
        msg : 'Eliminar LOG',
        result: logsDB,
        usuarioAutenticado : req.usuarioLogeado
    });

}

const actualizar_log = async(req = request, res = response) => {

    const { id } = req.params;
    const { method } = req.body;

    const log = await Log.findByIdAndUpdate(id , {method, user:req.authenticatedUser.id} , {new: true});

    res.status(200).json({
        msg : 'Actualización de LOG',
        result: log,
        usuarioAutenticado : req.authenticatedUser.id
    });

}

const generar_excel = async(req = request, res = response) => {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1');
    var ws2 = wb.addWorksheet('Sheet 2');

    // Create a reusable style
    var style = wb.createStyle({
    font: {
        color: '#FF0800',
        size: 12,
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    // Set value of cell A1 to 100 as a number type styled with paramaters of style
    ws.cell(1, 1)
    .number(100)
    .style(style);

    // Set value of cell B1 to 200 as a number type styled with paramaters of style
    ws.cell(1, 2)
    .number(200)
    .style(style);

    // Set value of cell C1 to a formula styled with paramaters of style
    ws.cell(1, 3)
    .formula('A1 + B1')
    .style(style);

    // Set value of cell A2 to 'string' styled with paramaters of style
    ws.cell(2, 1)
    .string('string')
    .style(style);

    // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
    ws.cell(3, 1)
    .bool(true)
    .style(style)
    .style({font: {size: 14}});

    wb.write('Excel.xlsx');

}


module.exports = {
    prueba_logs,
    obtener_users,
    obtener_posts,
    obtener_photos,
    listar_logs,
    eliminar_logs,
    actualizar_log,
    generar_excel
}