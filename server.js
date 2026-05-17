const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize the Express application
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ahmedullah_db';

// Middleware
// Configure CORS to allow requests from any frontend origin (including local file:// and hosted sites)
app.use(cors({
    origin: '*', // You can replace '*' with your specific frontend URL when deploying
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
})); 
// Parse incoming JSON payloads in the request body
app.use(express.json()); 

// ==========================================
// MongoDB Connection & Schema
// ==========================================
mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB successfully!'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Define the Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create the Contact Model
const Contact = mongoose.model('Contact', contactSchema);

// ==========================================
// REST API Endpoints
// ==========================================

// 1. Health Check Endpoint
// Route: GET /health
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "H.Ahmedullah Server is running smoothly." 
    });
});

// 2. Contact Form Endpoint
// Route: POST /contact
app.post('/contact', async (req, res) => {
    // Extract fields from the request body
    const { name, email, message } = req.body;

    // Validation: Check if any of the required fields are missing
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: "All fields (name, email, and message) are required."
        });
    }

    try {
        // Create a new contact document
        const newContact = new Contact({
            name,
            email,
            message
        });

        // Save it to MongoDB
        await newContact.save();

        console.log(`✅ New message successfully saved to MongoDB from: ${name}`);

        // Send the requested success response back to the client
        res.status(200).json({
            success: true,
            message: "Message received successfully"
        });
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).json({
            success: false,
            error: "Failed to save message on the server."
        });
    }
});

// ==========================================
// Start the Server
// ==========================================
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 H.Ahmedullah Backend Server is running!`);
    console.log(`📡 Listening at: http://localhost:${PORT}`);
    console.log(`=========================================`);
});
