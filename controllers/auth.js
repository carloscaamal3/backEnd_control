import { response } from "express";
import bcrypt from 'bcrypt';
import { Usuario } from '../models/index.js';
import { createJwt, extractJwtData, transformDocument } from '../helpers/index.js';


export const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email })
            .populate({
                path: 'rol',
                options: {
                    transform: transformDocument
                }
            });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'Email o contraseña incorrectos'
            });
        }
        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            return res.status(401).json({
                ok: false,
                message: 'Email o contraseña incorrectos'
            });
        }
        const token = await createJwt(usuario.id, usuario.nombres);
        const { iat, exp } = extractJwtData(token);
        res.status(200).json({
            ok: true,
            usuario: {
                id: usuario.id,
                nombres: usuario.nombres,
                apellidoPaterno: usuario.apellidoPaterno,
                apellidoMaterno: usuario.apellidoMaterno,
                rol: usuario.rol,
                seccionesAdministradas: usuario.seccionesAdministradas
            },
            token,
            fechaInicio: `${new Date(iat * 1000).getMonth()}/${new Date(iat * 1000).getDate()} ${new Date(iat * 1000).getHours()}:${new Date(iat * 1000).getMinutes()}`,
            fechaExpiracion: `${new Date(exp * 1000).getMonth()}/${new Date(exp * 1000).getDate()} ${new Date(exp * 1000).getHours()}:${new Date(exp * 1000).getMinutes()}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const passwordRecovery = async (req, res = response) => {
    res.status(200).json({ message: 'Recuperando contraseña' });
}

export const renovarToken = async (req, res = response) => {
    const { uId, uNombres } = req;
    try {
        const token = await createJwt(uId, uNombres);
        const { iat, exp } = extractJwtData(token);
        res.status(200).json({
            ok: true,
            token,
            fechaInicio: `${new Date(iat * 1000).getMonth()}/${new Date(iat * 1000).getDate()} ${new Date(iat * 1000).getHours()}:${new Date(iat * 1000).getMinutes()}`,
            fechaExpiracion: `${new Date(exp * 1000).getMonth()}/${new Date(exp * 1000).getDate()} ${new Date(exp * 1000).getHours()}:${new Date(exp * 1000).getMinutes()}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}
