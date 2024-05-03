import { Schema, model } from 'mongoose';


const eventosSchema = new Schema({
    tipoEvento: {
        type: Schema.Types.ObjectId,
        ref: 'TiposEventos',
        required: true
    },
    seccion: {
        type: Schema.Types.ObjectId,
        ref: 'Secciones',
        default: null
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    fecha: {
        type: String,
        required: true,
        trim: true
    },
    hora: {
        type: String,
        required: true,
        trim: true
    },
    asistenciaCiudadanos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Ciudadanos'
        }
    ],
    asistenciaUsuarios: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Usuarios'
        }
    ],
    activo: {
        type: Boolean,
        default: true
    }
});

eventosSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

export const Evento = model('Eventos', eventosSchema);
