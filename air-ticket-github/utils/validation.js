const validator = require('validator');

const validateRegisterData = (req) => {
    const { userName, emailId, password, firstName, lastName, gender, age, contact, address, userType } = req.body;

    // User Type Validation
    if (!userType || !["patient", "doctor", "admin"].includes(userType)) {
        throw new Error("User type is required and must be 'admin', 'doctor', or 'patient'!");
    }

    // User Name Validation
    if (!userName) {
        throw new Error("Name is required!");
    }

    // Email Validation
    if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    }

    // Password Validation
    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong Password!");
    }

    // First Name Validation
    if (!firstName) {
        throw new Error("First name is required!");
    }

    // Last Name Validation
    if (!lastName) {
        throw new Error("Last name is required!");
    }

    // Gender Validation
    if (!gender || !["male", "female", "other"].includes(gender)) {
        throw new Error("Gender is required and must be 'male', 'female', or 'other'!");
    }

    // Age Validation
    if (!age || age <= 0) {
        throw new Error("Age is required and must be a positive number!");
    }

    // Contact Validation
    if (!contact || contact.toString().length !== 10) {
        throw new Error("Contact number should be 10 digits!");
    }

    // Address Validation
    if (!address) {
        throw new Error("Address is required!");
    }
};

module.exports = {
    validateRegisterData,
};
