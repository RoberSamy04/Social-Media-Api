const userRoute = require("../modules/User/userRoute");
const authRoute = require("../modules/Auth/authRoute");
const commentRoute = require("../modules/Comment/commentRoute");
const postRoute = require("../modules/Post/postRoute");
const replyRoute = require("../modules/Reply/replyRoute");

const { Router } = require("express");

const router = Router();
router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/comments", commentRoute);
router.use("/posts", postRoute);
router.use("/replies", replyRoute);

module.exports = router;
