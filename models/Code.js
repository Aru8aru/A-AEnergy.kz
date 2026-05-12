import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  email: String,
  code: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Code", codeSchema);