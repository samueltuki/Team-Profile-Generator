// team profile
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Employee = require("./lib/Employee");

// node module
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

// array used to push data retrieved from prompt
let team = [];

function start() {
  // function to handle generating manager - first bc we need a manager
  function createManager() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "managerName",
          message: "What is the team manager's name?",
          validate: (answers) => {
            if (answers !== "") {
              return true;
            }
            return "Please enter at least one character.";
          },
        },
        {
          type: "input",
          name: "managerId",
          message: "What is the team manager's id?",
        },
        {
          type: "input",
          name: "managerEmail",
          message: "What is the team manager's Email?",
        },
        {
          type: "input",
          name: "managerOfficeNumber",
          message: "What is the team manager's Office number?",
        },
      ])
      .then((answers) => {
        const manager = new Manager(
          answers.managerName,
          answers.managerId,
          answers.managerEmail,
          answers.managerOfficeNumber
        );

        // pushing to team array and calling the next function that will ask what type of employee will be created next
        team.push(manager);
        createTeam();
      });
  }

  // function that asks what type of employee they would like to create next
  function createTeam() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "memberChoice",
          message: "what type of team member will you like to add?",
          choices: ["Engineer", "Intern", "no more team members"],
        },
      ])
      .then((answers) => {
        /* conditional that decides which of the below functions to call based on userChoice. If none of the choices (engineer or employee) have been chosen default to buildTeam()*/
        switch (answers.memberChoice) {
          case "Engineer":
            createEngineer();
            break;
          case "Intern":
            createIntern();
            break;
          default:
            buildTeam();
        }
      });
  }

  // function to handle generating engineer

  function createEngineer() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "what is the engineer name",
          name: "engineerName",
        },
        {
          type: "input",
          message: "what is the engineer id",
          name: "engineerId",
        },
        {
          type: "input",
          message: "what is the engineer email",
          name: "engineerEmail",
        },
        {
          type: "input",
          message: "what is the engineer GitHub",
          name: "engineerGithub",
        },
      ])
      .then((answers) => {
        const engineer = new Engineer(
          answers.engineerName,
          answers.engineerId,
          answers.engineerEmail,
          answers.engineerGithub,
        );
        team.push(engineer);
        createTeam();
      });
  }

  // function to handle generating intern

  function createIntern() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the intern?",
          name: "name",
        },
        {
          type: "input",
          message: "What is the id of the intern?",
          name: "id",
        },
        {
          type: "input",
          message: "What is the email of the intern?",
          name: "email",
        },
        {
          type: "input",
          message: "What is the school of the intern?",
          name: "school",
        },
      ])
      .then((answers) => {
        const intern = new Intern(
          answers.name,
          answers.id,
          answers.email,
          answers.school
        );
        team.push(intern);
        createTeam();
      });
  }

  // function to buildTeam - will use fs.writeFileSync & pass in the outputPath created above, call to render (dont forget to pass in the employee array), & "utf-8"
  function buildTeam() {
    // create the output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    // write the HTML file using the rendered template and employee data
    fs.writeFileSync(outputPath, render(team), "utf-8");

    console.log("Successfully generated team profile!");
  }


  createManager(); // starts of the whole chain of events.
}

start();
