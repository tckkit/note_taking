// Declare the function Auth Challenger that takes in one parameter, the users

// const AuthChallenger = (users) => {
//   // This will return True or False
//   return (username, password) => {
//     // This is the password and username that we receive when prompted by our HTML file.
//     // code here
//     return (
//       typeof users[username] !== "undefined" && users[username] === password
//     );
//     // Logic to see if we can match the username given to a username stored in our JSON file, and if the password matches
//   };
// };
// // This code exports the function we hae just defined.
// module.exports = AuthChallenger;

const AuthChallenger = function () {
  return async function (username, password, cb) {
    console.log(username, password);
    const knexConfig = require("./knexfile").development;
    const knex = require("knex")(knexConfig);
    try {
      let query = await knex
        .select("username")
        .from("users")
        .where("username", username)
        .where("password", password);
      console.log(query);
      if (query.length === 1) {
        return cb(null, true);
        //we have found the user with this username and password.
      } else {
        return cb(null, false);
        //no such user....
      }
    } catch (err) {
      console.log(err);
    }
  };
};
module.exports = AuthChallenger;
