const express = require("express");
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const e = require("express");

//Route -1 Get all notes /api/notes/fetchallnotes - login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("internal server error");
  }
});

//Route -2 Add a note /api/notes/addnote - login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const notes = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await notes.save();
      res.send(savedNote);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("internal server error");
    }
  }
);

//route 3 -  update a note /api/notes/updatenote - login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }
    let notes = await Note.findById(req.params.id);
    if (!notes) {
      return res.status(400).send("User id not match");
    }
    if (notes.user.toString() != req.user.id) {
      return res.status(400).send("Acces Denied");
    }
    notes = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Internal server error");
  }
});
//route 4 -  delete a note /api/notes/deletenote/:id - login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let notes = await Note.findById(req.params.id);
    if (!notes) {
      return res.status(400).send("Notes not found");
    }
    if (notes.user.toString() !== req.user.id) {
      return res.status(500).send("User not found");
    }
    notes = await Note.findByIdAndDelete(req.params.id);
    res.json("Note has been deleted");
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Internal status error");
  }
});

module.exports = router;
