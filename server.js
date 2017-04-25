// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


// =============================================================
var customers = [{
  customerName: "Mal Reynolds",
  phoneNumber: "912-721-1111",
  customerEmail: "mal@firefly.com",
  mobileNumber: "912-721-1111",
}];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/add", function(req, res) {
  res.sendFile(path.join(__dirname, "reserve.html"));
});

// Search for Specific Character (or all characters) - provides JSON
app.get("/api/:characters?", function(req, res) {
  var chosen = req.params.characters;

  if (chosen) {
    console.log(chosen);

    for (var i = 0; i < characters.length; i++) {
      if (chosen === characters[i].routeName) {
       return res.json(characters[i]);
      }
    }
    return res.json(false);
  }
  return res.json(characters);
});

// Create New Customer - takes in JSON input
app.post("/api/new", function(req, res) {
  var newcustomer = req.body;
  newcustomer.routeName = newcustomer.name.replace(/\s+/g, "").toLowerCase();

  console.log(newcustomer);

  characters.push(newcustomer);

  res.json(newcustomer);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});