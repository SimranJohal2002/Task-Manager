CREATE DATABASE taskmanager;
USE taskmanager;
CREATE TABLE manager (id INT AUTO_INCREMENT PRIMARY KEY,taskname VARCHAR(100),taskdescription VARCHAR(100),dateadded DATETIME, datecompletion DATETIME);
CREATE TABLE userdetails (userid INT AUTO_INCREMENT PRIMARY KEY,username VARCHAR(100),firstname VARCHAR(100),lastname VARCHAR(100),email VARCHAR(100),hashedPassword VARCHAR(200));
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myBookshop.* TO 'appuser'@'localhost';