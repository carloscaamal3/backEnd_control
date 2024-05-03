import { Schema, model } from 'mongoose';


const coloniasLocalidadesSchema = new Schema({
    nombre: { // SAN IGNACIO - CHUNCHUCUM
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    tipoAcentamiento: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        enum: {
            values: ['COLONIA', 'LOCALIDAD'],
            message: 'El valor {VALUE} no es soportado'
        }
    },
    seleccionada: {
        type: Boolean,
        default: false
    },
    activo: {
        type: Boolean,
        required: true,
    }
});

coloniasLocalidadesSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

export const ColoniaLocalidad = model('ColoniasLocalidades', coloniasLocalidadesSchema);
