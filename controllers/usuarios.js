import { response, request } from 'express';
import bcrypt from 'bcrypt';
import { Usuario, ColoniaLocalidad, Seccion, Rol } from '../models/index.js';
import { transformDocument } from '../helpers/index.js';


export const crearUsuario = async (req = request, res = response) => {
    const { body, esAdministrador } = req;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }
        const promises = [
            ColoniaLocalidad.findById(body.coloniaLocalidad),
            Seccion.findById(body.seccion),
            Rol.findById(body.rol),
            Seccion.find({ _id: { $in: body.seccionesAdministradas } })
        ];
        const [coloniaLocalidad, seccion, rol, seccionesAdministradas] = await Promise.all(promises);
        // validations
        if (!coloniaLocalidad || !seccion || !rol || seccionesAdministradas.length !== body.seccionesAdministradas.length) {
            return res.status(400).json({
                ok: false,
                message: 'Algunos datos son invalidos'
            });
        }
        body.password = await bcrypt.hash(body.password, 12);
        const usuario = new Usuario(body);
        await usuario.save();
        res.status(201).json({
            ok: true,
            usuario,
            message: 'Usuario creado exitosamente'
        });
    } catch (error) {
        console.log(error);
        if (error.kind) {
            return res.status(400).json({
                ok: false,
                message: 'Id invalido'
            });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                message: `Ese ${Object.keys(error.keyValue)[0]} ya está registrado`
            });
        }
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const obtenerUsuarios = async (req, res = response) => {
    const { esAdministrador } = req;
    const queryParameters = req.query;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }
        const usuarios = await Usuario.find(queryParameters)
            .select('-password')
            .populate({
                path: 'coloniaLocalidad',
                options: {
                    transform: transformDocument
                }
            })
            .populate({
                path: 'seccion',
                options: {
                    transform: function (document) {
                        const { __v, _id, coloniasLocalidades, ...object } = document.toObject();
                        object.id = _id;
                        return object;
                    }
                }
            })
            .populate({
                path: 'rol',
                options: {
                    transform: transformDocument
                }
            })
            .populate({
                path: 'seccionesAdministradas',
                options: {
                    transform: transformDocument
                },
                populate: {
                    path: 'coloniasLocalidades',
                    options: {
                        transform: transformDocument
                    }
                }
            });
        if (!usuarios.length) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }
        res.status(200).json({
            ok: true,
            usuarios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const obtenerUsuario = async (req, res = response) => {
    const { esAdministrador, uId } = req;
    const { id } = req.params;
    try {
        if (!esAdministrador && uId !== id) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }
        const usuario = await Usuario.findById(id)
            .select('-password')
            .populate({
                path: 'coloniaLocalidad',
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
                path: 'rol',
                options: {
                    transform: transformDocument
                }
            })
            .populate({
                path: 'seccionesAdministradas',
                options: {
                    transform: transformDocument
                },
                populate: {
                    path: 'coloniasLocalidades',
                    options: {
                        transform: transformDocument
                    }
                }
            });
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario inexistente'
            });
        }
        res.status(200).json({
            ok: true,
            usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const actualizarUsuario = async (req, res = response) => {
    const { uId, esAdministrador, body } = req;
    const { id } = req.params;
    try {
        if (!esAdministrador && uId !== id) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales insuficientes para desempeñar esta acción'
            });
        }
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros de ese usuario'
            });
        }
        const promises = [
            ColoniaLocalidad.findById(body.coloniaLocalidad),
            Seccion.findById(body.seccion),
            Rol.findById(body.rol),
            Seccion.find({ _id: { $in: body.seccionesAdministradas } })
        ];
        const [coloniaLocalidad, seccion, rol, seccionesAdministradas] = await Promise.all(promises);
        // validations
        if (!coloniaLocalidad || !seccion || !rol || seccionesAdministradas.length !== body.seccionesAdministradas.length) {
            return res.status(400).json({
                ok: false,
                message: 'Algunos datos son invalidos'
            });
        }
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 12);
        }
        await usuario.updateOne(body);
        res.status(200).json({
            ok: true,
            message: 'Usuario actualizado correctamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}
