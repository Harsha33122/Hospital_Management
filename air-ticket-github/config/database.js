const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect(
        "mongodb://localhost:27017/HM-Backend"

    );
};
module.exports = connectDB;