const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "employee_db",
});
const cTable = require('console.table')

//////////////////// * MAIN MENU
const fnMainMenu = async () => {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: ["ADD ENTITY", "VIEW ENTITIES", "UPDATE", "DELETE", "EXIT"],
  });

  switch (action) {
    case "ADD ENTITY":
      return fnAddEntity();
    case "VIEW ENTITIES":
      return fnViewEntity();
    case "UPDATE":
      return fnUpdateEntity();
    case "DELETE":
      return fnRemoveEntity();
    case "EXIT":
      return;
  }
};

//////////////// * ADD
const fnAddEntity = async () => {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Which type of data would you like to add?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"],
  });

  switch (action) {
    case "DEPARTMENT":
      return fnAddDepartment();
    case "ROLE":
      return fnAddRole();
    case "EMPLOYEE":
      return fnAddEmployee();
    case "EXIT":
      return;
  }
};

// add department
const fnAddDepartment = async () => {
  const entry = await inquirer.prompt({
    name: "name",
    type: "input",
    message: "Enter department name:"
  });

  // todo add check if department already exists

  console.log(entry.name)

  // add department
  connection.query(`INSERT INTO department (name)
  VALUES(?)`, entry.name, (err, data) => {
    if (err) throw err;
    console.log(`Adding ${entry.name} department...`)
  });

  // print departments back
  connection.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;

    console.log("\n\r")
    console.table()
    console.log("\n\r")

    fnMainMenu();
  });
};

// add role
const fnAddRole = async () => {
  const entry = await inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Enter role title:"
    },
    {
      name: "salary",
      type: "input",
      message: "Enter the salary for this role:",
    },
    {
      name: "department_id",
      type: "input",
      message: "Enter the department ID for this role:",
    },
  ])

  // todo add check if role already exists

  console.log(entry.name)

  // add role
  connection.query(`INSERT INTO role (title, salary, department_id)
  VALUES(?, ?, ?)`, [entry.title, entry.salary, entry.department_id], (err, data) => {
    if (err) throw err;
    console.log(`Adding ${entry.name} department...`)
  });

  // print all roles back
  connection.query("SELECT * FROM role", (err, data) => {
    if (err) throw err;

    console.log("\n\r")
    console.table()
    console.log("\n\r")

    fnMainMenu();
  });
};

// add employee
const fnAddEmployee = async () => {
  const entry = await inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "Enter first name:"
    },
    {
      name: "lastName",
      type: "input",
      message: "Enter last name:",
    },
  ])

  // todo add check if employee already exists // mayyyyybe

  // add employee
  connection.query(`INSERT INTO employee (first_name, last_name)
  VALUES(?, ?)`, [entry.firstName, entry.lastName], (err, data) => {
    if (err) throw err;
    console.log(`Adding ${entry.name} department...`)
  });

  // print all employees back
  connection.query("SELECT * FROM employee", (err, data) => {
    if (err) throw err;

    console.log("\n\r")
    console.table()
    console.log("\n\r")

    fnMainMenu();
  });
};

//////////////// * VIEW
const fnViewEntity = async () => {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Which type of data would you like to view?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"],
  });

  if (action === "EXIT") return;

  connection.query("SELECT * FROM " + action.toLowerCase(), (err, data) => {
    if (err) throw err;

    console.log("\n\r")
    console.table(data)
    console.log("\n\r")

    fnMainMenu();
  });
};

//////////////// * UPDATE
const fnUpdateEntity = async () => {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Which type of data would you like to view?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"],
  });

  switch (action) {
    case "DEPARTMENT":
      return;
    case "ROLE":
      return;
    case "EMPLOYEE":
      return;
    case "EXIT":
      return;
  }
};

//////////////// * DELETE
const fnRemoveEntity = async () => {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Which type of data would you like to view?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"],
  });

  switch (action) {
    case "DEPARTMENT":
      return;
    case "ROLE":
      return;
    case "EMPLOYEE":
      return;
    case "EXIT":
      return;
  }
};



// connection
connection.connect((err) => {
  if (err) throw err;

  console.log(`Connected as thread id: ${connection.threadId}`);

  fnMainMenu();
});
