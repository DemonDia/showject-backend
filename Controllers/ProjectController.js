const mongoose = require("mongoose");
const User = require("../Models/UserModel");
const Project = require("../Models/ProjectModel");
const fs = require("fs");

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
    currentUser = await User.findById(userId);
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

    // check if project pic is there
    if (!projectPicture) {
        projectPicture = "";
    } 

    // just add the project (defaults)
    const newProject = new Project({
        userId,
        projectName,
        projectDescription,
        status,
        projectPicture,
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
const getAllProjects = async (req, res) => {};

// 2) Get all projects of a specific user
// takes in userId via the body
const getAllUserProjects = async (req, res) => {};

// 3) Get project by Id
// takes in projectId by the body
const getProjectById = async (req, res) => {};

// =========================Update=========================
// 1) Edit project details (except for likes and comments)
// takes in updated project object and user id
const editProject = async (req, res) => {};

// 2) Like/Unlike a project
// takes in userId via the body
// checks if the user is already in the likes array
// if inside, remove user from the likes array
// if not inside, add user Id inside
const toggleLikes = async (req, res) => {};

// 3) Comment on a post
// takes in userId and comment via the body
const addComment = async (req, res) => {};

// =========================Delete=========================
// 1) Delete a project
const deleteProject = async (req, res) => {};

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
