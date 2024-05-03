import { response } from 'express';
import { Seccion, ColoniaLocalidad, Usuario, Rol } from '../models/index.js';
import { transformDocument } from '../helpers/transformDatabaseDocument.js';


export const crearSeccion = async (req, res = response) => {
    const { esAdministrador } = req;
    const { nombre, coloniasLocalidades, activo } = req.body;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }

        let seccion = await Seccion.findOne({ nombre });
        if (seccion) {
            return res.status(400).json({
                ok: false,
                message: `Ya existe una sección con el nombre: ${nombre}`
            });
        }
        seccion = new Seccion({ nombre, coloniasLocalidades, activo });
        seccion.save();

        const result = await ColoniaLocalidad.updateMany(
            { _id: { $in: coloniasLocalidades } },
            { $set: { seleccionada: true } }
        );

        if (result.matchedCount !== coloniasLocalidades.length) {
            await Seccion.findOneAndRemove({ _id: seccion.id });
            await ColoniaLocalidad.updateMany(
                { _id: { $in: coloniasLocalidades } },
                { $set: { seleccionada: false } }
            );
            return res.status(500).json({
                ok: false,
                message: 'No se pudo crear la sección, si los problemas persisten contacte al administrador'
            });
        }

        const secciones = await Seccion.find({});
        const seccionesIds = secciones.map(seccion => seccion.id);
        const userTypeAdmin = await Rol.findOne({ rol: 'ADMINISTRADOR' });
        if (!userTypeAdmin) {
            return res.status(404).json({
                ok: false,
                message: 'No se pudo registrar la nueva sección a los usuarios administradores, por favor hagalo manualmente'
            });
        }
        await Usuario.updateMany({ rol: userTypeAdmin.id }, { $set: { seccionesAdministradas: seccionesIds } });

        res.status(201).json({
            ok: true,
            message: 'Nueva sección creada exitosamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const actualizarSeccion = async (req, res = response) => {
    const { esAdministrador } = req;
    const { id } = req.params;
    const { body } = req;
    try {
        if (!esAdministrador) {
            return res.status(401).json({
                ok: false,
                message: 'Permisos insuficientes para desempeñar esta acción'
            });
        }

        const seccion = await Seccion.findById(id);
        if (!seccion) {
            return res.status(404).json({
                ok: false,
                message: 'Sección inexistente'
            });
        }
        const coloniasLocalidadesPorDeseleccionar = [];
        seccion.coloniasLocalidades.forEach(coloniaLocalidad => {
            if (!body.coloniasLocalidades.includes(coloniaLocalidad.toString())) {
                coloniasLocalidadesPorDeseleccionar.push(coloniaLocalidad.toString());
            }
        });
        const coloniasLocalidadesPorSeleccionar = body.coloniasLocalidades.filter(coloniaLocalidad => !seccion.coloniasLocalidades.includes(coloniaLocalidad));
        const updatePromises = [
            seccion.updateOne(body),
            ColoniaLocalidad.updateMany(
                { _id: { $in: coloniasLocalidadesPorDeseleccionar } },
                { $set: { seleccionada: false } }
            ),
            ColoniaLocalidad.updateMany(
                { _id: { $in: coloniasLocalidadesPorSeleccionar } },
                { $set: { seleccionada: true } }
            )
        ];
        await Promise.all(updatePromises);
        res.status(200).json({
            ok: true,
            message: 'Sección actualizada correctamente'
        });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                message: `Ya existe una sección con el nombre ${body.nombre}`
            });
        };
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

export const obtenerSecciones = async (req, res = response) => {
    const { esAdministrador, uId } = req;
    const queryParameters = req.query;
    try {
        let secciones;
        if (esAdministrador) {
            secciones = await Seccion.find(queryParameters)
                .populate({
                    path: 'coloniasLocalidades',
                    options: {
                        transform: transformDocument
                    }
                });
        }
        else {
            const seccionesDelUsuario = await Usuario.findById(uId)
                .select('seccionesAdministradas')
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
            secciones = seccionesDelUsuario.seccionesAdministradas
        }
        if (!secciones.length) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }
        res.status(200).json({
            ok: true,
            secciones
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}

export const obtenerSeccion = async (req, res = response) => {
    const { esAdministrador, uId } = req;
    const { id } = req.params;
    try {
        let seccion = await Seccion.findById(id)
            .populate({
                path: 'coloniasLocalidades',
                options: {
                    transform: transformDocument
                }
            });
        if (!seccion) {
            return res.status(404).json({
                ok: false,
                message: 'Sección inexistente'
            });
        }
        if (!esAdministrador) {
            const seccionesDelUsuario = await Usuario.findOne({ _id: uId, seccionesAdministradas: { $in: id } })
                .select('seccionesAdministradas')
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
            seccion = seccionesDelUsuario?.seccionesAdministradas[0];
            if (!seccion) {
                return res.status(401).json({
                    ok: false,
                    message: 'Usuario sin acceso a esa sección'
                });
            }
        }
        res.status(200).json({
            ok: true,
            seccion
        });
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
