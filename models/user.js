const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  accessCode: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  phoneNumber: String,
  password: String,
  why: String,
  message: String,
  linkedin: String,
  // projects : [{ type: Schema.Types.ObjectId, ref: "Project", required: false }],
  type: { type: String, default: "member" },
});

module.exports = mongoose.model("User", UserSchema);