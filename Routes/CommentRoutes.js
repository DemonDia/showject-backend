// ===========================express and router===========================
const express = require("express");
const router = express.Router();
const { protection } = require("../Middleware/protectionMiddleware");
// ===========================import routes===========================
const CommentController = require("../Controllers/CommentController");

// ===========================all routes===========================
// =========================Create=========================
// add new comment
router.post("/", protection, CommentController.createComment);

// =========================Read=========================
// get all comments of specific post
router.get("/:projectId", CommentController.getProjectComments);

// =========================Update=========================
// update specific comment (by commentId)
router.put("/:commentId", protection, CommentController.updateComment);

// =========================Delete=========================
// delete specific comment (by commentId)
router.delete("/:commentId", protection, CommentController.deleteComment);

// ===========================routes===========================
module.exports = router;
