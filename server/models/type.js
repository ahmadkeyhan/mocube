var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var typeSchema = new Schema({
  title: String,
  subtitle: String,
  avatar: String,
  color: String,
  link: String
});

var type = mongoose.model("type", typeSchema);
module.exports = type;
