import { Usuario } from '../models/index.js';


export const validateUser = async (req, res, next) => {
    const { uId, uNombres } = req;
    try {
        const usuario = await Usuario.findById(uId).populate('rol');
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario inexistente'
            });
        }
        if (usuario.nombres !== uNombres) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario invalido'
            });
        }
        req.esAdministrador = usuario.rol.rol === 'ADMINISTRADOR' ? true : false;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }

}
