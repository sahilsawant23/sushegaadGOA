const dotenv = require('dotenv');
// Trigger restart for env update 2
dotenv.config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
require('./db');
require('./scheduler');

app.use('/uploads', express.static('uploads')); // Serve uploaded files

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
