// // This file contains the logic to read and write from our JSON file so that information persists between logins.
// // Create a class with methods that can be invoked
// /**********************************************
//  * Editing the Notes
//  * ==================================
//  ***********************************************/
// /*

//  */
// // You will be using promises - remember...
// // Promises are essentially task queues that “promise” a value will at some point be returned from asynchronous code.

// // import the filesystem module from node.js
// // const fs = require("fs");

// // Create a new NoteService class which takes a file as a dependency, this means whenever we are creating new instances of the noteService, we need to pass in a path to a file (this is the file that we will read, write and edit etc.)
// class NoteService {
//   constructor(file, fs) {
//     this.file = file;
//     this.initPromise = null; // Define that the instance variable, initPromise is null.
//     this.fs = fs;
//     this.init(); // Call the init() method.
//     // this.notes = {};
//   }

//   /** # Initialize class   #
//   /*  ====================== */
//   // 1) Initialize class
//   // The init promise only needs to run once.
//   // When it runs, this.read creates a globally available variable: this.notes (which is in stores/notes.json)

//   init() {
//     if (this.initPromise === null) {
//       this.initPromise = new Promise((resolve, reject) => {
//         // wait until the read method finishes before sending a "done" promise
//         // a promise is an object that returns the state (indicates whether or not its done)
//         this.read()
//           .then(() => {
//             resolve();
//           })
//           .catch(() => {
//             this.notes = {};
//             console.log("init_ERROR");
//             this.write().then(resolve).catch(reject);
//           });
//       });
//     }
//     return this.initPromise;
//   }

//   /** # Read method  #
//   /*  ====================== */
//   // 2) Create promise that reads file

//   // The purpose of this method is to read out notes from our stores/notes.json file, turning it into json
//   /*
//     Example:
//       let readFilePromise = new Promise((resolve, reject) => {
//         fs.readFile("data.txt", "utf-8", (err, data) => {
//           if (err) {
//             reject(err);
//           } else {
//           // You will also have to parse this.notes
//             resolve(data);
//           }
//         });
//       });
//     */

//   read() {
//     return new Promise((resolve, reject) => {
//       this.fs.readFile(this.file, "utf-8", (err, data) => {
//         if (err) {
//           reject(err);
//         }
//         try {
//           this.notes = JSON.parse(data);
//           console.log(this.notes);
//         } catch (e) {
//           return reject(e);
//         }
//         return resolve(this.notes);
//       });
//     });
//   }

//   /** # Write method  #
//     /*  ====================== */
//   // 3) Create promise that writes file
//   // The write method is used to update our JSON file.
//   // Promises (and Node.js style callbacks) are very useful for single-result functions
//   // For instance, fs.writeFile fires the callback when all of the given contents have been written to the file.

//   /*
//       Example:
//             let writeFilePromise = new Promise((resolve, reject) => {
//               fs.writeFile("data.txt", data, (err) => {
//                 if (err) {
//                   reject(err);
//                 } else {
//                   resolve();
//                 }
//               });
//             });
//       */
//   write() {
//     console.log(4);
//     return new Promise((resolve, reject) => {
//       this.fs.writeFile(this.file, JSON.stringify(this.notes), (err) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(this.notes);
//       });
//     });
//   }
//   /** # List method  #
//     /*  ====================== */
//   // 4) Get the notes for a specific user
//   // The user is accessed via req.auth.user within our router.
//   // The user is a parameter here (you can play with the user variable here )
//   list(user) {
//     console.log(5);
//     if (typeof user !== "undefined") {
//       // check to see if the application has been initialized
//       return this.init()
//         .then(() => {
//           // call the readfile method
//           return this.read();
//         })
//         .then(() => {
//           // get the notes of that user
//           // this.notes is an object - make sure you only get the notes of that user
//           // HINT: grab the key
//           if (typeof this.notes[user] === "undefined") {
//             return [];
//           } else {
//             console.log("success");
//             return this.notes[user];
//           }
//         });
//     } else {
//       // initialize, then read the notes
//       return this.init().then(() => {
//         // if user is not defined, return all the notes
//         return this.read();
//       });
//     }
//   }
//   /** # Add method  #
//     /*  ====================== */
//   // 5) Adds a note for the user
//   // This method add notes updates the users notes, by adding the new note to this.notes,
//   // it then calls this.write, to update our JSON file with the newest notes.
//   add(note, user) {
//     console.log("ADD METHOD");
//     console.log("Note: " + note);
//     console.log("User: " + user);
//     return this.init().then(() => {
//       // if user has not been created
//       // get the list of notes, and then push the new note into that array
//       if (typeof this.notes[user] === "undefined") {
//         this.notes[user] = [];
//       }
//       this.notes[user].push(note);
//       return this.write();
//     });
//   }

//   /** # Update method  #
//     /*  ====================== */
//   // 6) Updates a note
//   // This method will be used to update a specific note in our application,
//   // it also handles some errors for our application. Then it calls this.write to update the JSON file.
//   update(index, note, user) {
//     return this.init().then(() => {
//       // if there is no user
//       // if note does not exist
//       if (typeof this.notes[user] === "undefined") {
//         throw new Error("Cannot update a note, if the user doesn't exist");
//       }
//       if (this.notes[user].length <= index) {
//         throw new Error("Cannot update a note that doesn't exist");
//       }
//       this.notes[user][index] = note;
//       return this.write();
//     });
//   }

//   /** # Remove method  #
//     /*  ====================== */
//   // 7) Removes a note
//   // This method will remove a particular note from our this.notes. Then it calls this.write to update our JSON file.
//   remove(index, user) {
//     // you won't have the old notes
//     // this.init() grabs the original notes, and then
//     // if user does not exist
//     // if the note does not exist
//     // if we delete the note, we want to pass in the index position
//     // so you would want to rewrite the notes for that user
//     return this.init().then(() => {
//       if (typeof this.notes[user] === "undefined") {
//         throw new Error("Cannot remove a note, if the user doesn't exist");
//       }
//       if (this.notes[user].length <= index) {
//         throw new Error("Cannot remove a note that doesn't exist");
//       }
//       return this.read().then(() => {
//         this.notes[user].splice(index, 1);
//         return this.write();
//       });
//     });
//   }
// }

// module.exports = NoteService;
