const jwt = require('jsonwebtoken');
const { ENV_VARS } =require("../config/envVars.js");

exports.generateTokenAndSetCookie = (userId, res) =>{
    const token = jwt.sign({userId}, ENV_VARS.JWT_SECRET, {expiresIn: "15d"});

    res.cookie("jwt-invoice-api", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,//15 days in milisecond
        httpOnly: true, //prevent XSS attacks (cross-site scripting attacks), make it not be accessed by js
        sameSite: "strict",//CSRF attacks cross-site request forgery attack
        secure: ENV_VARS.NODE_ENV !== "developmet"
    });

    return token;
} 

