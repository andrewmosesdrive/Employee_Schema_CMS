const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Gitgudfamlit21!",
  database: "cms_organization"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + `\n`);
    runPrompts();
});


const prompts = [
    {
        // first object to proc
        type: "list",
        name: "initialPrompt",
        message: "What would you like to do?",
        choices: ["View", "Add", "Update", "Delete", "Exit"]
    },
    {
        // this object only procs if the user chooses "view"
        type: "list",
        name: "viewWhich",
        message: "Which business area would you like to view?",
        choices: ["Departments", "Roles", "Employees", "Exit"],
        when: answers => {
            return answers.initialPrompt === "View"
        }
    },
    {
        // this object only procs if the user chooses "add"
        type: "list",
        name: "addToChoice",
        message: "Which business area would you like to add to?",
        choices: ["Departments", "Roles", "Employees", "Exit"],
        when: answers => {
            return answers.initialPrompt === "Add"
        }
    },
    {
        // this object only procs if the user chooses "update"
        type: "list",
        name: "updateChoice",
        message: "Which business area would you like to make updates to?",
        choices: ["Roles", "Managers", "Exit"],
        when: answers => {
            return answers.initialPrompt === "Update"
        }
    },
    {
        type: "list",
        name: "deleteChoice",
        message: "Which business area would you like to make deletions in?",
        choices: ["Departments", "Roles", "Employees", "Exit"],
        when: answers => {
            return answers.initialPrompt === "Delete"
        }
    }
];

async function runPrompts() {
    await inquirer.prompt(prompts).then(answers => {
        if(answers.initialPrompt === "Exit") {
            connection.end();
        }
        else if(answers.viewWhich === "Departments") {
            // show all department names
            viewDepartments();
        }
        else if(answers.viewWhich === "Roles") {
            // show role information
            viewRoles();
        }
        else if(answers.viewWhich === "Employees") {
            // show employee information
            viewEmployees();
        }
        else if(answers.addToChoice === "Departments") {
            // need a function that will add to the "departments" table, maybe add new inquirer prompt
            addDepartments();
        }
        else if(answers.addToChoice === "Roles") {
            // need a function that will add to the "roles" table, maybe add new inquirer prompt
            addRoles()
        }
        else if(answers.addToChoice === "Employees") {
            // need a function that will add to the "employees" table
            addEmployees();
        }
    }).catch(error => {
        console.log(error)
    });
};

function viewDepartments() {
     connection.query("SELECT * FROM departments"), function(err, results) {
        if (err) throw err;
        console.table(results);
        runPrompts();
    }
};

function viewRoles() {
    connection.query("SELECT title, salary FROM org_roles"), function(err, res) {
        if (err) throw err;
        console.log(res);
        runPrompts();
    }
};

function viewEmployees() {
    connection.query("SELECT first_name, last_name FROM employees"), function(err, res) {
        if (err) throw err;
        console.log(res);
        runPrompts();
    }
}

async function addDepartments() {
    await inquirer
    .prompt(
        {
            type: "input",
            name: "deptInput",
            message: "Enter the name of the Department you would like to add"
        }
    ).then(answers => {
        connection.query("INSERT INTO departments (dept_name) VALUES (?)", answers.deptInput, function(err, results) {
            if (err) throw err;
            console.log(`Added ${answers.deptInput} to the current list of Departments!`)
            // console.log(results)
            runPrompts();
        })
    })
    
};

async function addRoles() {
    await inquirer
    .prompt([
        {
            type: "input",
            name: "roleInput",
            message: "Enter the title of the Role you would like to add"
        },
        {
            type: "number",
            name: "salaryInput",
            message: "Enter the annual salary of the Role you are adding"
        }
    ]).then(answers => {
        connection.query("INSERT INTO org_roles (title, salary) VALUES (?, ?)", [answers.roleInput, answers.salaryInput], function(err, results) {
            if (err) throw err;
            console.log(`Added ${answers.roleInput} to the list of current Roles, with a salary of $${answers.salaryInput} per year`);
            runPrompts();
        })
    });
}

async function addEmployees() {
    await inquirer
    .prompt([
        // need questions for user
    ]).then(answers => {
        // need sql syntax for inputs and corresponding answers.whatever
        connection.query(""), [], function(err, results) {
            if (err) throw err;
            // console out response to let the user know what was added
            console.log();
            runPrompts();
        }
    })
}