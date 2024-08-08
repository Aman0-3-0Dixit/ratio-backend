import express from "express";
const router = express.Router();
import multer from "multer";
import checkAuth from '../middlewares/checkAuth.mjs';
import { parse } from 'path';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { generateUniqueFileName } from '../utils/utils.mjs';

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.post('/uploadPhotos', checkAuth, upload.array('image', 6), async (req, res) => {
    console.log('inside uploadPhotos route');
    console.log(req.user);
    console.log(req.body);
    console.log('SERVICE_ACCOUNT:', process.env.SERVICE_ACCOUNT);
    const config = JSON.parse(process.env.SERVICE_ACCOUNT);
    initializeApp(config);
    const storage = getStorage();
    try {
        console.log('inside try block');
        const userFolder = `Ratio/users/${req.user.userId}`;
        const fileUploadPromises = [];
       
        for (const file of req.files) {
            const fileName = parse(file.originalname).name;
            const uniqueFileName = generateUniqueFileName(fileName);
            const storageRef = ref(storage, `${userFolder}/${uniqueFileName}`);
            const metadata = {
                contentType: file.mimetype,
            };
            fileUploadPromises.push(uploadBytesResumable(storageRef, file.buffer, metadata));
        }

        const uploadResults = await Promise.all(fileUploadPromises);
        const downloadURLs = await Promise.all(uploadResults.map(result => getDownloadURL(result.ref)));

        return res.send({
            result: true,
            message: 'Successfully uploaded files to Firebase storage',
            image_urls: downloadURLs
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            result: false,
            message: error.message
        });
    }
});


export default router;