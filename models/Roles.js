import { Schema, model } from 'mongoose';


const rolesSchema = new Schema({
    rol: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        enum: {
            values: ['ADMINISTRADOR', 'COORDINADOR', 'CIUDADANO', 'JEFE DE MANZANA', 'PROMOTOR'],
            message: 'El valor {VALUE} no es soportado'
        }
    },
    descripcion: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    tieneAcceso: {
        type: Boolean,
        required: true
    },
    activo: {
        type: Boolean,
        required: true
    }
});

rolesSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

export const Rol = model('Roles', rolesSchema);
