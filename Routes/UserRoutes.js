// ===========================express and router===========================
const express = require("express");
const router = express.Router();

// ===========================import routes===========================
const {
    createNewUser,
    getAllUsers,
    getCurrentUser,
    getUserById,
    deleteUser,
} = require("../Controllers/UserController");

// ===========================all routes===========================
// =========================Create=========================
// 1) Create new user
// unprotected route
router.post("/",createNewUser)

// =========================Read=========================
// 1) Get all users from database
// only for testing 
router.get("/",getAllUsers)

// 2) Get user by token
// protected route
router.get("/current",getCurrentUser)

// 3) Get user by Id
// unprotected route
router.get("/:userId",getUserById)
// =========================Update=========================

// =========================Delete=========================
// 1) Delete a project
router.delete("/:userId",deleteUser)

// ===========================routes===========================
module.exports = router;
