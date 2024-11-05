import express from 'express';
import * as profileLikesListController from "../controllers/profileLikesListController.mjs";

const router = express.Router();

router.get("/:id", profileLikesListController.profileLikesList);
router.get("/mutualLikes/:id", profileLikesListController.profileMutualLikesList);

export default router;