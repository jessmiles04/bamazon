var mysql = require('mysql');
var prompt = require('prompt');
//alledgedly this is the npm packet that creates the table in the console
var Table = require('cli-table');
//creates a connection with the bamazon database (ask how to hide password)
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'bamazon',
	password: 'asdflkj12@!!! ',
	database: 'bamazon', 
});

//Product sales by department--I tried to create the necessary database part and customer part when I did the bamazoncustomer part. (This is what kind of broke it)
//database has been created-- Note to self, do NOT try to merge easy and hard tasks together to save time, you clearly did not really get what you were doing.