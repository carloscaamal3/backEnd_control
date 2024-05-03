import { response } from 'express';
import { TipoEvento } from '../models/TiposEventos.js';


export const crearTipoEvento = async (req, res = response) => {
    const { esAdministrador } = req;
    const { tipoEvento } = req.body;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }

        const nuevoTipoEvento = new TipoEvento({ tipoEvento });
        await nuevoTipoEvento.save();
        res.status(201).json({
            ok: true,
            message: 'Nuevo tipo de evento creado con exito'
        });
    } catch (error) {
        console.log(error);
        if (error?.errors?.tipoEvento?.kind === 'enum') {
            return res.status(400).json({
                ok: false,
                message: `${error.errors.tipoEvento.value} no es un tipo de evento valido`
            });
        }
        if (error?.code === 11000) {
            return res.status(400).json({
                ok: false,
                message: `El tipo de evento ${error.keyValue.tipoEvento} ya existe`
            });
        }
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const obtenerTiposEventos = async (req, res = response) => {
    const { esAdministrador } = req;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }

        const tiposEventos = await TipoEvento.find({});
        if (!tiposEventos.length) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }
        res.status(200).json({
            ok: true,
            tiposEventos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}
