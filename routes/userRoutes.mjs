import express from 'express';
const router = express.Router();
import verifyToken from '../middlewares/checkAuth.mjs';
import * as userController from '../controllers/userController.mjs';
import {sendMessage,getUserConversations,getConversationMessages } from '../controllers/messageController.mjs';

router.post("/signup", async (req, res) => {
  console.log('inside signup route');
  try {
      const user = new User({
          _id: new mongoose.Types.ObjectId(),
          phoneNumber: req.body.phoneNumber
      });

      await user.save();

      const payload = {
          _id: user._id,
          phone_number: user.phoneNumber
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
      console.log(token);

      res.status(201).json({ result: true, message: "Signed up successfully", token: token });
  } catch (err) {
      console.log(err);
      res.status(500).json({ result: false, message: "Failed to sign up" });
  }
});


router.post("/login", async (req, res) => {
  User.findOne({ phoneNumber: req.body.phoneNumber })
  .then( user => {
    if(user){
        const payload = {
            _id: user._id,
            phone_number: user.phoneNumber
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ result: true, message: "Logged in successfully", token: token }); 
    }else{
      res.status(500).json({ result: false, message: "User not found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ result: false, message: "Failed to log in" });
  });
});




router.route("/").get(userController.getAllUsers);
router.get("/userInfo/:customIds", userController.getUserInfosById);
router.get("/getUserInfo/:customId", userController.getUserInfoById);
router.get("/getUserSettings/:customID", userController.getUserSettings);
router.get("/getPrefSettings/:customID", userController.getPrefSettings);


router.route("/welcomePageDetails").get(userController.getWelcomePageDetails);
router.route("/connectWith").patch(userController.connectWith);

router.route("/likedByOthers").get(userController.likedByOthers);
router.route("/likeAUser").post(userController.likeAUser);

router
  .route("/userPreferenceSettings")
  .post(userController.userPreferenceSettings);

router.patch("/updatePreferenceSettings/:customID", userController.updatePrefSettings);

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
router.post('/message/:userId',verifyToken, sendMessage);
// Route to get all Conversations of user. 
router.get('/conversations/:userId', getUserConversations);
// Route to retrieve messages for a conversation
router.get('/messages/:conversationId', getConversationMessages);

router.route("/createSettings").post(userController.createSettings);
router.route("/updateSettings").patch(userController.updateSettings);
router.route("/verifyMe").post(userController.verifyMe);

// router.route("reportUser").post(userController.reportUser);

export default router; // Export the router as the default export