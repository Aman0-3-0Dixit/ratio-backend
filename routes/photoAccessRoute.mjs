import express from "express";
const router = express.Router();
import checkAuth from '../middlewares/checkAuth.mjs';
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

router.get("/accessPhotos", checkAuth, async (req, res) => {
    try {
        const config = JSON.parse(process.env.SERVICE_ACCOUNT);
        initializeApp(config);
        const storage = getStorage();
        const folderPath = `/Ratio/users/${req.userId}`;
        const listRef = ref(storage, folderPath);

        const getDownloadUrls = async (items) => {
            return Promise.all(items.map(async (item) => await getDownloadURL(item)));
        };

        const { items } = await listAll(listRef);
        const downloadUrls = await getDownloadUrls(items);

        res.status(200).json({
            result: true,
            image_urls: downloadUrls
        });
    } catch (error) {
        return res.status(400).json({
            result: false,
            message: error.message
        });
    }
});

export default router;