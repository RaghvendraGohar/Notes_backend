import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    description :{
        type : String,
        required: true
    },
    refUserId: {
        type: mongoose.ObjectId,
    }
},{timestamps:{createdAt:"createdAt"}})

const Note = mongoose.model("Note",notesSchema);

export default Note;