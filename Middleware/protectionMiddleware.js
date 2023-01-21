const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel")
const protection = async (req, res, next) => {
    console.log(req.headers)
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
                message: "Unauthorised",
            });
        }
    } else {
        console.log("GG")
        return res.status(403).json({
            message: "Unauthorised",
        });
    }
};

module.exports = { protection };