import express from 'express';
import { body } from 'express-validator';
import { validateResults, validateJwt, validateUser } from '../middlewares/index.js';
import { crearRol, obtenerRoles } from '../controllers/roles.js';


const router = express.Router();

router.post('/roles',
    validateJwt,
    validateUser,
    [body('rol')
        .isString().withMessage('Rol debe ser una cadena de texto')
        .trim()
        .notEmpty().withMessage('Campo rol está vacío'),
    body('descripcion')
        .isString().withMessage('Descripción debe ser una cadena de texto')
        .trim()
        .notEmpty().withMessage('Campo descripción está vacío'),
    body('tieneAcceso')
        .exists().withMessage('El campo tiene acceso no puede ser vacío')
        .isBoolean().withMessage('El campo tiene acceso debe ser un booleano'),
    body('activo')
        .exists().withMessage('El campo activo no puede ser vacío')
        .isBoolean().withMessage('El campo activo debe ser un booleano')
    ],
    validateResults,
    crearRol);

router.get('/roles',
    validateJwt,
    validateUser,
    obtenerRoles);

export {
    router as rolesRoutes
}
