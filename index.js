//initiate and import libraries, mysql12, inquirer
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
//since i have a lot of functions to import,
//import the file wholely as helper and when calling functions
//i will use it like so, helper.allEmployees() or helper.allRoles()
const helper = require("./utils/helper");

//create mysql connection

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "!Greypoupon1721",
    database: "workplace_db",
  },
  console.log("You are now Connected to the Employee Database. :)")

)



                                                                                                                      

//creating main menu prompt, will call on init function
const mainMenu = [
  {
    type: "list",
    name: "menu",
    message: "What would you like to do? (use arrow keys)",
    choices: [
      "View All Employees",
      "Add Employees",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
];

function init() {
  inquirer.prompt(mainMenu).then(function (answers) {
    switch (answers.menu) {
      case "View All Employees":
        helper.allEmployees(db);
        setTimeout(init, 100);

        break;

      case "Add Employees":
        helper.addEmployees(db, init);
        // setTimeout(init, 100);
        break;

      case "Update Employee Role":
        helper.updateEmployeeRole(db, init);
        //setTimeout(init, 100);
        break;

      case "View All Roles":
        helper.allRoles(db);
        setTimeout(init, 100);
        break;

      case "Add Role":
        helper.addRoles(db, init);
        // setTimeout(init, 100);
        break;

      case "View All Departments":
        helper.allDepartments(db);
        setTimeout(init, 100);
        break;

      case "Add Department":
        helper.addDepartment(db, init);
        //setTimeout(init, 100);
        break;

      case "quit":
        process.exit();
        break;
    }
  });
}

init();
module.exports = { init };
