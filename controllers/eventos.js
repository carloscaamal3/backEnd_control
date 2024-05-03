import { response } from 'express';
import { Evento, TipoEvento, Seccion, Ciudadano, Usuario } from '../models/index.js';
import { transformDocument } from '../helpers/index.js';


export const crearEvento = async (req, res = response) => {
    const { esAdministrador, body } = req;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales insuficientes para desempeñar esta acción'
            });
        }
        const promises = [
            TipoEvento.findById(body.tipoEvento),
        ]
        if (body.seccion) {
            promises.push(Seccion.findById(body.seccion));
        }
        const [tipoEvento, seccion] = await Promise.all(promises);
        if (!tipoEvento || body.seccion && !seccion) {
            return res.status(400).json({
                ok: false,
                message: 'Algunos campos son incorrectos'
            })
        }
        const evento = new Evento(body);
        await evento.save();
        res.status(200).json({
            ok: true,
            message: 'Evento creado exitosamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const obtenerEventos = async (req, res = response) => {
    const queryParameters = req.query;
    try {
        const eventos = await Evento.find(queryParameters)
            .populate({
                path: 'tipoEvento',
                options: {
                    transform: transformDocument
                }
            })
            .populate({
                path: 'seccion',
                options: {
                    transform: document => {
                        const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                        object.id = _id;
                        return object;
                    }
                }
            })
            .populate({
                path: 'asistenciaCiudadanos',
                options: {
                    transform: document => {
                        const { __v, _id, creador, ...object } = document.toObject();
                        object.id = _id;
                        return object;
                    }
                },
                populate: {
                    path: 'coloniaLocalidad',
                    options: {
                        transform: transformDocument
                    }
                },
                populate: {
                    path: 'seccion',
                    options: {
                        transform: document => {
                            const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    }
                },
                populate: {
                    path: 'tipoCiudadano',
                    options: {
                        transform: transformDocument
                    }
                }
            })
            .populate({
                path: 'asistenciaUsuarios',
                options: {
                    transform: document => {
                        const { __v, _id, password, seccionesAdministradas, ...object } = document.toObject();
                        object.id = _id;
                        return object;
                    }
                },
                populate: {
                    path: 'coloniaLocalidad',
                    options: {
                        transform: transformDocument
                    }
                },
                populate: {
                    path: 'seccion',
                    options: {
                        transform: document => {
                            const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    }
                },
                populate: {
                    path: 'rol',
                    options: {
                        transform: transformDocument
                    }
                }
            });
        if (!eventos.length) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }
        res.status(200).json({
            ok: true,
            eventos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        })
    }
}

export const obtenerEvento = async (req, res = response) => {
    const { id } = req.params;
    try {
        const evento = await Evento.findById(id).populate({
            path: 'tipoEvento',
            options: {
                transform: transformDocument
            }
        })
            .populate({
                path: 'seccion',
                options: {
                    transform: document => {
                        const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                        object.id = _id;
                        return object;
                    }
                }
            })
            .populate({
                path: 'asistenciaCiudadanos',
                options: {
                    transform: document => {
                        const { __v, _id, creador, ...object } = document.toObject();
                        object.id = _id;
                        return object;
                    }
                },
                populate: {
                    path: 'coloniaLocalidad',
                    options: {
                        transform: transformDocument
                    }
                },
                populate: {
                    path: 'seccion',
                    options: {
                        transform: document => {
                            const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    }
                },
                populate: {
                    path: 'tipoCiudadano',
                    options: {
                        transform: transformDocument
                    }
                }
            })
            .populate({
                path: 'asistenciaUsuarios',
                options: {
                    transform: document => {
                        const { __v, _id, password, seccionesAdministradas, ...object } = document.toObject();
                        object.id = _id;
                        return object;
                    }
                },
                populate: {
                    path: 'coloniaLocalidad',
                    options: {
                        transform: transformDocument
                    }
                },
                populate: {
                    path: 'seccion',
                    options: {
                        transform: document => {
                            const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                            object.id = _id;
                            return object;
                        }
                    }
                },
                populate: {
                    path: 'rol',
                    options: {
                        transform: transformDocument
                    }
                }
            });
        if (!evento) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }
        res.status(200).json({
            ok: true,
            evento
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        })
    }
}

export const actualizarEvento = async (req, res = response) => {
    const { esAdministrador, body } = req;
    const { id } = req.params;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales insuficientes para desempeñar esta acción'
            });
        }
        const evento = await Evento.findById(id);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros de ese evento'
            });
        }
        const promises = [
            TipoEvento.findById(body.tipoEvento),
        ]
        if (body.seccion) {
            promises.push(Seccion.findById(body.seccion));
        }
        const [tipoEvento, seccion] = await Promise.all(promises);
        if (!tipoEvento || body.seccion && !seccion) {
            return res.status(400).json({
                ok: false,
                message: 'Algunos datos son erroneos'
            });
        }
        if (body.seccion && tipoEvento?.tipoEvento !== 'SECCIONAL' || tipoEvento?.tipoEvento === 'SECCIONAL' && !body.seccion) {
            return res.status(400).json({
                ok: false,
                message: 'Si el tipo de evento es SECCIONAL entonces debe proporcionar una seccion y viceversa'
            });
        }
        if (tipoEvento.tipoEvento === 'GENERAL' && !body.seccion) {
            body.seccion = null;
        }
        await evento.updateOne(body);
        res.status(200).json({
            ok: true,
            message: 'Evento actualizado correctamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const marcarAsistencia = async (req, res = response) => {
    const { evento: eventoId, ciudadano_usuario: ciudadanoUsuarioId } = req.query;
    try {
        let alreadyInList = true;
        const promises = [
            Evento.findById(eventoId),
            Ciudadano.findById(ciudadanoUsuarioId),
            Usuario.findById(ciudadanoUsuarioId)
        ]
        const [evento, ciudadano, usuario] = await Promise.all(promises);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros de ese evento'
            });
        }
        if (!ciudadano && !usuario) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros de ese usuario o ciudadano'
            });
        }
        if (ciudadano && !evento.asistenciaCiudadanos.includes(ciudadano.id)) {
            evento.asistenciaCiudadanos = [...evento.asistenciaCiudadanos, ciudadano.id];
            alreadyInList = false;
            await evento.save();
        }
        if (usuario && !evento.asistenciaUsuarios.includes(usuario.id)) {
            evento.asistenciaUsuarios = [...evento.asistenciaUsuarios, usuario.id];
            alreadyInList = false;
            await evento.save();
        }
        if (alreadyInList) {
            return res.status(409).json({
                ok: false,
                message: 'La asistencia de ese usuario ya ha sido marcada'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Asistencia marcada correctamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const borrarAsistencia = async (req, res = response) => {
    const { evento: eventoId, ciudadano_usuario: ciudadanoUsuarioId } = req.query;
    try {
        let notInList = true;
        const promises = [
            Evento.findById(eventoId),
            Ciudadano.findById(ciudadanoUsuarioId),
            Usuario.findById(ciudadanoUsuarioId)
        ];
        const [evento, ciudadano, usuario] = await Promise.all(promises);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros de ese evento'
            });
        }

        if (!ciudadano && !usuario) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros de ese usuario o ciudadano'
            });
        }

        if (ciudadano && evento.asistenciaCiudadanos.includes(ciudadano.id)) {
            evento.asistenciaCiudadanos = evento.asistenciaCiudadanos.filter(ciudadanoAsistente => ciudadanoAsistente.toHexString() !== ciudadano.id);
            notInList = false;
            await evento.save();
        }
        if (usuario && evento.asistenciaUsuarios.includes(usuario.id)) {
            evento.asistenciaUsuarios = evento.asistenciaUsuarios.filter(usuarioAsistente => usuarioAsistente.toHexString() !== usuario.id);
            notInList = false;
            await evento.save();
        }

        if (notInList) {
            return res.status(404).json({
                ok: false,
                message: 'El usuario o ciudadano no estaba en la lista de asistentes'
            });
        }

        res.status(200).json({
            ok: true,
            message: 'Asistencia removida con exito'
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}
