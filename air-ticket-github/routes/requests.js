const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async(req,res) =>{
    const user = req.user;
    console.log("sending a connection request");
    res.send(user.userName  +  "sent the connect request");

});
module.exports = requestRouter;