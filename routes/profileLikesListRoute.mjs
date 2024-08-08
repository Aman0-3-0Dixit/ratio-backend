import express from 'express';
import * as profileLikesListController from "../controllers/profileLikesListController.mjs";

const router = express.Router();

router.get("/:id", profileLikesListController.profileLikesList);

export default router;