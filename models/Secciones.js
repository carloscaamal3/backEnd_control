import { Schema, model } from 'mongoose';


const seccionesSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true
    },
    coloniasLocalidades: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ColoniasLocalidades'
        }
    ],
    activo: {
        type: Boolean,
        required: true
    }
});

seccionesSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

export const Seccion = model('Secciones', seccionesSchema);
