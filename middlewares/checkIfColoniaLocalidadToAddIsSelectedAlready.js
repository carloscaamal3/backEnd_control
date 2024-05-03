import { request, response } from 'express';
import { Seccion, ColoniaLocalidad } from '../models/index.js';


export const checkIfColoniaLocalidadToAddIsSelectedAlready = async (req = request, res = response, next) => {
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

        const seccion = await Seccion.findById(id)
        const coloniasLocalidadesToAdd = body.coloniasLocalidades.filter((coliniaLocalidad) => !seccion.coloniasLocalidades.includes(coliniaLocalidad));
        let coliniasLocalidadesSeleccionadas = [];
        if (coloniasLocalidadesToAdd.length > 0) {
            const coloniasLocalidadesDb = await ColoniaLocalidad.find({ _id: { $in: coloniasLocalidadesToAdd } })
                .select('nombre seleccionada -_id');
            coliniasLocalidadesSeleccionadas = coloniasLocalidadesDb.filter((coloniaLocalidadDb) => (coloniaLocalidadDb.seleccionada)).map(coloniaDb => coloniaDb.nombre);
        }
        if (coliniasLocalidadesSeleccionadas.length > 0) {
            return res.status(409).json({
                ok: false,
                message: 'Las siguientes colonias y/o localidades ya se encuentran seleccionadas',
                coliniasLocalidadesSeleccionadas
            });
        }
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error, por favor contacte al equipo de soporte'
        });
    }
}
