const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    //read the token from req cookies
    try{
    const {token} = req.cookies;
    if(!token){
        throw new Error("Token is not valid!!!!!");
    }

    const decodedObj = jwt.verify(token,"VISWA@ch$12323");

    const{id} = decodedObj;
    console.log(id);
    const user = await User.findById(id);
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();
}catch(err){
    res.status(400).send("ERROR: " + err.message);
}
};

module.exports = {
    userAuth,
};