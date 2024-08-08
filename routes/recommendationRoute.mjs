import express from 'express';
const router = express.Router();
import * as recommendationController from "../controllers/recommendationController.mjs"; 
import verifyToken from "../middlewares/checkAuth.mjs";

router.post("/", verifyToken, recommendationController.recommendedProfiles);

export default router;