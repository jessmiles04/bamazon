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

var productPurchased = [];

connection.connect();

//pulls information from database into table...IT WORKS!
connection.query('SELECT ItemID, ProductName, Price FROM Products', function(err, result){
	if(err) console.log(err);

	//makes pretty table 
	var table = new Table({
		head: ['Item Number', 'Product Name', 'Price'],
		style: {
            //color of headings
			head: ['red'],
			compact: false,
            //alignment of information
			colAligns: ['center'],
		}
	});

	//loops through stuff in database to create table (THIS IS IMPORTANT! If it goes missing, your table displays nothing!)
	for(var i = 0; i < result.length; i++){
		table.push(
			[result[i].ItemID, result[i].ProductName, result[i].Price]
		);
	}
	console.log(table.toString());

	buy();
});

//time to make it so that the stuff can be purchased
var buy = function(){

	//okay, saw this format online, let's see if it works.
	var productInfo = {
		properties: {
			itemID:{description: ('Please enter the ID number of the item you want')},
			Quantity:{description: ('Please enter the amount that you want')}
		},
	};

	prompt.start();

	//gets the responses to the prompts above
	prompt.get(productInfo, function(err, res){

		//item selected
		var custPurchase = {
			itemID: res.itemID,
			Quantity: res.Quantity
		};
		
		//push to an array for what was selected
		productPurchased.push(custPurchase);

		//connects to the mysql database and selects the item the user selected above based on the item id number entered
		connection.query('SELECT * FROM Products WHERE ItemID=?', productPurchased[0].itemID, function(err, res){
				if(err) console.log(err, "That item ID doesn't exist");
				
				//hopefully will display if there is no product
				if(res[0].StockQuantity < productPurchased[0].Quantity){
					console.log("Out of Stock");
					connection.end();

				//hopefully this is will subtract from database
				} else if(res[0].StockQuantity >= productPurchased[0].Quantity){

					console.log('');

					console.log(productPurchased[0].Quantity + ' items purchased');

					console.log(res[0].ProductName + ' ' + res[0].Price);

					//this creates the variable SaleTotal that contains the total amount the user is paying for this total puchase
					var total = res[0].Price * productPurchased[0].Quantity;

					//This should send the information to the department table
					connection.query("UPDATE Departments SET TotalSales = ? WHERE DepartmentName = ?;", [total, res[0].DepartmentName], function(err, resultOne){
						if(err) console.log('error: ' + err);
						return resultOne;
					})

					console.log('Total: ' + total);

					//variable for the new quantity of item
					newQuantity = res[0].StockQuantity - productPurchased[0].Quantity;
			
	
					connection.query("UPDATE Products SET StockQuantity = " + newQuantity +" WHERE ItemID = " + productPurchased[0].itemID, function(err, res){

						console.log('');
						console.log('Thank you for your order!');
						console.log('');

						connection.end();
					})

				};

		})
	})

};
