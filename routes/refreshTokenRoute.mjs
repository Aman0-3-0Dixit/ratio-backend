import { Router } from 'express';
import jwt from 'jsonwebtoken';
import checkAuth from "../middlewares/checkAuth.mjs";

const router = Router();

router.get("/refreshToken", checkAuth, async (req, res) => {
    console.log('Inside refreshToken route');
    const token = req.headers['authorization'];
    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ result: false, message: "No token provided" });
    }

    try {

        const payload = {
            _id: req.user.userId,
            phone_number: req.user.phoneNumber
        };

        console.log('Payload:', payload);

        const newToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: '1h' // token expires after every 1 hour and gets replaced by new token
        });

        console.log('New Token:', newToken);

        res.status(200).json({ result: true, message: "Token refreshed successfully", token: newToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: "Failed to refresh token" });
    }
});

export default router;
