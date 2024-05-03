import express from 'express';
import { body, param, query } from 'express-validator';
import { crearEvento, obtenerEventos, obtenerEvento, actualizarEvento, marcarAsistencia, borrarAsistencia } from '../controllers/eventos.js';
import { validateJwt, validateUser, validateResults } from '../middlewares/index.js';


const router = express.Router();

const tipoEventoValidator = () => body('tipoEvento')
    .exists().withMessage('El tipo de evento es requerido')
    .isString().withMessage('El tipo de evento debe ser una cadena de caracteres')
    .trim()
    .notEmpty().withMessage('El tipo de evento no puede estar vacío');
const descripcionValidator = () => body('descripcion')
    .exists().withMessage('La descripcion es requerida')
    .isString().withMessage('La descripcion debe ser una cadena de caracteres')
    .trim()
    .notEmpty().withMessage('La descripcion no puede estar vacío');
const fechaValidator = () => body('fecha')
    .exists().withMessage('La fecha es requerida')
    .isString().withMessage('La fecha debe ser una cadena de caracteres')
    .trim()
    .notEmpty().withMessage('La fecha no puede estar vacío');
const horaValidator = () => body('hora')
    .exists().withMessage('La hora es requerida')
    .isString().withMessage('La hora debe ser una cadena de caracteres')
    .trim()
    .notEmpty().withMessage('La hora no puede estar vacío');
const ciudadanoValidator = () => body('ciudadano')
    .exists().withMessage('El ciudadano es requerido')
    .isString().withMessage('El ciudadano debe ser una cadena de caracteres')
    .trim()
    .notEmpty().withMessage('El ciudadano no puede estar vacío');
const usuarioValidator = () => body('usuario')
    .exists().withMessage('El usuario es requerido')
    .isString().withMessage('El usuario debe ser una cadena de caracteres')
    .trim()
    .notEmpty().withMessage('El usuario no puede estar vacío');
const idValidator = () => param('id')
    .isLength({ min: 24, max: 24 }).withMessage('Id invalido');
const queryParamsValidator = (queryParamName) => query(queryParamName)
    .isLength({ min: 24, max: 24 }).withMessage(`${queryParamName} Id invalido`);
router.post('/eventos',
    validateJwt,
    validateUser,
    [
        tipoEventoValidator(),
        descripcionValidator(),
        fechaValidator(),
        horaValidator()
    ],
    validateResults,
    crearEvento
);

router.get('/eventos',
    validateJwt,
    validateUser,
    obtenerEventos
)

router.get('/eventos/:id',
    validateJwt,
    validateUser,
    idValidator(),
    validateResults,
    obtenerEvento
)

router.put('/eventos/marcar-asistencia',
    validateJwt,
    validateUser,
    [
        queryParamsValidator('evento'),
        queryParamsValidator('ciudadano_usuario')
    ],
    validateResults,
    marcarAsistencia
);

router.put('/eventos/borrar-asistencia',
    validateJwt,
    validateUser,
    [
        queryParamsValidator('evento'),
        queryParamsValidator('ciudadano_usuario')
    ],
    validateResults,
    borrarAsistencia
);

router.put('/eventos/:id',
    validateJwt,
    validateUser,
    [
        tipoEventoValidator(),
        descripcionValidator(),
        fechaValidator(),
        horaValidator(),
        idValidator()
    ],
    validateResults,
    actualizarEvento
);

export {
    router as eventosRoutes
}
