const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); // Add this
const connectDB = require("./config/database");
const { userAuth } = require("./middleware/auth");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const Appointment = require("./models/appointment");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// View Engine Setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Database connection established...");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.emailId, userType: user.userType }, 
    "VISWA@ch$12323", // Hardcoded secret key
    { expiresIn: "5h" }
  );
};

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/dashboard", userAuth, (req, res) => {
  res.render("dashboard");
});

app.get("/appointment", userAuth, (req, res) => {
  res.render("appointment");
});
app.get("/history", userAuth, (req, res) => {
  res.render("history");
});
app.get("/mypatients", userAuth, (req, res) => {
  res.render("mypatients");
});

// Register Route
app.post("/register", async (req, res) => {
  console.log("Register route called");
  try {
    const {
      userType,
      userName,
      emailId,
      password,
      firstName,
      lastName,
      gender,
      age,
      contact,
      address,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists. Please choose another." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      userType,
      userName,
      emailId,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
      age,
      contact,
      address,
    });
    
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    // Send token as a cookie or in the response
    res.cookie("token", token, { httpOnly: true }); // Optionally, secure: true in production with HTTPS
    res.status(201).json({ message: "Registration successful!", token }); // Also send token in the response body
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ message: "No user found. Please try again." });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid login credentials. Please try again." });
    }

    // Generate token
    const token = generateToken(user);

    // Send token as a cookie or in the response
    res.cookie("token", token, { httpOnly: true }); // Optionally, secure: true in production with HTTPS
    res.json({ message: "Login successful!", token }); // Also send token in the response body
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/bookappointment', userAuth, async (req, res) => {
  
  
  // Assuming userAuth middleware adds the user to req.user
  const patientId = req.user._id; // Get the patient ID from the authenticated user
  
  const { doctorUsername, appointmentDate, appointmentTime, problemDescription } = req.body;

  // Validate required fields
  if (!doctorUsername || !appointmentDate || !appointmentTime || !problemDescription) {
      return res.status(400).json({ message: "All fields are required." });
  }

  // Create and save the appointment
  try {
      const appointment = new Appointment({
          doctorUsername,
          problemDescription,
          appointmentDate,
          appointmentTime,
          patient: patientId, // Save the patient ID here
          consulted: false     // Default value for consulted attribute
      });

      await appointment.save();
      res.status(201).json({ message: "Appointment booked successfully!" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error booking appointment." });
  }
});





app.get('/getdoctors', async (req, res) => {
  try {
      // Fetch only the userName of doctors
      const doctors = await User.find({ userType: 'doctor' }, 'userName').lean(); // Changed 'username' to 'userName'

      // If doctors is empty, return an empty array
      if (!doctors.length) {
          return res.json([]);
      }

      // Send the array of usernames
      res.json(doctors); // This will now return objects with userName properties
  } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/getappointmenthistory', userAuth, async (req, res) => {
  try {
    const userId = req.user._id; // Extract the user ID from the authenticated user
    
    // Find all appointments for the user
    const userAppointments = await Appointment.find({ patient: userId }); // Use Appointment model here
    
    
    // Check if appointments were found
    if (userAppointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json({ appointments: userAppointments });
  } catch (error) {
    console.error("Error fetching appointment history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/unconsulted", userAuth, async (req, res) => {
  try {
    const doctorUsername = req.user.userName; // Get the doctor's username from the request token
    

    if (!doctorUsername) {
      return res.status(400).json({ error: "Doctor username is missing in the token." });
    }

    // Query the appointments collection to find unconsulted appointments for the doctor
    const appointments = await Appointment.find({ 
      doctorUsername: doctorUsername, 
      consulted: false 
    });

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No unconsulted appointments found for this doctor." });
    }

    // Use Promise.all to fetch patient details for each appointment
    const appointmentWithPatientDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const patient = await User.findById(appointment.patient); // Fetch patient details from the Users collection using patient ObjectId

        // Combine appointment details with patient details
        return {
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          problemDescription: appointment.problemDescription,
          patient: {
            _id: appointment._id,
            userName: patient.userName,
            emailId: patient.emailId,
            age: patient.age,
            gender: patient.gender,
            contactNumber: patient.contactNumber,
          }
        };
      })
    );

    // Send the final array of appointments with patient details
    res.json(appointmentWithPatientDetails);

  } catch (err) {
    console.error("Error fetching unconsulted appointments:", err);
    res.status(500).json({ error: "ERROR: " + err.message });
  }
});

app.post("/complete/:appointmentId", userAuth, async (req, res) => {
  const { appointmentId } = req.params;
  
  try {
      const appointment = await Appointment.findByIdAndUpdate(
          appointmentId,
          { consulted: true },
          { new: true }
      );
      
      if (!appointment) {
          return res.status(404).json({ message: "Appointment not found." });
      }

      res.json({ message: "Appointment marked as consulted!", appointment });
  } catch (err) {
      res.status(500).json({ error: "ERROR: " + err.message });
  }
});










// API Routes
app.use("/api/auth", require("./routes/auth"));

// 404 route
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running @ http://localhost:${PORT}`);
});
