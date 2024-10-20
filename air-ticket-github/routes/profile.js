const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const jwt = require('jsonwebtoken');
const User = require("../models/user");



profileRouter.get("/profile", userAuth,async (req, res) => {
    try{
        const cookies = req.cookies;

        const {token} = cookies;
        if(!token){
            throw new Error("Invalid Token");
        }
        const decodedMessage = await jwt.verify(token,"VISWA@ch$12323");
  

        const { _id } = decodedMessage;
    

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User does not exist");
        }
        res.send(user);

    }
     catch (err){
    res.status(400).send("ERROR:" +err.message);
}
});


module.exports = profileRouter;