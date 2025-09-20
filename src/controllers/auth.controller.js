const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function authRegister(req, res){
    const {userName, email, password} = req.body;

    const isUserAlreadyExist = await userModel.findOne({email});

    if(isUserAlreadyExist){
        return res.status(401).json({
            message: "This Email User Already Exist"
        })
    }

    const user = await userModel.create({
        userName,
        email,
        password: await bcrypt.hash(password,10)
    })

    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY);
    res.cookie("token", token, {
        httpOnly: true,       
        secure: false,    
        sameSite: "Strict"
    });

    res.status(201).json({
        message:"user register sucessfully",
        user: {
            email: user.email,
            userName: user.userName,
            password: user.password
        }
    })

}

async function authLogin(req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(401).json({
            message:"invalid email or password"
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.password);


    if(!isValidPassword){
        return res.status(401).json({
            message:"invalid email or password"
        })
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY);
    res.cookie("token",token, {
        httpOnly: true,       
        secure: false,    
        sameSite: "Strict"
    });

    res.status(200).json({
        message:"login sucessfully",
        user:{
            userName:user.userName,
            email: user.email,
            password: user.password,
            profileImage: user.profileImage
        }
    })
}

async function userActive(req,res){
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Not logged in" });

    try {
        const id = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.json({ id });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = {
    authRegister,
    authLogin,
    userActive
}