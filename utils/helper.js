//initiate and import libraries, mysql12, inquirer
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

//import init function, calling init function in the add/update function so that it the mainmenu is displayed AFTER
//the added/updated prompts have finished

//all functions are being setup in this helper to be simply called in the index.js
//create each query to be asynchronous, i am using mysql2's db.promise.query
async function allEmployees(db) {
  try {
    // [Employees] is what i am calling the array output of the SQL query
    // inside this array, each value is each row, each row is representaed as
    //an object with properties corresponding to the query
    //id, Fname, Lname, title, department, salary, manager

    //this query joins employee, roles, dep tables using the foreign key relationships
    // this also joins the emp table again as 'm' to get the name of the manager
    // the leftjoin is used to include employees who have no manager.
    const [Employees] = await db.promise().query(`
    SELECT e.id, e.first_name, e.last_name, r.title, d.depName as department, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
    FROM employee e
    JOIN roles r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY e.id; 
  `);

    console.table(Employees);
  } catch (err) {
    console.error(err);
  }
}
async function addEmployees(db, callback) {
  try {
    //retrieving all roles and employees
    const roles = await db.promise().query("SELECT * FROM roles");
    const employees = await db.promise().query("SELECT * FROM employee");

    //deconstructing roles table and specifying needed values, id and title from roles and id, Fname, Lname from employees
    // the *Choices are being created by mapping over the reults of the queries
    // the values then get put into an object with name and value properties.

    const roleChoices = roles[0].map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const employeeChoices = employees[0].map(
      ({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })
    );

    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "last_name",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "role_id",
        choices: roleChoices,
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "manager_id",
        choices: employeeChoices,
      },
    ]);

    await db.promise().query("INSERT INTO employee SET ?", answers);

    console.log(
      `Employee ${answers.first_name} ${answers.last_name} added successfully!`
    );
  } catch (err) {
    console.error(err);
  }
  callback();
}

async function allRoles(db) {
  try {
    // [rows] is what i am calling the array output of the SQL query
    // inside this array, each value is each row, each row is representaed as
    //an object with properties corresponding to the query (roles,id,dep,salary)
    const [roles] = await db.promise().query(`
  SELECT roles.id, roles.title, department.depName AS department, roles.salary
  FROM roles
  JOIN department ON roles.department_id = department.id
  ORDER BY roles.id 
  `);

    console.table(roles);
  } catch (err) {
    console.error(err);
  }
}

async function addRoles(db, callback) {
  try {
    //similar to add employees, need to do select query first
    const departments = await db.promise().query(`SELECT * FROM department`);

    //also similarly, deconstruct, map and use name as department.name and the value for that being the department.id
    const departmentChoices = departments[0].map((department) => ({
      name: department.depName,
      value: department.id,
    }));

    const newRole = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for the role?",
      },
      {
        //we can now call the mapped choices, which lists all the deparments from the database to add to.
        type: "list",
        name: "departmentList",
        message: "Which department does the role belong to?",
        choices: departmentChoices,
      },
    ]);

    const department = departments[0].find(
      (department) => department.id === newRole.departmentList
    );

    //add to database query
    await db
      .promise()
      .query(
        `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`,
        [newRole.title, newRole.salary, newRole.departmentList]
      );

    console.log(`${newRole.title} role has been added to the database!`);
  } catch (err) {
    console.error(err);
  }
  callback();
}

async function addDepartment(db, callback) {
  //prompts question for what department is, also validate if value using validate property
  try {
    const department = await inquirer.prompt({
      type: "input",
      name: "departmentName",
      message: "Enter the name of the department:",
      validate: function (value) {
        if (value.trim().length === 0) {
          return "Please enter a valid department name.";
        }
        return true;
      },
    });

    //the (?) serves as a placeholder for the inputted value.
    await db.promise().query(
      `
  INSERT INTO department (depName) VALUES (?)
  `,
      [department.departmentName]
    );

    console.log(`${department.departmentName} has been added to the database!`);
  } catch (err) {
    console.error(err);
  }
  callback();
}

async function allDepartments(db) {
  try {
    const [departments] = await db.promise().query(`
  SELECT * FROM department
  `);
    console.table(departments);
  } catch (err) {
    console.error(err);
  }
}

async function updateEmployeeRole(db, callback) {
  //similar to all the functions above (pretty much combining all the similar functions)
  try {
    //select all the employees from db, then map the choices for inquirer to use and for the user to see
    const employees = await db.promise().query("SELECT * FROM employee");

    //using e.Fname and e.Lname as keys and employee.id as the value for choices
    const employeeChoices = employees[0].map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    //now do the same for roles, select * and map.
    const roles = await db.promise().query("SELECT * FROM roles");

    // role.title is the key and role.id is the value
    const roleChoices = roles[0].map((role) => ({
      name: role.title,
      value: role.id,
    }));

    //create inquirer prompt and use the mapped choices to be updated
    const updateEmployeeRole = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to update?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's new role?",
        choices: roleChoices,
      },
    ]);

    //create update query,
    await db.promise().query(
      `
    UPDATE employee SET role_id = ? WHERE id = ?
    `,
      [updateEmployeeRole.roleId, updateEmployeeRole.employeeId]
    );

    console.log(`role has been updated!`);
  } catch (err) {
    console.error(err);
  }

  callback();
}

//exporting all of my functions
module.exports = {
  allEmployees,
  addEmployees,
  updateEmployeeRole,
  allRoles,
  addRoles,
  allDepartments,
  addDepartment,
};
