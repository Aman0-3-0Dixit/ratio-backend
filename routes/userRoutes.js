const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

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

router.route("/createSettings").post(userController.createSettings);
router.route("/updateSettings").patch(userController.updateSettings);
router.route("/verifyMe").post(userController.verifyMe);

// router.route("reportUser").post(userController.reportUser);

module.exports = router;
