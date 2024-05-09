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

app.post('/submit', async (req, res) => {
  const { category, description, longitude, latitude } = req.body;
  try {
      const query = 'INSERT INTO test_database(category, description, longitude, latitude) VALUES($1, $2, $3, $4)';
      await pool.query(query, [category, description, longitude, latitude]);
      res.status(201).json({ message: "Data saved successfully." });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save data." });
  }
});

// app.post('/submit', async (req, res) => {
//   const { category, description, latitude, longitude } = req.body;
//   try {
//       const query = 'INSERT INTO test_database(category, description, location) VALUES($1, $2, ST_SetSRID(ST_Point($3, $4), 4326))';
//       await pool.query(query, [category, description, longitude, latitude]); // Note longitude comes first in ST_Point
//       res.status(201).json({ message: "Data saved successfully." });
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Failed to save data." });
//   }
// });


// adding this for github demo purposes

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));


// // Server-side: Node.js with Express
// app.get('/api/geotags', async (req, res) => {
//   try {
//       const query = 'SELECT category, description, latitude, longitude FROM test_database'; // Adjust based on your columns
//       const { rows } = await pool.query(query);
//       res.json(rows);
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Failed to fetch data." });
//   }
// });

