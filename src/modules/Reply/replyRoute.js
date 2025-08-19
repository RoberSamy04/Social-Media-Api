const { Router } = require("express");
const replyController = require("./replyController");
const authMiddleware = require("../../middlewares/auth");

const router = Router();

router
  .route("/:commentId")
  .post(authMiddleware.protect, replyController.createReply)
  .get(replyController.getAllReplies);

router
  .route("/:replyId")
  .patch(authMiddleware.protect, replyController.updateReply)
  .delete(authMiddleware.protect, replyController.deleteReply);

module.exports = router;
