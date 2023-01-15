const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel")
const protection = async (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1]; //just the token
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user from token
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (err) {
            console.log(err);
            return res.status(403).json({
                success: false,
                message: "Unauthorised",
            });
        }
    } else {
        return res.status(403).json({
            success: false,
            message: "Unauthorised",
        });
    }
};

module.exports = { protection };