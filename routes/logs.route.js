const  { Router } = require('express');
const { check } = require('express-validator');

const { prueba_logs, 
        obtener_users, 
        obtener_posts,
        obtener_photos,
        listar_logs,
        eliminar_logs,
        actualizar_log,
        generar_excel} = require('../controllers/logs.controller');
const { auth } = require('../middlewares/auth');

const router = Router();

router.get('/prueba', prueba_logs);

router.get('/getUsers', [
    auth
] , obtener_users);

router.get('/getPosts', [
    auth
] , obtener_posts);

router.get('/getPhotos', [
    auth
] , obtener_photos);

router.get('/getLogs', [
    auth
] , listar_logs);

router.delete('/:id', [
    auth
] , eliminar_logs);

router.put('/:id', [
    auth
] , actualizar_log);

router.put('/getExport', [
    auth
] , generar_excel);



module.exports = router;