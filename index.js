var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const fs = require('fs');

const expressSanitizer = require('express-sanitizer');

const app = express();
const port = 8000;

app.use(expressSanitizer());

app.use(
  session({
    secret: 'testsecretkey',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'appuser',
  password: 'app2027',
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    throw err;
  }

  console.log('Connected to MySQL server');

  const createDatabaseScript = fs.readFileSync(
    __dirname + '/create_db.sql',
    'utf8'
  );

  db.query(createDatabaseScript, (err, results) => {
    if (err) {
      throw err;
    }

    console.log('Database and tables created successfully');

    db.changeUser({ database: 'taskmanager' }, (err) => {
      if (err) {
        throw err;
      }

      console.log('Connected to taskmanager database');

      app.set('views', __dirname + '/views');
      app.set('view engine', 'ejs');
      app.engine('html', ejs.renderFile);

      var appData = { appName: 'Task Manager' };
      require('./routes/main')(app, appData);

      app.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
      );
    });
  });
});

global.db = db;
