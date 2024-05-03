import { Schema, model } from 'mongoose';


const usuariosSchema = new Schema({
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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
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
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Roles',
        required: true
    },
    seccionesAdministradas: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Secciones',
            required: true
        }
    ],
    activo: {
        type: Boolean,
        required: true
    }
});

usuariosSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

export const Usuario = model('Usuarios', usuariosSchema);
