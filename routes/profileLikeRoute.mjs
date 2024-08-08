import express from 'express';
const router = express.Router();
import * as profileLikeController from "../controllers/profileLikeController.mjs"; 

router.post("/", profileLikeController.profileLike);

export default router;