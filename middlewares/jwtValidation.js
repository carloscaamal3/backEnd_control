import { extractJwtData } from "../helpers/index.js";


export const validateJwt = (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'El token es requerido'
        });
    }

    try {
        const { uId, uNombres } = extractJwtData(token);
        req.uId = uId;
        req.uNombres = uNombres;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            message: 'Token invalido'
        });
    }

}
