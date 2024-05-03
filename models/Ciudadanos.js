import { Schema, model } from 'mongoose';


const ciudadanosSchema = new Schema({
    nombres: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    apellidoPaterno: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    apellidoMaterno: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    ine: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    coloniaLocalidad: {
        type: Schema.Types.ObjectId,
        ref: 'ColoniasLocalidades',
        required: true
    },
    seccion: {
        type: Schema.Types.ObjectId,
        ref: 'Secciones',
        required: true
    },
    tipoCiudadano: {
        type: Schema.Types.ObjectId,
        ref: 'Roles',
        required: true
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    },
    activo: {
        type: Boolean,
        required: true
    }
});

ciudadanosSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

export const Ciudadano = model('Ciudadanos', ciudadanosSchema);
