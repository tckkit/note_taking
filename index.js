/**********************************************
 * Notetaking Application Challenge
 * ==================================
 ***********************************************/

/** # Import all libraries  #
/*  ====================== */
// 1) Import all required modules

// In-built Node Modules (filesystem and path)
const fs = require("fs"); // OK
const path = require("path"); // OK

// NPM installed modules
const express = require("express"); // OK
const app = express(); // OK

//test

// Set up your application, import the required packages
const config = require("./stores/config.json")["development"]; // OK
const AuthChallenger = require("./AuthChallenger"); // OK

// knex and .env
const env = require("dotenv");
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

// Capitalize when it is a class
const { engine } = require("express-handlebars"); // OK
app.engine("handlebars", engine()); // OK
app.set("view engine", "handlebars"); // OK
app.set("views", "./views"); // OK

/** # Configure Express #
/*  ====================== */
// 2) Configure Express
// Set up handlebars (set up engine and register handlebars with express)
// app.engine("handlebars", engine());
// Look at the example from the lecture: https://xccelerate.talentlms.com/unit/view/id:2002

// Set up Express

// Set up any middleware required, like express.json()
app.use(express.static("public")); // OK
app.use(express.urlencoded({ extended: false })); // OK
app.use(express.json()); // OK

// Set up and configure express-basic-auth using the AuthChallenger
const basicAuth = require("express-basic-auth"); // OK
const NoteService = require("./Services/NoteService"); // OK
const NoteRouter = require("./Routers/NoteRouter"); // OK

app.use(
  basicAuth({
    authorizeAsync: true,
    authorizer: AuthChallenger(knex), // we are defining the file where our users exist with this code: JSON.parse(fs.readFileSync(path.join(__dirname, config.users))), we also parse the data so that we can iterate over each user like a JavaScript variable/ object.
    challenge: true,
    realm: "Note Taking Application",
  })
); // OK

/** # Set up NoteService  #
/*  ====================== */
// 3) Past in the file into the noteservice class
// Remark:
// config.notes = stores/config.json/development.notes = "./stores/notes.json"

// Before knex
// const noteService = new NoteService(path.join(__dirname, config.notes), fs); // OK

// After knex
const noteService = new NoteService(knex);

/** # Set up basic express server  #
/*  ====================== */
// 4) Set up basic express server
// Set up your route handler for '/' ==> send and index page to the users
app.get("/", (req, res, next) => {
  // Create a callback function
  // You always need a .then to
  console.log(`Logged in!`);
  next();
}); // OK

// DONT DO STEP FOUR UNTIL NEXT WEEK
/** # Set up authentication   #
/*  ====================== */
// 5) Set up authentication
// Set up basic auth

// DONT DO THE ABOVE PART UNTIL NEXT WEEK

// Responsible for sending our index page back to our user.
// Remark:
// res.render([file], [defining the variables inside the file])
app.get("/", (req, res) => {
  console.log(req.auth.user, req.auth.password);
  console.log("get");
  noteService.list(req.auth.user).then((data) => {
    console.log(data);
    res.render("index", {
      user: req.auth.user,
      notes: data,
    });
  });
}); // OK

/** # Set up routes from noteservice  #
/*  ====================== */
// 6) Create a new instance of noteService and pass the file path/to/the/file where you want the service to read from and write to.

/** #  Set up Note Router  #
/*  ====================== */
// 7) Set up the NoteRouter - handle the requests and responses in the note, read from a file and return the actual data, get the note from your JSON file and return to the clients browser.
// any notes that go to api/routes will go to noterouter
// /api/notes/:id
// Remark:
// noteService = new NoteService(path.join(__dirname, config.notes), fs);
// config.notes = stores/config.json/development.notes = "./stores/notes.json"
app.use("/api/info", new NoteRouter(noteService).router()); // OK

// make your application listen to a port of your choice.
// Remark:
// config.port = stores/config.json/development.port = 3000
app.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
}); // OK

module.exports = app;
