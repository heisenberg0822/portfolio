const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection string configured via Render Environment Variables
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Schema for Help Desk Requests
const callRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const CallRequest = mongoose.model('CallRequest', callRequestSchema);

// Base route to verify server status
app.get('/', (req, res) => {
    res.send('Portfolio Backend Server is Running');
});

// API endpoint to submit help desk request (POST)
app.post('/api/request-call', async (req, res) => {
    try {
        const { name, mobile, comment } = req.body;
        const newRequest = new CallRequest({ name, mobile, comment });
        await newRequest.save();
        res.json({ success: true, message: 'Request saved successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// API endpoint to fetch requests for the admin dashboard (GET)
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await CallRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Delete a call request by ID
app.delete('/api/requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await CallRequest.findByIdAndDelete(id);
        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});