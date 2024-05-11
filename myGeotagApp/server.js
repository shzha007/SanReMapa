const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const fs = require('fs');
const path = require('path');



// Create a new Express application
const app = express();
const cors = require('cors');
app.use(cors());


// Middleware to parse JSON bodies
app.use(express.json());
// Serve images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



//for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the directory exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    cb(null, `${Date.now()}-${safeFileName}`);
  }
});

const upload = multer({ storage: storage });


// Setup connection to PostGIS
const pool = new Pool({
  user: 'postgres',  // replace with your database username
  host: 'localhost',
  database: 'SanReMapa',  // replace with your database name
  password: 'allforgodsglory',  // replace with your database password
  port: 5432  // default port for PostgreSQL
});

app.post('/submit', upload.single('photo'), async (req, res) => {
  const { category, description, latitude, longitude } = req.body;
  const file = req.file;
  
  if (!file) {
      return res.status(400).send('No photo uploaded.');
  }
  
  const imageData = fs.readFileSync(file.path);

  try {
      const query = `
      INSERT INTO test_database (category, description, location, images)
      VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5)
      `;
      await pool.query(query, [category, description, longitude, latitude, imageData]);
      fs.unlinkSync(file.path); // Remove the file after saving to the database
      res.status(201).json({ message: "Data saved successfully." });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save data." });
  }
});



// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));


// // Server-side: Node.js with Express
app.get('/api/geotags', async (req, res) => {
  try {
      const query = 'SELECT id, category, description, ST_AsGeoJSON(location) AS location, images FROM test_database';
      const { rows } = await pool.query(query);
      res.json(rows.map(row => ({
          ...row,
          location: JSON.parse(row.location) // Convert GeoJSON string back to object
      })));
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch data." });
  }
});



