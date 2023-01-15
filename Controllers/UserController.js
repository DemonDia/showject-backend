const User = require("../Models/UserModel");
const Project = require("../Models/ProjectModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// =========================Helper functions=========================
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
const verifyToken = async (token) => {
    console.log(token);
    if (token) {
        try {
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user from token
            currUser = await User.findById(decoded.id).select("-password");
            if (currUser) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    } else {
        return false;
    }
};

// =========================Create=========================
// 1) Create new user
// takes in user object via the body
const createNewUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill up all fields",
        });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(500).json({
            message: "User exists",
        });
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,

            activated: true,
        });
        await User.create(newUser)
            .then(async (result) => {
                return res.status(200).json({
                    message: "Registration successful",
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: err,
                });
            });
    }
};

// 2) Login user
// takes in user email and password and logs in the user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Please fill up the fields",
        });
    }
    const user = await User.findOne({ email });
    if (user) {
        if (!user.activated) {
            return res.status(500).json({
                message: "Please activate your account!",
            });
        } else {
            if (await bcrypt.compare(password, user.password)) {
                return res.status(200).json({
                    message: "Login successful",
                    token: generateJWT(user._id),
                });
            } else {
                res.status(500).json({
                    message: "Invalid pasword",
                });
            }
        }
    } else {
        res.status(500).json({
            message: "Invalid user",
        });
    }
};

// =========================Read=========================
// 1) Get all users from database
const getAllUsers = async (req, res) => {
    try{
        await User.find()
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
    }
    catch(err){
        return res.status(500).json({
            message: err,
        });
    }
};

// 2) Get user by token
// takes in JWT from body
const getCurrentUser = async (req, res) => {
    if (!req.user) {
        return res.status(500).json({
            message: "Invalid user",
        });
    } else if (req.user.id.length != 24) {
        return res.status(400).json({
            message: "Invalid ID",
        });
    } else {
        const { _id: id, name, email } = await User.findById(req.user.id);
        // check token
        return res.status(200).json({
            id,
            name,
            email,
        });
    }
};

// 3) Get user by Id
// takes in user Id from body
const getUserById = async (req, res) => {
    const { userId } = req.params;
    user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    } 
    return res.status(200).json({
        user
    })
    
};

// =========================Update=========================

// =========================Delete=========================
// 1) Delete a user
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    currUser = await User.findById(userId);
    if (!currUser) {
        return res.status(404).json({
            message: "User not found",
        });
    } else {
        await Project.deleteMany({ userId });
        await User.deleteOne(currUser)
            .then((deleteResult) => {
                console.log(deleteResult);
                return res.status(200).json({
                    message: "User deleted",
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: err,
                });
            });
    }
};

// =======module exports=======
module.exports = {
    createNewUser,
    loginUser,
    getAllUsers,
    getCurrentUser,
    getUserById,
    deleteUser,
};
