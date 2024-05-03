import { query, response } from 'express';
import { ColoniaLocalidad, Usuario } from '../models/index.js';
import { transformDocument } from '../helpers/index.js';


export const crearColoniaLocalidad = async (req, res = response) => {
    const { esAdministrador } = req;
    const { nombre, tipoAcentamiento, seleccionada, activo } = req.body;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }

        let coloniaLocalidad = await ColoniaLocalidad.findOne({ nombre, tipoAcentamiento });
        if (coloniaLocalidad) {
            return res.status(400).json({
                ok: false,
                message: `Ya existe una ${tipoAcentamiento} con el nombre ${nombre}`
            });
        }
        coloniaLocalidad = new ColoniaLocalidad({ nombre, tipoAcentamiento, seleccionada, activo });
        await coloniaLocalidad.save();
        res.status(201).json({
            ok: true,
            message: `Nueva ${tipoAcentamiento} creada con exito`
        });
    } catch (error) {
        console.log(error);
        if (error?.errors?.tipoAcentamiento?.kind === 'enum') {
            return res.status(400).json({
                ok: false,
                message: `${error.errors.tipoAcentamiento.value} no es un tipo de acentamiento valido`
            });
        }
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const obtenerColoniasLocalidades = async (req, res = response) => {
    const { uId, esAdministrador } = req;
    const queryParameters = req.query;
    try {
        let coloniasLocalidades = [];
        if (esAdministrador) {
            coloniasLocalidades = await ColoniaLocalidad.find(queryParameters);
        }
        else {
            const usuario = await Usuario.findById(uId).populate(
                {
                    path: 'seccionesAdministradas',
                    populate: {
                        path: 'coloniasLocalidades',
                        match: queryParameters
                    }
                }
            );
            coloniasLocalidades = usuario?.seccionesAdministradas[0]?.coloniasLocalidades;
        }

        if (!coloniasLocalidades.length) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }
        res.status(200).json({
            ok: true,
            coloniasLocalidades
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const actualizarColoniaLocalidad = async (req, res = response) => {
    const { esAdministrador, body } = req;
    const { id } = req.params;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }

        if (body.tipoAcentamiento !== 'COLONIA' && body.tipoAcentamiento !== 'LOCALIDAD') {
            return res.status(400).json({
                ok: false,
                message: `El tipo de acentamiento ${body.tipoAcentamiento} no es valido`
            });
        }
        const coloniaLocalidad = await ColoniaLocalidad.findById(id);
        if (!coloniaLocalidad) {
            return res.status(404).json({
                ok: false,
                message: 'Colonia inexistente'
            })
        }
        await coloniaLocalidad.updateOne(body);
        res.status(200).json({
            ok: true,
            message: `${body.tipoAcentamiento} actializada correctamente`
        })
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                ok: false,
                message: 'Id invalido'
            });
        }
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}
