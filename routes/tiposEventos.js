import express from 'express';
import { body } from 'express-validator';
import { validateResults, validateJwt, validateUser } from '../middlewares/index.js';
import { crearTipoEvento, obtenerTiposEventos } from '../controllers/tiposEventos.js';



const router = express.Router();

router.post('/tipos-eventos',
    validateJwt,
    validateUser,
    body('tipoEvento')
        .isString().withMessage('El tipo de evento debe ser una cadena de texto')
        .trim()
        .notEmpty().withMessage('El tipo de evento no puede ser vacío'),
    validateResults,
    crearTipoEvento
);

router.get('/tipos-eventos',
    validateJwt,
    validateUser,
    obtenerTiposEventos
);

export {
    router as tiposEventosRoutes
}
