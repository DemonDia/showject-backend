const User = require("../Models/UserModel");

// =========================Create=========================
// 1) Create new user
// takes in user object via the body
const createNewUser = async (req, res) => {};

// =========================Read=========================
// 1) Get all users from database
const getAllUsers = async (req, res) => {};

// 2) Get user by token
// takes in JWT from body
const getCurrentUser = async (req, res) => {};

// 3) Get user by Id
// takes in user Id from body
const getUserById = async (req, res) => {};

// =========================Update=========================

// =========================Delete=========================
// 1) Delete a user
const deleteUser = async (req, res) => {};


// =======module exports=======
module.exports = {
    createNewUser,
    getAllUsers,
    getCurrentUser,
    getUserById,
    deleteUser,
};
