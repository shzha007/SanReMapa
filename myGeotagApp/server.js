const express = require('express');
const { Pool } = require('pg');

// Create a new Express application
const app = express();
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Setup connection to PostGIS
const pool = new Pool({
  user: 'postgres',  // replace with your database username
  host: 'localhost',
  database: 'SanReMapa',  // replace with your database name
  password: 'allforgodsglory',  // replace with your database password
  port: 5432  // default port for PostgreSQL
});

// Handle POST requests to '/submit'
// app.post('/submit', async (req, res) => {
//   const { category, description } = req.body;
//   try {
//     const query = 'INSERT INTO test_database(category, description) VALUES($1, $2)';
//     await pool.query(query, [category, description]);
//     res.status(201).send("Data saved successfully.");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to save data.");
//   }
// });
app.post('/submit', async (req, res) => {
  const { category, description } = req.body;
  try {
      const query = 'INSERT INTO test_database(category, description) VALUES($1, $2)';
      await pool.query(query, [category, description]);
      res.status(201).json({ message: "Data saved successfully." });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save data." });
  }
});


// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
