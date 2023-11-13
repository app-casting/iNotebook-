const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { check, validationResult } = require("express-validator");

// ROUTE 1: Get all the notes Using:GET "api/notes/fetchAllNotes"
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2:Add a new note using:POST "api/notes/getuser"
router.post(
  "/addnote",
  fetchUser,
  [
    check("title", "Enter a valid title").isLength({ min: 5 }),
    check(
      "description",
      "description length should be a minimum of 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user:req.user.id
      });
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// ROUTE 3:update the existing note using:PUT "api/notes/updateNote/:id"

router.put("/updateNote/:id", fetchUser, async (req, res) => {
  //create a newNote object
  const { title, description, tag } = req.body;

  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  // find the existing note to update and update it 
  let note=  await Note.findById(req.params.id);
  if(!note){
    res.status(400).send("User not found")
  }
  if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed");
  }
  note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
  res.json({note})
});

// ROUTE 4 :Deleting the existing note using: DELETE "api/notes/deleteNote/:id"

router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  
  // Verify that the user is deleting his note only
try {
  
  let note=  await Note.findById(req.params.id);
  if(!note){
    res.status(400).send("User not found")
  }

  // Allow deletion only if the user owns the note
  if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed");
  }
  note = await Note.findByIdAndDelete(req.params.id)
  res.json({"Success":"Note has been deleted sucessfully", note:note})
} catch (error) {
  console.log(error.message);
  res.status(500).send("Internal Server Error");
}
});
module.exports = router;
