const User = require("../Models/UserModel");
const Project = require("../Models/ProjectModel");
const Comment = require("../Models/CommentModel");

// =========================Helper functions=========================
// =========================Create=========================
// add new comment
const createComment = async (req, res) => {
    const { projectId, userId, comment } = req.body;
    console.log({ projectId, userId, comment });
    try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
        const currentProject = await Project.findById(projectId);
        if (!currentProject) {
            return res.status(404).json({
                message: "Project does not exist",
            });
        }
        if (!comment || comment.length == 0) {
            return res.status(500).json({
                message: "Comment name cannot be empty.",
            });
        }
        const newComment = new Comment({
            commenterId: userId,
            projectId,
            comment,
            commentDate: new Date(),
        });
        await Comment.create(newComment)
            .then((result) => {
                return res.json({
                    message: "Added",
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: "Error",
                });
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error",
        });
    }
};

// =========================Read=========================
// get all comments of specific post
const getProjectComments = async (req, res) => {
    const { projectId } = req.params;
    try {
        const currentProject = await Project.findById(projectId);
        if (!currentProject) {
            return res.status(404).json({
                message: "Project does not exist",
            });
        }
        const allCommentPromise = await Comment.find({ projectId }).sort({
            commentDate: -1,
        });
        const getUsersPromise = await User.find();
        Promise.allSettled([allCommentPromise, getUsersPromise]).then(
            (results) => {
                const [commentRes, userRes] = results;
                var comments = commentRes.value;
                const users = userRes.value;

                var userDict = {};
                users.forEach((user) => {
                    const { name, _id } = user;
                    userDict[user._id] = { name, _id };
                });

                var commentList = [];
                comments.forEach((currComment) => {
                    const { comment, _id, commenterId, commentDate } =
                        currComment;
                    commentList.push({
                        comment,
                        _id,
                        commentDate,
                        commenter: userDict[commenterId],
                    });
                });
                return res.json(commentList);
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error",
        });
    }
};

// =========================Update=========================
// update specific comment (by commentId)
const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId, comment } = req.body;
    try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
        const currentComment = await Comment.findById(commentId);
        if (!currentComment) {
            return res.status(404).json({
                message: "Comment does not exist",
            });
        }
        if (userId != currentComment.commenterId) {
            return res.status(403).json({
                message: "Not authorised to comment",
            });
        }
        if (!comment || comment.length == 0) {
            return res.status(401).json({
                message: "Comment cannot be empty",
            });
        }
        await Comment.updateOne(
            {
                _id: currentComment._id,
            },
            { comment }
        )
            .then((result) => {
                return res.json({
                    message: "Updated",
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: "Error",
                });
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error",
        });
    }
};

// =========================Delete=========================
// delete specific comment (by commentId)
const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;
    try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
        const currentComment = await Comment.findById(commentId);
        if (!currentComment) {
            return res.status(404).json({
                message: "Comment does not exist",
            });
        }
        Comment.deleteOne(currentComment)
            .then(() => {
                res.status(200).json({
                    message: "Successfully deleted",
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: "Error",
                });
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error",
        });
    }
};

// =======module exports=======
module.exports = {
    createComment,
    getProjectComments,
    updateComment,
    deleteComment
};
