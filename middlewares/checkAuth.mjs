import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';


const verifyToken = (req, res, next) => {
    console.log('Received Header in Middleware:', req.header('Authorization'));
    const token = req.header('Authorization').split(' ')[1];
    console.log('Received Token in Middleware:', token);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            console.log('Token verified successfully');
            console.log('Decoded payload:', decoded._id);
            console.log('Decoded payload:', decoded.phone_number);

            Object.defineProperty(req, 'user', { value: { userId: decoded._id, phoneNumber: decoded.phone_number }, writable: true });
            
            next();
        }
    });
};

export default verifyToken;