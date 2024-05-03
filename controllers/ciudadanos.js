import { response } from 'express';
import { Ciudadano, Usuario, ColoniaLocalidad, Seccion, Rol } from '../models/index.js';
import { transformDocument } from '../helpers/index.js';


export const crearCiudadano = async (req, res = response) => {
    const { body, uId } = req;

    try {
        const ciudadanoUsuarioPromises = [
            Ciudadano.findOne({ ine: body.ine }),
            Usuario.findOne({ ine: body.ine })
        ]
        const [ciudadanoRegistreado, usuarioRegistrado] = await Promise.all(ciudadanoUsuarioPromises);
        if (ciudadanoRegistreado || usuarioRegistrado) {
            return res.status(400).json({
                ok: false,
                message: `Ya existe un usuario o un ciudadano con el ine: ${body.ine}`
            });
        }
        const promises = [
            ColoniaLocalidad.findById(body.coloniaLocalidad),
            Seccion.findById(body.seccion),
            Rol.findById(body.tipoCiudadano)
        ];
        const [coloniaLocalidad, seccion, rol] = await Promise.all(promises);
        if (!coloniaLocalidad || !seccion || !rol) {
            return res.status(400).json({
                ok: false,
                message: 'Algunos campos son erroneos'
            });
        }
        body.creador = uId;
        const ciudadano = new Ciudadano(body);
        ciudadano.save();
        res.status(201).json({
            ok: true,
            message: 'Ciudadano creado exitosamente',
            ciudadano
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const obtenerCiudadanos = async (req, res = response) => {
    const { esAdministrador, uId } = req;
    const queryParameters = req.query;
    try {
        let ciudadanos;
        if (esAdministrador) {
            ciudadanos = await Ciudadano.find(queryParameters)
                .populate({
                    path: 'coloniaLocalidad',
                    options: {
                        transform: transformDocument
                    }
                })
                .populate({
                    path: 'seccion',
                    options: {
                        transform: (document) => {
                            const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    }
                })
                .populate({
                    path: 'tipoCiudadano',
                    options: {
                        transform: transformDocument
                    }
                })
                .populate({
                    path: 'creador',
                    options: {
                        transform: (document) => {
                            const { __v, _id, password, coloniaLocalidad, seccion, seccionesAdministradas, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    },
                    populate: {
                        path: 'rol',
                        options: {
                            transform: transformDocument
                        }
                    }
                });
        }
        else {
            const usuario = await Usuario.findById(uId)
                .select('seccionesAdministradas');
            queryParameters.seccion = { $in: usuario.seccionesAdministradas[0].toHexString() }
            ciudadanos = await Ciudadano.find(queryParameters)
                .populate({
                    path: 'coloniaLocalidad',
                    options: {
                        transform: transformDocument
                    }
                })
                .populate({
                    path: 'seccion',
                    options: {
                        transform: (document) => {
                            const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    }
                })
                .populate({
                    path: 'tipoCiudadano',
                    options: {
                        transform: transformDocument
                    }
                })
                .populate({
                    path: 'creador',
                    options: {
                        transform: (document) => {
                            const { __v, _id, password, coloniaLocalidad, seccion, seccionesAdministradas, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    },
                    populate: {
                        path: 'rol',
                        options: {
                            transform: transformDocument
                        }
                    }
                });
        }
        if (!ciudadanos.length) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }
        res.status(200).json({
            ok: true,
            ciudadanos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }

}

export const obtenerCiudadano = async (req, res = response) => {
    const { esAdministrador, uId } = req;
    const { id } = req.params;
    try {
        let ciudadano;
        if (esAdministrador) {
            ciudadano = await Ciudadano.findById(id)
                .select('-creador')
                .populate({
                    path: 'coloniaLocalidad',
                    options: {
                        transform: transformDocument
                    }
                })
                .populate({
                    path: 'seccion',
                    options: {
                        transform: (document) => {
                            const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    }
                })
                .populate({
                    path: 'tipoCiudadano',
                    options: {
                        transform: transformDocument
                    }
                });
        }
        else {
            const usuario = await Usuario.findById(uId)
                .select('seccionesAdministradas');
            ciudadano = await Ciudadano.findOne({ _id: id, seccion: { $in: usuario.seccionesAdministradas[0].toHexString() } })
                .select('-creador')
                .populate({
                    path: 'coloniaLocalidad',
                    options: {
                        transform: transformDocument
                    }
                })
                .populate({
                    path: 'seccion',
                    options: {
                        transform: (document) => {
                            const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    }
                })
                .populate({
                    path: 'tipoCiudadano',
                    options: {
                        transform: transformDocument
                    }
                });
            if (!ciudadano) {
                return res.status(401).json({
                    ok: false,
                    message: 'Credenciales insuficientes para consultar a este ciudadano'
                });
            }
        }
        if (!ciudadano) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }
        res.status(200).json({
            ok: true,
            ciudadano
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const actualizarCiudadano = async (req, res = response) => {
    const { id } = req.params;
    const { esAdministrador, uId } = req;
    const { nombres, apellidoPaterno, apellidoMaterno, ine, telefono, direccion, coloniaLocalidad, seccion, tipoCiudadano, activo } = req.body;
    try {
        let resp;
        const promises = [
            Ciudadano.findById(id),
            Usuario.findOne({ ine })
        ]
        const [ciudadano, ineExiste] = await Promise.all(promises);
        if (ineExiste) {
            return res.status(400).json({
                ok: false,
                message: 'Ese ine ya está registrado'
            });
        }
        if (!ciudadano) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros de ese ciudadano'
            });
        }
        if (esAdministrador) {
            resp = await ciudadano.updateOne({ nombres, apellidoPaterno, apellidoMaterno, ine, telefono, direccion, coloniaLocalidad, seccion, tipoCiudadano, activo });
        }
        else {
            const usuario = await Usuario.findById(uId)
                .select('seccionesAdministradas');
            if (usuario.seccionesAdministradas[0].toHexString() !== ciudadano.seccion.toHexString()) {
                return res.status(401).json({
                    ok: false,
                    message: 'Credenciales insuficientes para actualizar este ciudadano'
                });
            }
            resp = await ciudadano.updateOne({ nombres, apellidoPaterno, apellidoMaterno, ine, telefono, direccion, coloniaLocalidad, seccion, tipoCiudadano, activo });
        }
        if (resp.matchedCount === 0) {
            return res.status(500).json({
                ok: false,
                message: 'Ocurrio un error, no se pudo actualizar el ciudadano; por favor contacte al equipo de soporte'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Ciudadano actualizado correctamente'
        });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                message: 'Ya existe un ciudadano con esa ine'
            });
        }
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}