module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req, res) {
        //searching in the database
        //res.send("You searched for: " + req.query.keyword);

        let sqlquery = "SELECT * FROM books WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });        
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });                                                                                                 
    app.post('/registered', function (req,res) {
        const bcrypt  = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds,  function(err, hashedPassword){
            if(err){
                return console.error(err.message)
            }
            let sqlquery = "INSERT INTO userdetails (firstname,lastname,email,username,hashedPassword) VALUES (?,?,?,?,?)";
            let newrecord = [req.body.first,req.body.last,req.body.email,req.body.username,hashedPassword];

            db.query(sqlquery,newrecord, (err, result) => {
                if(err) {
                    return console.error(err, result);
                }
                else{
                    result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
                    result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                    res.send(result);

                }
        })
        }) 
        // saving data in database
        //res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                         
    }); 
    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });
    });

    app.get('/addbook', function (req, res) {
        res.render('addbook.ejs', shopData);
     });
 
     app.post('/bookadded', function (req,res) {
           // saving data in database
           let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
           // execute sql query
           let newrecord = [req.body.name, req.body.price];
           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else
             res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price);
             });
       });    

       app.get('/bargainbooks', function(req, res) {
        let sqlquery = "SELECT * FROM books WHERE price < 20";
        db.query(sqlquery, (err, result) => {
          if (err) {
             res.redirect('./');
          }
          let newData = Object.assign({}, shopData, {availableBooks:result});
          console.log(newData)
          res.render("bargains.ejs", newData)
        });
    });
    
        app.get('/list users', function(req, res){
            let sqlquery = "SELECT firstname, lastname, email, username, FROM userdetails";

            db.query(sqlquery, (err, result) => {
                if(err){
                    res.redirect('./');
                }
                let newData = Object.assign({}, shopData, {availableusers:result});
                console.log(newData)
                res.render("listusers.ejs", newData)
            });
        });

        app.post("/loggedin", function(req,res){
            const bcrypt = require("bcrypt")                  
            let sqlquery = 'SELECT hashedPassword FROM userdetails WHERE username = "' + req.body.username +'"';

            db.query(sqlquery, (err, result) => {
                if(err){
                    res.send("there was an error")
                }
                else{
                    hashedPassword = result[0].hashedPassword;
                    console.log(hashedPassword)
                    console.log(req.body.password)
                    console.log(result)
                    bcrypt.compare(req.body.password, hashedPassword, function(err, result){
                        if(err){
                            res.send("there was an error")
                        }
                        else if(result == true){
                            res.send("That is the correct Password")
                        }
                        else{
                            res.send("That is the wrong password")
                        }
                    });
                }
            
            });
        })

        app.get("/login", function(req, res){
            res.render("login.ejs", shopData);
        })

}
