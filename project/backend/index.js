const dotenv = require('dotenv');
// Trigger restart for env update 12
dotenv.config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const routes = require('./routes');

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Database connection pool
require('./db');
require('./scheduler');

app.use('/uploads', express.static('uploads')); // Serve uploaded files

app.use('/api', routes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is healthy and running', timestamp: new Date() });
});

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
