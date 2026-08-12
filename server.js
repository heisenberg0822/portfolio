const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to Local MongoDB Community Server
const MONGO_URI = 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully to Local Database'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Define Schema & Model for Call Requests
const callRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const CallRequest = mongoose.model('CallRequest', callRequestSchema);

// API Endpoint to handle form submissions from the portfolio
app.post('/api/request-call', async (req, res) => {
    try {
        const { name, mobile, comment } = req.body;
        const newRequest = new CallRequest({ name, mobile, comment });
        await newRequest.save();
        res.status(201).json({ success: true, message: 'Call request saved successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error while saving request.' });
    }
});

// API Endpoint to fetch all requests for the admin dashboard
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await CallRequest.find().sort({ date: -1 });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error while fetching requests.' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));