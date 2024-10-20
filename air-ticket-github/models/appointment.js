const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    doctorUsername: { type: String, required: true },         // Doctor's username
    appointmentDate: { type: Date, required: true },          // Date of appointment
    appointmentTime: { type: String, required: true },        // Time of appointment
    problemDescription: { type: String, required: true },     // Description of the problem
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    consulted: { type: Boolean, default: false }               // New attribute for consultation status
});

// Create a model from the schema
const Appointment = mongoose.model("Appointment", appointmentSchema);

// Export the model
module.exports = Appointment;
