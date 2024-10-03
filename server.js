// importing the dependencies
const express = require('express');
const app = express();

const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// creating a connection

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// testing the connection
db.connect((err) => {
  if (err) {
    return console.log('Error connecting to database', err);
  }
  // connection successful
  console.log('Database connected successfully');
});

// ejs configuration
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/views/data.ejs', (req, res) => {
  // retrieve data from Mysql
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving data');
    } else {
      // display results
      res.render('data/patient', { results: results });
    }
  });
});

// To get patients records
app.get('/get-patients', (req, res) => {
  const getPatients = 'SELECT * FROM patients';
  db.query(getPatients, (err, results) => {
    // Throw error
    if (err) {
      return res.status(500).send('Failed to retrieve patients data');
    }
    // retrieved data
    res.status(200).send(results);
  });
});

//N0.2 To retrieve providers data
app.get('/get-providers', (req, res) => {
  const getProviders = 'SELECT * FROM providers';
  db.query(getProviders, (err, results) => {
    // Throw error
    if (err) {
      return res.status(500).send('Failed to retrieve providers data');
    }
    // retrieved data
    res.status(200).send(results);
  });
});

// To Filter patients by First name
app.get('/patients', (req, res) => {
  const firstName = req.query.first_name;
  
  if (!firstName) {
      return res.status(400).send('First name is required');
  }
  
  const query = `SELECT * FROM patients WHERE first_name = ?`;
  
  db.query(query, [firstName], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      
      if (results.length === 0) {
          return res.status(400).send('No patients found with the given first name');
      }
      
      res.json(results);
  });
});

// GET endpoint to retrieve providers by specialty
app.get('/providers', (req, res) => {
  const specialty = req.query.specialty;
  
  if (!specialty) {
      return res.status(500).send('Specialty is required');
  }
  
  const query = `SELECT * FROM providers WHERE specialty = ?`;
  
  db.query(query, [specialty], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      
      if (results.length === 0) {
          return res.status(500).send('No providers found with the given specialty');
      }
      
      res.status(200).send(results);;
  });
});



// to listen to the server port
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost: ${PORT}`);
});
