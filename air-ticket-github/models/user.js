const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    userName: String,
    emailId: { type: String, unique: true },
    password: String,
    userType: String,
    firstName: String,
    lastName: String,
    gender: String,
    age: Number,
    contact: String,
    address: String,
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to validate password
userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate JWT
userSchema.methods.getJWT = function() {
    return jwt.sign({ id: this._id, userType: this.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const User = mongoose.model("user", userSchema);
module.exports = User;
