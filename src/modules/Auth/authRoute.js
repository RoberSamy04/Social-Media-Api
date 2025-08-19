const { Router } = require("express");
const authController = require("./authController");
const { protect } = require("../../middlewares/auth");

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.patch("/update-my-password", protect, authController.changeMyPassword);
router.post("/verify-email-otp", authController.verifyEmailOtp);
router.post("/forget-password", authController.requestPasswordReset);
router.post("/verify-password-otp", authController.verifyPasswordOtp);
router.patch("/reset-password", authController.passwordRest);

module.exports = router;
