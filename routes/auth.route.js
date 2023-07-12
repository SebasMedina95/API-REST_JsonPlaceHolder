const  { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

//Validaciones Middleware
const { validarCampos } = require('../middlewares/validar-campos');

const { login } = require('../controllers/auth.controller');



router.post('/login', [
    check('email', 'El email no es valido').isEmail(),
    check('password', 'El password es obligatorio para el login').not().isEmpty(),
    validarCampos
], login);


module.exports = router;