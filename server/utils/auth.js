import jwt from 'jsonwebtoken'
const { sign, verify } = jwt
import 'dotenv/config'

const secret = process.env.JWT_SECRET;
const expirtion = '7d';

export function signToken({ email, id, username }, res) {
    const payload = { email, id, username };

    const token = sign({ data: payload }, secret, { expiresIn: expirtion });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

}
export async function verifyToken(req, res, next) {
    const token = await req.cookies.token; // Replace with the actual cookie name
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Token is valid
        req.user = decoded; // You can attach user information to the request if needed
        next();
    });
}
