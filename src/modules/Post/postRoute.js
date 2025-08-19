const { Router } = require("express");
const postController = require("./postController");
const authMiddleware = require("../../middlewares/auth");

const router = Router();

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
