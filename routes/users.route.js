const  { Router } = require('express');
const { check } = require('express-validator');

//Llamados controlador
const { prueba_comunicacion, 
        agregarUsuario, 
        obtenerUsuario,
        actualizarUsuario} = require('../controllers/users.controller');
const { emailValido, 
        existeUserPorId, 
        emailValido_edit} = require('../helpers/db-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { auth } = require('../middlewares/auth');

const router = Router();


router.get('/prueba-comunicacion', prueba_comunicacion);

//Agregar Usuario
router.post('/', [

    auth,
    
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El nombre debe ser texto').not().isNumeric(),
    check('email', 'El email no es valido').isEmail(),
    check('password', 'El password es un campo obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mínimo 6 caracteres').isLength({ min:6 }),

    check('email').custom( (email) => emailValido(email) ),

    validarCampos

], agregarUsuario);

//Buscar usuario
router.get('/:id', [

    auth,

    check('id', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),

    check('id').custom( (id) => existeUserPorId(id) ),

    validarCampos

], obtenerUsuario);

//Actualización de un usuario
router.put('/:id', [

    auth,

    check('id', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El nombre debe ser texto').not().isNumeric(),
    check('email', 'El email no es valido').isEmail(),
    check('password', 'El password es un campo obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mínimo 6 caracteres').isLength({ min:6 }),

    check('email').custom( (email, id) => emailValido_edit(email, id.req.url.split('/')[1]) ),

    validarCampos

], actualizarUsuario);

module.exports = router;