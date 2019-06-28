// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.

// 2. Modify the products table so that there's a product_sales column, and modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

// * Make sure your app still updates the inventory listed in the `products` column.

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

// store inquirer prompts into a variable to use later
var questions = [
    {
        name: "productID",
        message: "What is the Product ID?",
        validate: function (value) {
            if (isNaN(value) === false) { //* Number validation *//
                return value !== '';
            }
            return false;
        }
    },
    {
        name: "quantity",
        message: "How many units would you like to buy?",
        validate: function (value) {
            if (isNaN(value) === false) { //* Number validation *//
                return value !== '';
            }
            return false;
        }
    }

];

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    // function to execute after connecting to the database
    displayProducts();
});

// displays items available in the store
function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log("Here are the items available for sale: ");

        // object to display data in a nice table from the cli-table3 npm package to the terminal
        var table = new Table({
            head: ['Product ID', 'Product Name', 'Price']
        });

        // push products table data to the table object
        for (var i = 0; i < res.length; i++) {

            table.push(
                [res[i].item_id, res[i].product_name, res[i].price]
            );

        };

        console.log(table.toString());

        promptUser();

    });

};

// prompt user after displaying the store products
function promptUser() {

    // confirms with customer if they would like to buy anything. If so ask them for the product ID and quantity. If not, end the connection to the database.
    inquirer.prompt([
        {
            type: "confirm",
            name: "wantBuy",
            message: "Would you like to purchase an item?",
            default: true
        },

    ]).then(function (response) {

        if (response.wantBuy) {

            inquirer.prompt(questions).then(function (answer) {

                // call checkQuantity function to check store to see if it has enough inventory to fulfill customer's request
                checkQuantity(answer);

            });
        }
        else {
            console.log("Ok see you next time!");
            connection.end();
        }
    });

};

// function to check store to see if it has enough inventory to fulfill customer's request
function checkQuantity(product) {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var chosenProduct;

        // loop through the response to identify the product chosen by the customer by matching it to an item_id and store it into a variable
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id === parseInt(product.productID)) {
                chosenProduct = res[i];
            };
        };

        // if quantity requested is less than the inventory quantity, then process the order and update the inventory quantity and product sales
        if (product.quantity < chosenProduct.stock_quantity) {
            console.log("\nYour order has been processed");
            connection.query(
                "UPDATE products SET ?, ? WHERE ?",
                [
                    {
                        stock_quantity: parseInt(chosenProduct.stock_quantity) - parseInt(product.quantity)
                    },
                    {
                        product_sales: parseFloat(chosenProduct.price) * parseInt(product.quantity) + parseFloat(chosenProduct.product_sales)
                    },
                    {
                        item_id: chosenProduct.item_id
                    }
                ],
                function (err, res) {
                    if (err) throw err;

                    // notify the customer of the total cost by multiplying their quantity bought with the product price
                    console.log("\nThe total cost of your purchase is: $" + product.quantity * chosenProduct.price + "\n");

                    connection.end();

                }
            );
        }
        else {

            // if quantity requested is more than the inventory quantity, then notify the customer that the store does not have sufficient quantity in stock and show them the inventory quantity.
            console.log("Sorry we only have " + chosenProduct.stock_quantity + " in stock");
            promptUser();

        };
    });

};
