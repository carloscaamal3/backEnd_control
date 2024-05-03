import mongoose from "mongoose";


export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log('Base de datos en linea');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos');
    }
}