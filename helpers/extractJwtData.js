import jwt from 'jsonwebtoken';

export const extractJwtData = (token) => {
    const { uId, uNombres, iat, exp } = jwt.verify(token, process.env.JWT_SECRET);
    return {
        uId,
        uNombres,
        iat,
        exp
    }
}
