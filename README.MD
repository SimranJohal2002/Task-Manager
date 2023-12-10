INSTRUCTIONS ON HOW TO SET UP MY APPLICATION:

first clone the repository with:
git clone https://github.com/SimranJohal2002/Task-Manager.git

create the databases with the commands written in create_db.sql
I had to comment out some lines in create_db.sql because of an error, but you should still run these commands in mysql to create user privilages.

open my application with vs code.

Run index.js to start application.

IF SOMETHING IS WRONG WITH NODE MODULES:
- delete node_modules folder
-do "npm install" to reinstall modules
-do "npm install express-session"
-do "npm install express-validator"
-do "npm install express-sanitizer"


APPLICATION INSTRUCTIONS:
- To access the weather api and about page you must not be logged in, so logout if you are.
- You have to register then login to use the task manager page.
- An account you can login in with is "test" for username and "test" for password.
- After search something with the search bar, just empty the search bar then press search to resee the whole table