// This notesTemplate uses Handlebars.compile, this means we are leveraging the handlebars cdn which we have on the layout of our page.
// The note template will render out this text area, with the index position of the note as the data-id, the note itself {{ this }} within the text area so it is rendered to the screen.
//We also generate a button for each not, which again has the index position of the note as the data-id. so that if you press the button we will be able to delete the note which the button refers to.
var notesTemplate = Handlebars.compile(
  `
        {{#each notes}}
        <div class="note">
            <span class="input"><textarea data-horse="pony" data-id="{{ this.id }}">{{ this.notes }}</textarea></span>
            <button class="remove btn btn-xs" data-id="{{ this.id }}"><i class = "fa fa-trash" aria-hidden="true"></i></button>
            </div>
            {{/each}}
        `
);

// This function is responsible of re-rendering the page every time we update our notes. It recieves the array of notes and then forces each note (each element within the array) into the notes template, which iterates through the array rendering all the notes to the DOM in the same format.
const reloadNotes = (notes) => {
  // code here
  $("#notes").html(notesTemplate({ notes: notes }));
};

// This function is used and defined to make a message appear on the dom when saving our note.
const beginSaving = (target) => {
  // code here
  $(target).prop("disabled", true);
  $(".saving").show();
};

// This function is used and defined to make a message disappear on the dom after saving our note.
const endSaving = (target) => {
  // code here
  $(target).prop("disabled", true);
  $(".saving").hide();
};

// Document on ready function, when the document has fully loaded we can do everything within this block of code.
$(() => {
  // Initial get request from our client to our server, we are trying to get all of our notes for the user currently logged in, so we can render each note onto the DOM.
  //   axios
  //     .get("/api/notes/")
  //     .then((res) => {
  //       console.log(`Getting notes: ${res.data}`);
  //       reloadNotes(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  // Add an event listener on the add button, such then when we press the button we grab the value from our text box and then send that value to our server in our post request, then we receive the new data from our server and reload all of our notes.
  $("#add").submit((e) => {
    e.preventDefault();
    console.log("add pressed");
    // code here
    var val = $("textarea[name=note]").val();
    if (val === "") {
      return;
    }
    $("textarea[name=note]").val("");
    axios
      .post("/api/info/", {
        note: val,
      })
      .then((res) => {
        reloadNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  });

  // Add an event listener to our div (it has an id of notes) which encapsulates our text-areas, we specify we are targeting the text areas. When we blur (lose focus on the text area), we begin saving our new note (make the message appear on the DOM)
  $("#notes").on("blur", "textarea", (event) => {
    // code here
    beginSaving(event.currentTarget);
    axios
      .put("/api/info/" + $(event.currentTarget).data("id"), {
        note: $(event.currentTarget).val(),
      })
      .then((res) => {
        endSaving(event.currentTarget);
        reloadNotes(res.data);
      })
      .catch((e) => {
        endSaving(event.currentTarget);
        alert(e);
      });
  });

  // Add an event listener onto the buttons that we generate along with each note, we target the class remove and listen for a click event.
  $("#notes").on("click", ".remove", (event) => {
    // show saving message on DOM
    // code here
    beginSaving(event.currentTarget);
    console.log($(event.currentTarget).data("id"));
    axios
      .delete("/api/info/" + $(event.currentTarget).data("id"))
      .then((res) => {
        endSaving(event.currentTarget); // remove saving message from the DOM
        reloadNotes(res.data); // reload the notes on the DOM so that we only render the updated notes
      })
      .catch((e) => {
        endSaving(e.currentTarget);
        alert(e);
      });
  });
});
