const { Router } = require("express");
const userController = require("./userController");
const authMiddleware = require("../../middlewares/auth");

const router = Router();

router.patch("/update-me", authMiddleware.protect, userController.updateMe);
router.get("/me", authMiddleware.protect, userController.getMyProfile);

router
  .route("/")
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    userController.getAllUsers
  );
router
  .route("/:id")
  .get(userController.getUser)
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    userController.deleteUser
  );

module.exports = router;
