import express from 'express';
import { body } from 'express-validator';
import { validateJwt, validateUser, validateResults } from '../middlewares/index.js';
import { login, passwordRecovery, renovarToken } from '../controllers/auth.js';


const router = express.Router();

const emailValidator = () => body('email')
    .exists().withMessage('El email es requerido')
    .trim()
    .isEmail().withMessage('Email invalido')
    .toLowerCase()

const passwordValidator = () => body('password')
    .exists().withMessage('La contraseña es requerida')
    .isString().withMessage('La contraseña debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('La contraseña no puede estar vacía')

router.post('/auth/login',
    emailValidator(),
    passwordValidator(),
    validateResults,
    login
);
router.post('/auth/recover-password', passwordRecovery);

router.get('/auth/renovar-token',
    validateJwt,
    validateUser,
    renovarToken
);

export { router as authRoutes }
