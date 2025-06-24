const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controller/commentController");
const { isLoggedIn } = require("../middleware/authentication");

// Update comment
commentRouter.put(
  "/:playerId/comment/:commentId",
  isLoggedIn,
  commentController.updateComment
);
commentRouter.delete(
  "/:playerId/comment/:commentId",
  isLoggedIn,
  commentController.deleteComment
);
module.exports = commentRouter;
