const mongoose = require("mongoose");
const logger = require("../scripts/loggers/User");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullName: String,
    password: String,
    email: String,
    profileImage: String,
  },
  { timestamps: true, versionKey: false }
);

UserSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

module.exports = mongoose.model("User", UserSchema);
