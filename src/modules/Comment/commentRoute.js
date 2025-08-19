const { Router } = require("express");
const commentController = require("./commentController");
const authMiddleware = require("../../middlewares/auth");

const router = Router();

router
  .route("/:postId")
  .post(authMiddleware.protect, commentController.createComment)
  .get(commentController.getAllComments);

router
  .route("/:commentId")
  .patch(authMiddleware.protect, commentController.updateComment)
  .delete(authMiddleware.protect, commentController.deleteComment);

module.exports = router;
