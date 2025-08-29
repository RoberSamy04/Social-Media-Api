const { Router } = require("express");
const likeController = require("../Like/likeController");
const Auth = require("../../middlewares/auth");
const router = Router();

router.use(Auth.protect);

router.post("/post/:postId", likeController.likePost);
router.post("/comment/:commentId", likeController.likeComment);
router.post("/reply/:replyId", likeController.likeReply);

router.delete("/post/:postId", likeController.unLikePost);
router.delete("/comment/:commentId", likeController.unLikeComment);
router.delete("/reply/:replyId", likeController.unLikeReply);

module.exports = router;
