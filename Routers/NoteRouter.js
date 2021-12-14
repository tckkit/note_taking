/**********************************************
 * Routing for the NoteApplication
 * ==================================
 ***********************************************/
// This file contains the route handlers for the website, anything to do with notes should come through this router
// Require the necessary modules for this file.
const express = require("express");

// Setup a NoteRouter class which takes the note service as a dependency, that was we can inject the NoteService when we use our Router. As this is not a hard coded value we will need to inject the noteService for every instance of the note router.
class NoteRouter {
  constructor(noteService) {
    this.noteService = noteService;
  }
  // This utilises the express Router method, basically we are binding the path/ request to each restful verb
  router() {
    let router = express.Router();
    // bind the different methods (if not using arrow function, should bind the method to the class)
    // e.g., router.get("/", this.get.bind(this));
    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    router.put("/:id", this.put.bind(this));
    router.delete("/:id", this.delete.bind(this));
    return router;
  }

  /** # GET Method   #
/*  ====================== */
  //   1) Create a get method
  //   when the route is "/"
  //   Here we handle what will occur when we have been sent down a particular path, this path is '/' - we will just list all of the notes, that match our(req.auth.user)
  get(req, res) {
    let user = req.auth.user;
    return (
      this.noteService
        // list out all the notes from the user
        .list(user)
        // What we do with the information that we receive, here we send the notes back in JSON format.
        .then((notes) => {
          res.json(notes);
        })
        // This .catch is to handle any errors that may befall our project.
        .catch((err) => {
          res.status(500).json(err);
        })
    );
  }

  /** # Post Method   #
/*  ====================== */
  // 2) Create a post method
  post(req, res) {
    console.log("NoteRouter: POST Method");
    console.log("Note: " + req.body.note);
    console.log("User: " + req.auth.user);
    return (
      this.noteService
        // call the add method here
        .add(req.body.note, req.auth.user)
        .then(() => {
          // list the notes of the user
          return this.noteService.list(req.auth.user);
        })
        .then((notes) => {
          // make the notes into json format
          return res.json(notes);
        })
        .catch((err) => {
          res.status(500).json(err);
        })
    );
  }

  /** # PUT Method   #
  /*  ====================== */
  // 3) Create a put method, which updates our json file
  // Here we handle our put request, which has an id as a parameter (req.params.id), the body of the updated note (req.body.note) and the user who's note we want to update (req.auth.user)
  put(req, res) {
    let id = req.params.id;
    let note = req.body.note;
    let user = req.auth.user;
    //return this.noteService;
    return (
      this.noteService
        // The noteService fires the update command, this will update our note (and our JSON file)
        .update(id, note, user)

        // Then we fire list note from the same noteService which returns the array of notes for that user.
        .then(() => this.noteService.list(user))
        // Then we respond to the request with all of our notes in the JSON format back to our clients browser.
        .then((notes) => res.json(notes))
        // Catch error if need be
        .catch((err) => res.status(500).json(err))
    );
  }
  /** # DELETE Method   #
  /*  ====================== */
  // 4) Create a delete method

  delete(req, res) {
    console.log(`DELETE note no.${req.params.id}`);
    return this.noteService
      .remove(req.params.id, req.auth.user)
      .then(() => this.noteService.list(req.auth.user))
      .then((notes) => res.json(notes))
      .catch((err) => res.status(500).json(err));
  }
}

module.exports = NoteRouter;
