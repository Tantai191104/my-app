const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const teamSchema = new Schema(
  {
    teamName: {
      type: String,
    },
  },
  { timestamps: true }
);
const Teams = mongoose.model("Teams", teamSchema);
module.exports = Teams;
