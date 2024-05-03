import express from 'express';
import { body, param } from 'express-validator';
import { validateJwt, validateResults, validateUser, checkIfColoniaLocalidadToAddIsSelectedAlready } from '../middlewares/index.js';
import { crearSeccion, actualizarSeccion, obtenerSecciones, obtenerSeccion } from '../controllers/secciones.js';


const router = express.Router();

const nombreValidator = () => body('nombre')
    .exists().withMessage('El campo nombre es requerido')
    .isString().withMessage('El campo nombre debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo nombre no puede estar vacío');

const coloniasLocalidadesValidator = () => body('coloniasLocalidades')
    .exists().withMessage('El campo coloniasLocalidades es requerido')
    .isArray().withMessage('El campo coloniasLocalidades debe ser un array con por lo menos una colonia o localidad');

const activoValidator = () => body('activo')
    .exists().withMessage('El campo activo es requerido')
    .isBoolean().withMessage('El campo activo debe ser un booleano');

const idParamValidator = () => param('id')
    .exists().withMessage('El parametro id es requerido')
    .isString().withMessage('El parametro id debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El parametro id no puede estar vacío');

router.post('/secciones',
    validateJwt,
    validateUser,
    [
        nombreValidator(),
        coloniasLocalidadesValidator(),
        activoValidator()
    ],
    validateResults,
    crearSeccion
);

router.put('/secciones/:id',
    validateJwt,
    validateUser,
    [
        nombreValidator(),
        coloniasLocalidadesValidator(),
        activoValidator(),
        idParamValidator()
    ],
    validateResults,
    checkIfColoniaLocalidadToAddIsSelectedAlready,
    actualizarSeccion
);

router.get('/secciones',
    validateJwt,
    validateUser,
    obtenerSecciones
);

router.get('/secciones/:id',
    validateJwt,
    validateUser,
    obtenerSeccion
);

export {
    router as seccionesRoutes
}
