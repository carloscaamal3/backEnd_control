import { response } from 'express';
import { Rol } from '../models/index.js';


export const crearRol = async (req, res = response) => {
    const { esAdministrador } = req;
    const { rol, descripcion, tieneAcceso, activo } = req.body;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }

        const nuevoRol = new Rol({ rol, descripcion, tieneAcceso, activo });
        await nuevoRol.save();
        res.status(201).json({
            ok: true,
            message: 'Nuevo rol creado con exito'
        });
    } catch (error) {
        console.log(error);
        if (error?.errors?.rol?.kind === 'enum') {
            return res.status(400).json({
                ok: false,
                message: `${error.errors.rol.value} no es un rol valido`
            });
        }
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const obtenerRoles = async (req, res = response) => {
    const { esAdministrador } = req;
    try {
        let roles;

        if (esAdministrador) {
            roles = await Rol.find({});
        }
        else {
            roles = await Rol.find({ tieneAcceso: false });
        }
        if (!roles.length) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }
        res.status(200).json({
            ok: true,
            roles
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}