
// * Create a new Node application called `bamazonManager.js`. Running this application will:

// * List a set of menu options:

//   * View Products for Sale

//   * View Low Inventory

//   * Add to Inventory

//   * Add New Product

// * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

// * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

// * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

// * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.


// Imports packages needed to build app
require("dotenv").config();
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table3');

// Create connection to MySQL database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.DB_PASS,
    database: "bamazon"
});

// empty array to hold product choices for when user wnats to add new inventory they can choose from this list
var productChoices = [];

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    // function to execute after connecting to the database
    displayMenu();

});

// push list of products into the productChoices array
connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {

        productChoices.push(res[i].item_id);

    };

});

// display the list of commands when app loads
function displayMenu() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Products",
                "Exit"]
        }
    ]).then(function (answer) {
        // switch case to dictate which function to execute depending on which command the user picks
        switch (answer.action) {
            case "View Products for Sale":
                displayProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Products":
                addNew();
                break;
            case "Exit":
                console.log("See you next time boss");
                connection.end();
                break;
            default:
                break;
        }
    });
};

// displays items available in the store if user chooses this command
function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log("Here are the items available for sale: ");

        displayTable(res);

    });

};

// Use the cli-table3 npm package to display the data in a nice looking table
function displayTable(res) {
    // object to display data in a nice table from the cli-table3 npm package to the terminal
    var table = new Table({
        head: ['Product ID', 'Product Name', 'Price', "Quantity"]
    });

    // push products table data to the table object
    for (var i = 0; i < res.length; i++) {

        table.push(
            [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
        );

    };

    console.log(table.toString());

    displayMenu();
};

// displays list of products in which the stock quantity is less than 5
function lowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (err) throw err;

        displayTable(res)
    });
};

// User can use this command to add inventory for an existing product by choosing from the list of item_id
function addInventory() {

    inquirer.prompt([
        {
            type: "list",
            name: "productID",
            message: "Which product ID would you like to add inventory for?",
            choices: productChoices
        },
        {
            name: "quantity",
            message: "How many units would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return value !== '';
                }
                return false;
            }
        }

    ]).then(function (response) {

        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            var chosenProduct;

            // loop through the response to identify the product chosen by the customer by matching it to an item_id and store it into a variable
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(response.productID)) {
                    chosenProduct = res[i];
                };
            };

            // adds the quantity that the user reeqiested to the current inventory quantity
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: parseInt(chosenProduct.stock_quantity) + parseInt(response.quantity)
                    },
                    {
                        item_id: chosenProduct.item_id
                    }
                ],
                function (err, res) {
                    if (err) throw err;

                    console.log("\n" + response.quantity + " units has been added to " + chosenProduct.product_name + "\n");

                    displayMenu();
                }
            );

        });

    });

};

// User can use this command to add new products. They will be prompted for the product name, department, price per unit and initial quantity
function addNew() {

    inquirer.prompt([
        {
            name: "productName",
            message: "What is the product you would like to add?",
            validate: function validateString(name) {

                return name !== ''; //* String validation *//

            }
        },
        {
            name: "departmentName",
            message: "Which department is this product for?",
            validate: function validateString(name) {

                return name !== ''; //* String validation *//

            }
        },
        {
            name: "price",
            message: "What is the price per unit?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return value !== '';
                }
                return false;
            }
        },
        {
            name: "quantity",
            message: "How many units would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return value !== '';
                }
                return false;
            }
        }

    ]).then(function (response) {

        // inserts the new product as a new row into the database
        connection.query(
            "INSERT INTO products SET ?",

            {
                product_name: response.productName,
                department_name: response.departmentName,
                price: parseFloat(response.price),
                stock_quantity: parseInt(response.quantity)
            }
            ,
            function (err, res) {
                if (err) throw err;

                console.log("\n" + response.productName + " has been added to inventory\n");

                displayMenu();
            }
        );

    });

};
