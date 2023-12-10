module.exports = function (app, appData) {
    // Handle our routes
    app.get('/', function (req, res) {
      res.render('index.ejs', appData);
    });
    app.get('/about', function (req, res) {
      res.render('about.ejs', appData);
    });
    app.get('/register', function (req, res) {
      res.render('register.ejs', appData);
    });
  
    
    // Handle form submission
    app.get('/weather', function (req, res) {
      const request = require('request');
      const apiKey = '57a36a51c024c9497f9dee76346be4b8';
      const city = req.query.city || 'london'; // Use the provided city or default to 'london'
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
      request(url, function (err, response, body) {
        if (err) {
          console.log('error:', error);
          res.render('weather', { weatherData: 'Error fetching weather data.' });
        } else {
          const weather = JSON.parse(body);
          if (weather!==undefined && weather.main!==undefined) {
            const wmsg = `It is ${weather.main.temp} degrees in ${weather.name}! The humidity now is: ${weather.main.humidity}`;
            res.render('weather', { weatherData: wmsg });
          }
          else{
            wmsg = 'No data found!';
            res.render('weather', { weatherData: wmsg });
          }
        }
      });
    });
  
    app.get('/api', function (req,res) {
  
      // Query database to get all the books
      let sqlquery = "SELECT * FROM task"; 
  
      // Execute the sql query
      db.query(sqlquery, (err, result) => {
          if (err) {
              res.redirect('./');
          }
          // Return results as a JSON object
          res.json(result); 
      });
  });
  
  
    app.post('/registered', function (req, res) {
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
  
      const { first, last, email, username, password } = req.body;
      req.body.first = req.sanitize(first);
      req.body.last = req.sanitize(last);
      req.body.username = req.sanitize(username)
  
      bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
        if (err) {
          return res.status(500).send('Error hashing password');
        }
  
        let sqlquery =
          'INSERT INTO user (firstname, lastname, email, username, hashedPassword) VALUES (?, ?, ?, ?, ?)';
        let newrecord = [first, last, email, username, hashedPassword];
  
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Registration failed. Please try again.');
          }
  
          // Registration successful
          res.send(`
                  <p>Registration successful. Please <a href="/login">login</a>.</p>
              `);
        });
      });
    });
  
    app.post('/loggedin', function (req, res) {
      const bcrypt = require('bcrypt');
      const username = req.body.username;
      const password = req.body.password;
  
      let sqlquery = 'SELECT userid, hashedPassword FROM user WHERE username = ?';
  
      db.query(sqlquery, [username], (err, result) => {
        if (err) {
          return res.send('There was an error');
        }
  
        if (result.length === 0) {
          return res.send('Invalid username or password');
        }
  
        const hashedPassword = result[0].hashedPassword;
        const userId = result[0].userid;
  
        bcrypt.compare(password, hashedPassword, function (err, match) {
          if (err) {
            return res.send('There was an error');
          }
  
          if (match) {
            req.session.userId = userId;
  
            res.redirect('./taskmanager');
          } else {
            res.send('Invalid username or password');
          }
        });
      });
    });
  
    app.get('/login', function (req, res) {
      res.render('login.ejs', appData);
    });
  
    app.post('/taskadded', function (req, res) {
      if (!req.session.userId) {
        res.redirect('./login');
        return;
      }
  
      let userId = req.session.userId;
      let taskName = req.body.task;
      let taskDescription = req.body.taskdescription;
  
      let currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
      let sqlquery =
        'INSERT INTO task (taskname, taskdescription, dateadded, userid) VALUES (?, ?, ?, ?)';
      let newrecord = [taskName, taskDescription, currentDate, userId];
  
      db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
          console.error(err.message);
          res.redirect('./TaskManager');
        } else {
          res.redirect('./TaskManager');
        }
      });
    });
  
    app.get('/TaskManager', function (req, res) {
      if (!req.session.userId) {
        res.redirect('./login');
        return;
      }
  
      let userId = req.session.userId;
      let sqlquery = 'SELECT * FROM task WHERE userid = ?';
      db.query(sqlquery, [userId], (err, result) => {
        if (err) {
          console.error(err);
          res.redirect('./');
        } else {
          let newData = Object.assign({}, appData, { availableTasks: result });
          res.render('TaskManager.ejs', newData);
        }
      });
    });
  
    app.get('/search', function (req, res) {
      const searchQuery = req.query.query;
  
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const userId = req.session.userId;
  
      let sqlquery = `
      SELECT * FROM task
      WHERE userid = ? AND taskname LIKE ?`;
  
      let searchPattern = `%${searchQuery}%`;
  
      db.query(sqlquery, [userId, searchPattern], (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(result);
        }
      });
    });
  
    app.post('/logout', function (req, res) {
      // req.session.destroy(function (err) {
      //   if (err) {
      //     console.error('Error destroying session:', err);
      //   }
      //   res.json({ message: 'Logout successful' });
      // });
      req.session.destroy(err => {
        if (err) {
               return res.redirect('./')
      }
      res.json({ message: 'Logout successful' });
    })
    });
  };
