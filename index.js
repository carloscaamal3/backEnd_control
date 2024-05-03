import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';

import { dbConnection } from './db/config.js';
import { authRoutes, rolesRoutes, tiposEventosRoutes, ColoniasLocalidadesRoutes, seccionesRoutes, usuariosRoutes, ciudadanosRoutes, eventosRoutes } from './routes/index.js';

// creando aplicación
const app = express();

const startServer = async () => {
    // conectando a la base de datos
    await dbConnection();

    // configurando cors(cross-origin resource sharing)
    app.use(cors());

    // recuperando __dirname para tener acceso a la ruta absoluta, de esa manera no importara desde que direcorio se ejecute la
    // aplicación, siempre se servira la misma carpeta public
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // configurando la carpeta publica
    app.use(express.static(path.join(__dirname, 'public')));

    // configuración para recibir objetos tipo json y añadirlos al objeto body del objeto request
    app.use(express.json());

    // rutas de la rest api

    app.use('/api/v1', authRoutes);
    app.use('/api/v1', rolesRoutes);
    app.use('/api/v1', tiposEventosRoutes);
    app.use('/api/v1', ColoniasLocalidadesRoutes);
    app.use('/api/v1', seccionesRoutes);
    app.use('/api/v1', usuariosRoutes);
    app.use('/api/v1', ciudadanosRoutes);
    app.use('/api/v1', eventosRoutes)

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/public/index.html'));
    });

    // levantando el servidor de express
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto: ${PORT}`);
    });
}
startServer();
