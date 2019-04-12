const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema({
  title: String,
  creater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isDisabled: { type: Boolean, default: false }
});

module.exports = mongoose.model("Todo", todoSchema);
