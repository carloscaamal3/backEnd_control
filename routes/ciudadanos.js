import express from 'express';
import { body, param } from 'express-validator';
import { validateJwt, validateUser, validateResults } from '../middlewares/index.js';
import { crearCiudadano, obtenerCiudadanos, obtenerCiudadano, actualizarCiudadano } from '../controllers/ciudadanos.js';


const router = express.Router();

const nombresValidator = () => body('nombres')
    .exists().withMessage('El campo nombres es requerido')
    .isString().withMessage('El campo nombres debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo nombres no puede estar vacio')
    .toUpperCase();
const apellidoPaternoValidator = () => body('apellidoPaterno')
    .exists().withMessage('El campo apellido paterno es requerido')
    .isString().withMessage('El campo apellido paterno debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo apellido paterno no puede estar vacio')
    .toUpperCase();
const apellidoMaternoValidator = () => body('apellidoMaterno')
    .exists().withMessage('El campo apellido materno es requerido')
    .isString().withMessage('El campo apellido materno debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo apellido materno no puede estar vacio')
    .toUpperCase();
const ineValidator = () => body('ine')
    .exists().withMessage('El campo ine es requerido')
    .isString().withMessage('El campo ine debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo ine no puede estar vacio');
const telefonoValidator = () => body('telefono')
    .exists().withMessage('El campo telefono es requerido')
    .isString().withMessage('El campo telefono debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo telefono no puede estar vacio');
const direccionValidator = () => body('direccion')
    .exists().withMessage('El campo direccion es requerido')
    .isString().withMessage('El campo direccion debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo direccion no puede estar vacio')
    .toUpperCase();
const coloniaLocalidadValidator = () => body('coloniaLocalidad')
    .exists().withMessage('El campo colonia localidad es requerido')
    .isString().withMessage('El campo colonia localidad debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo colonia localidad no puede estar vacio');
const seccionValidator = () => body('seccion')
    .exists().withMessage('El campo seccion localidad es requerido')
    .isString().withMessage('El campo seccion localidad debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo seccion localidad no puede estar vacio');
const tipoCiudadanoValidator = () => body('tipoCiudadano')
    .exists().withMessage('El campo rol es requerido')
    .isString().withMessage('El campo rol debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo rol no puede estar vacio');
const activoValidator = () => body('activo')
    .exists().withMessage('El campo activo es requerido')
    .isBoolean().withMessage('El campo activo debe ser un booleano');
const idValidator = () => param('id')
    .isLength({ min: 24, max: 24 }).withMessage('Id invalido');

router.post('/ciudadanos',
    validateJwt,
    validateUser,
    [
        nombresValidator(),
        apellidoPaternoValidator(),
        apellidoMaternoValidator(),
        ineValidator(),
        telefonoValidator(),
        direccionValidator(),
        coloniaLocalidadValidator(),
        seccionValidator(),
        tipoCiudadanoValidator(),
        activoValidator()
    ],
    validateResults,
    crearCiudadano
);

router.get('/ciudadanos',
    validateJwt,
    validateUser,
    obtenerCiudadanos
);

router.get('/ciudadanos/:id',
    validateJwt,
    validateUser,
    idValidator(),
    validateResults,
    obtenerCiudadano
);

router.put('/ciudadanos/:id',
    validateJwt,
    validateUser,
    [
        nombresValidator(),
        apellidoPaternoValidator(),
        apellidoMaternoValidator(),
        ineValidator(),
        telefonoValidator(),
        direccionValidator(),
        coloniaLocalidadValidator(),
        seccionValidator(),
        tipoCiudadanoValidator(),
        activoValidator()
    ],
    validateResults,
    actualizarCiudadano
);

export {
    router as ciudadanosRoutes
}
