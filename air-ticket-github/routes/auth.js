const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { validateRegisterData } = require("../utils/validation");
const jwt = require("jsonwebtoken");

// Patient registration
router.post("/register/patient", async (req, res) => {
    try {
        validateRegisterData(req);

        const { userName, emailId, password, firstName, lastName, gender, age, contact, address } = req.body;

        const user = new User({
            userName,
            emailId,
            password,
            userType: "patient",
            firstName,
            lastName,
            gender,
            age,
            contact,
            address,
        });

        await user.save();
        res.send("Patient registered successfully");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// Doctor registration
router.post("/register/doctor", async (req, res) => {
    try {
        validateRegisterData(req);

        const { userName, emailId, password, firstName, lastName, gender, age, contact, address } = req.body;

        const user = new User({
            userName,
            emailId,
            password,
            userType: "doctor",
            firstName,
            lastName,
            gender,
            age,
            contact,
            address,
        });

        await user.save();
        res.send("Doctor registered successfully");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// Admin registration
router.post("/register/admin", async (req, res) => {
    try {
        validateRegisterData(req);

        const { userName, emailId, password, firstName, lastName, gender, age, contact, address } = req.body;

        const user = new User({
            userName,
            emailId,
            password,
            userType: "admin",
            firstName,
            lastName,
            address,
            gender,
            age,
            contact,
        });

        await user.save();
        res.send("Admin registered successfully");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// Login for all user types
router.post("/login", async (req, res) => {
    try {
        const { userType, emailId, password } = req.body;

        const user = await User.findOne({ emailId, userType });

        if (!user) {
            return res.status(400).send("ERROR: Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = user.getJWT(); // Generate the token
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Set to true if in production
                maxAge: 3600000, // 1 hour
            });
            res.json({ message: "Login successful!" });
        } else {
            return res.status(400).send("ERROR: Invalid credentials");
        }
    } catch (err) {
        res.status(500).send("ERROR: " + err.message);
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
    res.send("Logout successful");
});

module.exports = router;
