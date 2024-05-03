import express from 'express';
import { body } from 'express-validator';
import { validateJwt, validateResults, validateUser } from '../middlewares/index.js';
import { crearColoniaLocalidad, obtenerColoniasLocalidades, actualizarColoniaLocalidad } from '../controllers/coloniasLocalidades.js';


const router = express.Router();

const validateNombre = () => body('nombre')
    .isString().withMessage('El campo nombre debe ser texto')
    .trim()
    .notEmpty().withMessage('El campo nombre es requerido');
const validateTipoAcentamiento = () => body('tipoAcentamiento')
    .isString().withMessage('El campo tipo acentamiento debe ser texto')
    .trim()
    .notEmpty().withMessage('El campo tipo de acentamiento es requerido')
    .toUpperCase();
const validateActivo = () => body('activo')
    .exists().withMessage('El campo activo es requerido')
    .isBoolean().withMessage('El campo activo debe ser un booleano');
router.post('/colonias-localidades',
    validateJwt,
    validateUser,
    validateNombre(),
    validateTipoAcentamiento(),
    validateActivo(),
    validateResults,
    crearColoniaLocalidad
);

router.get('/colonias-localidades',
    validateJwt,
    validateUser,
    obtenerColoniasLocalidades
);

router.put('/colonias-localidades/:id',
    validateJwt,
    validateUser,
    validateNombre(),
    validateTipoAcentamiento(),
    validateActivo(),
    validateResults,
    actualizarColoniaLocalidad
);

export {
    router as ColoniasLocalidadesRoutes
}
