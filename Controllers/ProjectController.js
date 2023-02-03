const User = require("../Models/UserModel");
const Project = require("../Models/ProjectModel");
const uniqid = require("uniqid");
const cloudinary = require("cloudinary");
// =========================Helper functions=========================

// =========================Create=========================
// 1) Create new project
// takes in project object via the body
const createNewProject = async (req, res) => {
    const {
        userId,
        projectName,
        projectDescription,
        projectPicture,
        projectLinks,
        status,
    } = req.body;
    // check if user exists
    const currentUser = await User.findById(userId);
    if (!currentUser) {
        return res.status(404).json({
            message: "User does not exist",
        });
    }
    // check for name and description limit
    // name cannot 30 char
    // description cannot exceed 300 char
    // status cannot be empty
    if (!projectName || projectName.length > 30) {
        return res.status(500).json({
            message:
                "Project name cannot be empty and cannot exceed 30 characters",
        });
    }
    if (!projectDescription || projectDescription.length > 30) {
        return res.status(500).json({
            message:
                "Project description cannot be empty and cannot exceed 300 characters",
        });
    }

    // check status
    if (status == null || status < 0 || status > 2) {
        return res.status(500).json({
            message: "Invalid status",
        });
    }
    // add cloudinary

    var newImage = {
        public_id: "",
        url: "",
    };
    if (projectPicture) {
        const uploadedImage = await cloudinary.v2.uploader.upload(projectPicture, {
            folder: "showjects",
        });
        const { public_id: pictureId, url: url } = uploadedImage;
        newImage = {
            pictureId,
            url,
        };
    }

    // just add the project (defaults)
    const newProject = new Project({
        userId,
        projectName,
        projectDescription,
        status,
        projectPicture: newImage,
        projectLinks,
        likes: [],
        comments: [],
    });
    await Project.create(newProject).then((result) => {
        return res.status(200).json({
            message: "Project successfully uploaded",
            data: newProject._id,
        });
    });
};

// =========================Read=========================
// 1) Get all projects from database
const getAllProjects = async (req, res) => {
    try {
        await Project.find()
            .then((result) => {
                return res.status(200).json({
                    data: result,
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: err,
                });
            });
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};

// 2) Get all projects of a specific user
// takes in userId via the body
const getAllUserProjects = async (req, res) => {
    const { userId } = req.params;
    console.log("userId", userId);
    try {
        currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
        await Project.find({ userId })
            .then((result) => {
                return res.status(200).json({
                    data: result,
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: err,
                });
            });
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};

// 3) Get project by Id
// takes in projectId by the body
const getProjectById = async (req, res) => {
    const { projectId } = req.params;
    try {
        await Project.findById(projectId)
            // find({ userId })
            .then((result) => {
                return res.status(200).json({
                    data: result,
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: err,
                });
            });
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};

// =========================Update=========================
// 1) Edit project details (except for likes and comments)
// takes in updated project object and user id
const editProject = async (req, res) => {
    const { body, params } = req;
    const {
        userId,
        projectName,
        projectDescription,
        projectPicture,
        projectLinks,
        status,
        previousImageId,
    } = body;
    const { projectid: projectId } = params;
    try {
        // check if user exists
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }

        // check if project exists
        const currentProject = await Project.findById(projectId);
        if (!currentProject) {
            return res.status(404).json({
                message: "Project does not exist",
            });
        }

        // check for name and description limit
        // name cannot 30 char
        // description cannot exceed 300 char
        // status cannot be empty
        if (!projectName || projectName.length > 30) {
            return res.status(500).json({
                message:
                    "Project name cannot be empty and cannot exceed 30 characters",
            });
        }
        if (!projectDescription || projectDescription.length > 30) {
            return res.status(500).json({
                message:
                    "Project description cannot be empty and cannot exceed 300 characters",
            });
        }

        // check status
        if (status == null || status < 0 || status > 2) {
            return res.status(500).json({
                message: "Invalid status",
            });
        }

        if (previousImageId) {
            await cloudinary.uploader.destroy(previousImageId);
        }

        // add cloudinary (new pic)
        var updatedImage = {
            pictureId: "",
            url: "",
        };
        if (projectPicture) {
            const uploadedImage = await cloudinary.v2.uploader.upload(
                projectPicture,
                {
                    folder: "showjects",
                }
            );

            const { public_id: pictureId, url: url } = uploadedImage;
            updatedImage = {
                pictureId,
                url,
            };
        }

        // just add the project (defaults)
        const updatedProjectDetail = {
            projectName,
            projectDescription,
            status,
            projectPicture: updatedImage,
            projectLinks,
        };
        await Project.updateOne(
            {
                _id: currentProject.id,
            },
            updatedProjectDetail
        ).then((result) => {
            return res.status(200).json({
                message: "Project successfully updated",
            });
        });
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};

// 2) Like/Unlike a project
// takes in userId and projectId via the body
// checks if the user is already in the likes array
// if inside, remove user from the likes array
// if not inside, add user Id inside
const toggleLikes = async (req, res) => {
    const { body, params } = req;
    const { userId } = body;
    const { projectid: projectId } = params;

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
        const { likes } = currentProject;
        if (likes.includes(userId)) {
            currentProject.likes = likes.filter((likedUserId) => {
                return likedUserId != userId;
            });
        } else {
            currentProject.likes.push(userId);
        }
        currentProject.save();
        return res.status(200).json({
            message: "Successfully updated",
        });
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};

// 3) Comment on a post
// check if use and project exist
// takes in userId and comment via the body
const addComment = async (req, res) => {
    const { userName, userId, comment, projectId } = req.body;

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

        if (!comment) {
            return res.status(500).json({
                message: "Comment cannot be empty",
            });
        }

        const newComment = {
            commentId: uniqid(),
            commenterId: userId,
            commenterName: userName,
            commentContent: comment,
            commentDate: new Date(),
        };
        currentProject.comments.push(newComment);
        currentProject.save();
        return res.status(200).json({
            message: "Successfully updated",
        });
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};

// =========================Delete=========================
// 1) Delete a project
const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const currentProject = await Project.findById(projectId);
        if (!currentProject) {
            return res.status(404).json({
                message: "Project does not exist",
            });
        }

        if (currentProject.projectPicture.pictureId) {
            await cloudinary.uploader.destroy(currentProject.projectPicture.pictureId);
        }
        
        Project.deleteOne(currentProject)
            .then(() => {
                res.status(200).json({
                    message: "Successfully deleted",
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    message: err,
                });
            });
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};

// =======module exports=======
module.exports = {
    createNewProject,
    getAllProjects,
    getAllUserProjects,
    getProjectById,
    editProject,
    toggleLikes,
    addComment,
    deleteProject,
};
