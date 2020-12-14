const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.types = require("./type.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);
db.role = require("./role.model.js")(mongoose);

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
