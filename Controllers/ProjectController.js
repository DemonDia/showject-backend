const User = require("../Models/UserModel");
const Project = require("../Models/ProjectModel");

// =========================Create=========================
// 1) Create new project
// takes in project object via the body
const createNewProject = async (req, res) => {};

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
