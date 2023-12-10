CREATE DATABASE IF NOT EXISTS taskmanager;
USE taskmanager;

CREATE TABLE IF NOT EXISTS user (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    email VARCHAR(100),
    hashedPassword VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskname VARCHAR(100),
    taskdescription VARCHAR(100),
    dateadded DATETIME,
    datecompletion DATETIME,
    userid INT,
    FOREIGN KEY (userid) REFERENCES user(userid)
);

CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON taskmanager.* TO 'appuser'@'localhost';