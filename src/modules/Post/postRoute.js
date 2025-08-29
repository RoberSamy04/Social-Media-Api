const { Router } = require("express");
const postController = require("./postController");
const authMiddleware = require("../../middlewares/auth");
const commentRouter = require("../Comment/commentRoute");

const router = Router();

router.use("/:postId/comments", commentRouter);

router
  .route("/")
  .post(authMiddleware.protect, postController.createPost)
  .get(postController.getAllPosts);

router
  .route("/:id")
  .patch(authMiddleware.protect, postController.updatePost)
  .get(postController.getPost)
  .delete(authMiddleware.protect, postController.deletePost);

module.exports = router;
