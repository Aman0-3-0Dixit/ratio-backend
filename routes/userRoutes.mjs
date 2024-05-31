import express from 'express';
const router = express.Router();
import verifyToken from '../middlewares/checkAuth.mjs';
import * as userController from '../controllers/userController.mjs';
import {sendMessage,getUserConversations,getConversationMessages } from '../controllers/messageController.mjs';




router.route("/").get(userController.getAllUsers);

router.route("/welcomePageDetails").get(userController.getWelcomePageDetails);
router.route("/connectWith").patch(userController.connectWith);

router.route("/likedByOthers").get(userController.likedByOthers);
router.route("/likeAUser").post(userController.likeAUser);

router
  .route("/userPreferenceSettings")
  .post(userController.userPreferenceSettings);

router.route("/getUserProfile-1").get(userController.getUserProfile1);
router.route("/getUserProfile-2").get(userController.getUserProfile2);
router.route("/reportUser").post(userController.reportUser);

router
  .route("/createNoficationSettings")
  .post(userController.createNotificationSettings);
router
  .route("/updateNoficationSettings")
  .patch(userController.updateNotificationSettings);
// Route to send a message
router.post('/message/:userId', sendMessage);
// Route to get all Conversations of user. 
router.get('/conversations/:userId', getUserConversations);
// Route to retrieve messages for a conversation
router.get('/messages/:conversationId', getConversationMessages);

router.route("/createSettings").post(userController.createSettings);
router.route("/updateSettings").patch(userController.updateSettings);
router.route("/verifyMe").post(userController.verifyMe);

// router.route("reportUser").post(userController.reportUser);

export default router; // Export the router as the default export