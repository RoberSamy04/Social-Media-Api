const { Router } = require("express");
const commentController = require("./commentController");
const authMiddleware = require("../../middlewares/auth");
const replyRouter = require("../Reply/replyRoute");

const router = Router({ mergeParams: true });

router.use("/:commentId/replies", replyRouter);

router
  .route("/")
  .post(authMiddleware.protect, commentController.createComment)
  .get(commentController.getAllComments);

router
  .route("/:commentId")
  .patch(authMiddleware.protect, commentController.updateComment)
  .delete(authMiddleware.protect, commentController.deleteComment);

module.exports = router;
