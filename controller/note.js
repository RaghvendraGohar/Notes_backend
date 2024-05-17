import Note from "../models/notes.js";

export const createNotes = async (req, res) => {
  try {
    const currentId = req.currentId;

    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        errorMessage: "Bad yha pr request",
      });
    }

    const notesDetails = new Note({
      description,
      refUserId: currentId,
    });

    await notesDetails.save();
    res.json({ message: "note created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

export const getAllNotesById = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId)
    const userData = await Note.find({refUserId: userId });
    console.log(userData)
    res.json(userData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};
