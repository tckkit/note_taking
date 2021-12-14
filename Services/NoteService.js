// This file contains the logic to read and write from our JSON file so that information persists between logins.
// Create a class with methods that can be invoked
/**********************************************
 * Editing the Notes
 * ==================================
 ***********************************************/
/*

 */
// You will be using promises - remember...
// Promises are essentially task queues that “promise” a value will at some point be returned from asynchronous code.

// import the filesystem module from node.js
// const fs = require("fs");

// Create a new NoteService class which takes a file as a dependency, this means whenever we are creating new instances of the noteService, we need to pass in a path to a file (this is the file that we will read, write and edit etc.)

class NoteService {
  constructor(knex) {
    this.knex = knex;
  }

  /** # List method  #
  /*  ====================== */
  // 4) Get the notes for a specific user
  // The user is accessed via req.auth.user within our router.
  // The user is a parameter here (you can play with the user variable here )

  // Before knex
  // list(user) {
  //   console.log(5);
  //   if (typeof user !== "undefined") {
  //     // check to see if the application has been initialized
  //     return this.init()
  //       .then(() => {
  //         // call the readfile method
  //         return this.read();
  //       })
  //       .then(() => {
  //         // get the notes of that user
  //         // this.notes is an object - make sure you only get the notes of that user
  //         // HINT: grab the key
  //         if (typeof this.notes[user] === "undefined") {
  //           return [];
  //         } else {
  //           console.log("success");
  //           return this.notes[user];
  //         }
  //       });
  //   } else {
  //     // initialize, then read the notes
  //     return this.init().then(() => {
  //       // if user is not defined, return all the notes
  //       return this.read();
  //     });
  //   }
  // }

  // After knex
  list(user) {
    if (typeof user !== "undefined") {
      let query = this.knex
        .select("notes.id", "notes.note")
        .from("notes")
        .innerJoin("users", "notes.username_id", "users.id")
        .where("users.username", user)
        .orderBy("notes.id", "asc");

      return query.then((rows) => {
        console.log(rows, "listed");
        return rows.map((row) => ({
          id: row.id,
          notes: row.note,
        }));
      });
    }
    // else {
    //   let query = this.knex
    //     .select("users.username", "notes.id", "note")
    //     .from("notes")
    //     .innerJoin("users", "notes.user_id", "users.id");

    //   return query.then((rows) => {
    //     console.log(rows);
    //     const result = {};
    //     rows.forEach((row) => {
    //       if (typeof result[row.username] === "undefined") {
    //         result[row.username] = [];
    //       }
    //       result[row.username].push({
    //         id: row.id,
    //         content: row.content,
    //       });
    //     });
    //     return result;
    //   });
    // }
  }

  /** # Add method  #
  /*  ====================== */
  // 5) Adds a note for the user
  // This method add notes updates the users notes, by adding the new note to this.notes,
  // it then calls this.write, to update our JSON file with the newest notes.

  // Before knex
  // add(note, user) {
  //   console.log("ADD METHOD");
  //   console.log("Note: " + note);
  //   console.log("User: " + user);
  //   return this.init().then(() => {
  //     if (typeof this.notes[user] === "undefined") {
  //       this.notes[user] = [];
  //     }
  //     this.notes[user].push(note);
  //     return this.write();
  //   });
  // }

  // After knex
  async add(notes, user) {
    let query = await this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    console.log(query);

    if (query.length === 1) {
      await this.knex
        .insert({
          note: notes,
          username_id: query[0].id,
        })
        .into("notes");
    } else {
      throw new Error(`Cannot add a note to a user that does not exist!`);
    }
  }

  /** # Update method  #
  /*  ====================== */
  // 6) Updates a note
  // This method will be used to update a specific note in our application,
  // it also handles some errors for our application. Then it calls this.write to update the JSON file.

  // Before knex
  // update(index, note, user) {
  //   return this.init().then(() => {
  //     // if there is no user
  //     // if note does not exist
  //     if (typeof this.notes[user] === "undefined") {
  //       throw new Error("Cannot update a note, if the user doesn't exist");
  //     }
  //     if (this.notes[user].length <= index) {
  //       throw new Error("Cannot update a note that doesn't exist");
  //     }
  //     this.notes[user][index] = note;
  //     return this.write();
  //   });
  // }
  // After knex
  update(id, notes, user) {
    let query = this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    return query.then((rows) => {
      if (rows.length === 1) {
        return this.knex("notes").where("id", id).update({
          note: notes,
        });
      } else {
        throw new Error(`Cannot update a note if the user doesn't exist!`);
      }
    });
  }

  /** # Remove method  #
  /*  ====================== */
  // 7) Removes a note
  // This method will remove a particular note from our this.notes. Then it calls this.write to update our JSON file.
  // Before knex
  // remove(index, user) {
  //   return this.init().then(() => {
  //     if (typeof this.notes[user] === "undefined") {
  //       throw new Error("Cannot remove a note, if the user doesn't exist");
  //     }
  //     if (this.notes[user].length <= index) {
  //       throw new Error("Cannot remove a note that doesn't exist");
  //     }
  //     return this.read().then(() => {
  //       this.notes[user].splice(index, 1);
  //       return this.write();
  //     });
  //   });
  // }
  // After knex
  remove(id, user) {
    let query = this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    return query.then((rows) => {
      if (rows.length === 1) {
        return this.knex("notes").where("id", id).del();
      } else {
        throw new Error(`Cannot remove a note when the user doesn't exist!`);
      }
    });
  }
}

module.exports = NoteService;
