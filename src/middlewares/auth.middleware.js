const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function Middlewares(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Authentication Error: token is not provided"
        })
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findOne({_id: decoded.id}).select("-password -__v");

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message:"Authentication Error: Invalid Token"
        })
    }
}

module.exports = Middlewares;