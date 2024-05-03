import { Schema, model } from 'mongoose';


const tiposEventosSchema = new Schema({
    tipoEvento: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        enum: {
            values: ['SECCIONAL', 'GENERAL'],
            message: 'El valor {VALUE} no es soportado'
        }
    }
});

tiposEventosSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

export const TipoEvento = model('TiposEventos', tiposEventosSchema);
