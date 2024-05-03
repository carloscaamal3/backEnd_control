import jwt from 'jsonwebtoken';


export const createJwt = (uId, uNombres) => {
    if(!uId?.length || !uNombres?.length) throw new Error('El id y los nombres del usuario son necesario para crear el token');
    return new Promise((resolve, reject) => {
        const payload = {
            uId,
            uNombres
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '8h'
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo crear el token');
                }
                resolve(token);
            }
        );
    });
}
