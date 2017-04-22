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

var inventoryUpdate = [];
var addedProduct = [];

connection.connect();

//creates list of tasks for manager
var managerTasks = {
    properties:{
        mOptions:{
            description: ('Key in one of the following options: 1) View Products for Sale 2) View Low Inventory 3) Add to Inventory 4) Add New Product')
        },
    },
};

prompt.start();
//displays options, user must type number for selection
prompt.get(managerTasks, function(err, res){
    if(res.mOptions == 1){
        currentProducts();
    } else if(res.mOptions == 2){
        inventory();
    } else if(res.mOptions == 3){
        addInventory();
    } else if(res.mOptions ==4){
        addNewProduct();
    } else {
        console.log('INVALID SELECTION.');
        connection.end();
    }
});

//shows table for #1
var currentProducts = function(){
    //pulls information from database for table
    connection.query('SELECT * FROM Products', function(err, res){
        console.log('');
        console.log('Products for Sale')
        console.log('');    

        //table
        var table = new Table({
            head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
            style: {
                head: ['red'],
                compact: false,
                colAligns: ['center'],
            }
        });

        //loops through for the full table
        for(var i=0; i<res.length; i++){
            table.push(
                [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
            );
        }

        //table display
        console.log(table.toString());
        connection.end();
    })
};

//function for low inventory
var inventory = function(){

    //hopefully will flag items with less than 3 available
    connection.query('SELECT * FROM Products WHERE StockQuantity < 3', function(err, res){
        console.log('');
        console.log('Items With Low Inventory');
        console.log('');

        var table = new Table({
            head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
            style: {
                head: ['red'],
                compact: false,
                colAligns: ['center'],
            }
        });

        //DO NOT DELETE AGAIN, for the love of all that is holy this is what makes it pull everything for stock information
        for(var i=0; i<res.length; i++){
            table.push(
                [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
            );
        }

        console.log(table.toString());
        connection.end();
    })
};

//function for adding inventory
var addInventory = function(){
    //variable for adding more inventory
    var addInvt = {
        properties:{
            inventoryID: {
                description: ('What is the ID number of the product you want to add inventory for?')
            },
            inventoryAmount:{
                description: ('How many items do you want to add to the inventory?')
            }
        },
    };

    prompt.start();

    //gets information from above
    prompt.get(addInvt, function(err, res){

        //creates a variable for the answers to the prompt questions
        var invtAdded = {
            inventoryAmount: res.inventoryAmount,
            inventoryID: res.inventoryID,
        }

        //pushes inventory to original stuff
        inventoryUpdate.push(invtAdded);

        //adds new stock quantity
        connection.query("UPDATE Products SET StockQuantity = (StockQuantity + ?) WHERE ItemID = ?;", [inventoryUpdate[0].inventoryAmount, inventoryUpdate[0].inventoryID], function(err, result){

            if(err) console.log('error '+ err);

            connection.query("SELECT * FROM Products WHERE ItemID = ?", inventoryUpdate[0].inventoryID, function(error, resOne){
                console.log('');
                console.log('You now have ' + resOne[0].StockQuantity + ' of product # ' + inventoryUpdate[0].inventoryID);
                console.log('');
                connection.end();
            })

        })
    })
};

//function for new product
var addNewProduct = function(){
    //Variable for new product with prompts for user
    var newProduct = {
        properties: {
            newIdNum:{ description: ('Please enter items 5 digit product # ')},
            newItemName:{ description: ('Please enter the name of the product you are adding ' )},
            newItemDepartment: { description: ('Please enter the department name ')},
            newItemPrice: { description: ('Please enter the price of the item ')},
            newStockQuantity: { description: ('Please enter a stock quantity for this item ')},
        }
    }

    prompt.start();

    //from the above prompt, this grabs the info for the new product
  prompt.get(newProduct, function(err, res){

        //hopefully creates a variable for new item data
        var newItem = {
            newIdNum: res.newIdNum,
            newItemName: res. newItemName,
            newItemDepartment: res.newItemDepartment,
            newItemPrice: res.newItemPrice,
            newStockQuantity: res.newStockQuantity,

        };

        //adds new item to array
        addedProduct.push(newItem);

        //connects to mysql and appends information to database
        connection.query('INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?, ?, ?, ?);', [addedProduct[0].newIdNum, addedProduct[0].newItemName, addedProduct[0].newItemDepartment, addedProduct[0].newItemPrice, addedProduct[0].newStockQuantity], function(err, result){

            if(err) console.log('Error: ' + err);

            console.log('New item successfully added to the inventory!');
            console.log(' ');
            console.log('Item id#: ' + addedProduct[0].newIdNum);
            console.log('Item name: ' + addedProduct[0].newItemName);
            console.log('Department: ' + addedProduct[0].newItemDepartment);
            console.log('Price: $' + addedProduct[0].newItemPrice);
            console.log('Stock Quantity: ' + addedProduct[0].newStockQuantity);

            connection.end();
        })
    })
};


