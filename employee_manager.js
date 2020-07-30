const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "employee_db",
});
const cTable = require("console.table");

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
      return fnAddDepartment(action.toLowerCase());
    case "ROLE":
      return fnAddRole(action.toLowerCase());
    case "EMPLOYEE":
      return fnAddEmployee(action.toLowerCase());
    case "EXIT":
      return;
  }
};

// add department
const fnAddDepartment = async (db) => {
  const entry = await inquirer.prompt({
    name: "name",
    type: "input",
    message: "Enter department name:",
  });

  // todo add check if department already exists

  console.log(entry.name);

  // add department
  connection.query(
    `INSERT INTO ${db} (name)
  VALUES(?)`,
    entry.name,
    (err, data) => {
      if (err) throw err;
      console.log(`Adding ${entry.name} department...`);
    }
  );

  // print departments back
  connection.query(`SELECT * FROM ${db}`, (err, data) => {
    if (err) throw err;

    console.log("\n\r");
    console.table(data);
    console.log("\n\r");

    fnMainMenu();
  });
};

// add role
const fnAddRole = async (db) => {
  const entry = await inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Enter role title:",
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
  ]);

  // todo add check if role already exists

  console.log(entry.name);

  // add role
  connection.query(
    `INSERT INTO ${db} (title, salary, department_id)
  VALUES(?, ?, ?)`,
    [entry.title, entry.salary, entry.department_id],
    (err, data) => {
      if (err) throw err;
      console.log(`Adding ${entry.title} role...`);
    }
  );

  // print all roles back
  connection.query(`SELECT * FROM ${db}`, (err, data) => {
    if (err) throw err;

    console.log("\n\r");
    console.table(data);
    console.log("\n\r");

    fnMainMenu();
  });
};

// add employee
const fnAddEmployee = async (db) => {
  const entry = await inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "Enter first name:",
    },
    {
      name: "lastName",
      type: "input",
      message: "Enter last name:",
    },
  ]);

  // todo add check if employee already exists // mayyyyybe

  // add employee
  connection.query(
    `INSERT INTO ${db} (first_name, last_name)
  VALUES(?, ?)`,
    [entry.firstName, entry.lastName],
    (err, data) => {
      if (err) throw err;
      console.log(`Adding ${entry.firstName} ${entry.lastName} to database...`);
    }
  );

  // print all employees back
  connection.query(`SELECT * FROM ${db}`, (err, data) => {
    if (err) throw err;

    console.log("\n\r");
    console.table(data);
    console.log("\n\r");

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

    console.log("\n\r");
    console.table(data);
    console.log("\n\r");

    fnMainMenu();
  });
};

//////////////// * UPDATE
const fnUpdateEntity = async () => {
  let count;
  let { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Which type of data would you like to update?",
    choices: ["ROLE", "EMPLOYEE", "EXIT"],
  });

  connection.query("SELECT * FROM " + action.toLowerCase(), (err, data) => {
    if (err) throw err;

    console.log("\n\r");
    console.table(data);
    console.log("\n\r");
  });

  // get entries count
  connection.query(
    "SELECT COUNT(*) FROM " + action.toLowerCase(),
    (err, data) => {
      if (err) throw err;

      count = parseInt(data[0]["COUNT(*)"]);
    }
  );

  switch (action) {
    case "ROLE":
      let { id } = await inquirer.prompt({
        name: "id",
        type: "input",
        message: "Enter ID of role you would like to edit:",
      });
      if (isNaN(id) || id > count || id <= 0) {
        console.log("Enter valid number");
        fnUpdateEntity();
      } else {
        console.log("updating role");
        return fnUpdateRole(id);
      }
    case "EMPLOYEE":
      let { empId } = await inquirer.prompt({
        name: "empId",
        type: "input",
        message: "Enter ID of employee you would like to edit:",
      });
      if (isNaN(empId) || empId > count || empId <= 0) {
        console.log("Enter valid number");
        fnUpdateEntity();
      } else {
        return fnUpdateEmp(empId);
      }
    case "EXIT":
      return;
  }
};

// update roles
const fnUpdateRole = async (id) => {
  let { col } = await inquirer.prompt({
    name: "col",
    type: "list",
    message: "Which type of column would you like to edit?",
    choices: ["TITLE", "SALARY", "DEPARTMENT_ID", "EXIT"],
  });

  let { val } = await inquirer.prompt({
    name: "val",
    type: "input",
    message: "Enter new value:",
  });

  switch (col) {
    case "TITLE":
      break;
    case "DEPARTMENT_ID":
    case "SALARY":
      if (isNaN(val)) {
        console.log("Enter a valid number");
        return fnUpdateEntity();
      }
    case "EXIT":
      return fnUpdateEntity();
  }

  // set new value
  connection.query(
    `UPDATE role SET ${col.toLowerCase()} = ? WHERE id = ${id}`,
    val,
    (err, data) => {
      if (err) throw err;
      // console.log(data);
      connection.query(`SELECT * FROM role`, (err, data) => {
        if (err) throw err;
        console.table(data);
        fnMainMenu();
      });
    }
  );
};

// update employees
const fnUpdateEmp = async (id) => {
  let { col } = await inquirer.prompt({
    name: "col",
    type: "list",
    message: "Which type of column would you like to edit?",
    choices: ["FIRST_NAME", "LAST_NAME", "ROLE_ID", "MANAGER_ID", "EXIT"],
  });

  let { val } = await inquirer.prompt({
    name: "val",
    type: "input",
    message: "Enter new value:",
  });

  switch (col) {
    case "FIRST_NAME":
    case "LAST_NAME":
      break;
    case "MANAGER_ID":
    case "ROLE_ID":
      if (isNaN(val)) {
        console.log("Enter a valid number");
        return fnUpdateEntity();
      }
      break;
    case "EXIT":
      return fnUpdateEntity();
  }

  // set new value
  connection.query(
    `UPDATE employee SET ${col.toLowerCase()} = ? WHERE id = ${id}`,
    val,
    (err, data) => {
      if (err) throw err;
      // console.log(data);
      connection.query(`SELECT * FROM employee`, (err, data) => {
        if (err) throw err;
        console.table(data);
        fnMainMenu();
      });
    }
  );
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
