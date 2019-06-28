// 3. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:

//    * View Product Sales by Department

//    * Create New Department

// 4. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window

// 5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

// 6. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

//    * Hint: You may need to look into aliases in MySQL.

//    * Hint: You may need to look into GROUP BYs.

//    * Hint: You may need to look into JOINS.

//    * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)

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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    // function to execute after connecting to the database
    displayMenu();

});

// display the list of commands when app loads
function displayMenu() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department",
                "Create New Department",
                "Exit"]
        }
    ]).then(function (answer) {
        // switch case to dictate which function to execute depending on which command the user picks
        switch (answer.action) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                createNewDep();
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

// command to view sales and total profits by department
function viewSales() {

    // query uses aliasing to show "total profits" without storing it in the database. Uses join to join the product_sales column from the products table. Group By to group by department.
    var query = "SELECT MAX(departments.department_id) as 'department_id',departments.department_name, SUM(departments.over_head_cost) AS 'over_head_cost', SUM(products.product_sales) AS 'product_sales', SUM(products.product_sales)-SUM(departments.over_head_cost) AS 'total_profits' FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name";

    connection.query(query, function (err, res) {
        if (err) throw err;

        // object to display data in a nice table from the cli-table3 npm package to the terminal
        var table = new Table({
            head: ['Department ID', 'Department Name', 'Overhead Cost', "Product Sales", "Total Profits"]
        });

        // push products table data to the table object
        for (var i = 0; i < res.length; i++) {

            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_cost, res[i].product_sales, res[i].total_profits]
            );

        };

        console.log(table.toString());

        displayMenu();

    })
};

// command for user to creat new department. Will prompt for deparment name and overhead cost
function createNewDep() {

    inquirer.prompt([
        {
            name: "departmentName",
            message: "What is the department you would like to add?",
            validate: function validateString(name) {

                return name !== ''; //string validation//

            }
        },
        {
            name: "overHeadCost",
            message: "What is the over head cost?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return value !== ''; //number validation//
                }
                return false;
            }
        }

    ]).then(function (response) {

        // inserts the new department as a new row into the database
        connection.query(
            "INSERT INTO departments SET ?",

            {
                department_name: response.departmentName,
                over_head_cost: parseFloat(response.overHeadCost),
            }
            ,
            function (err, res) {
                if (err) throw err;

                console.log("\n" + response.departmentName + " has been added\n");

                displayMenu();
            }
        );

    });

};