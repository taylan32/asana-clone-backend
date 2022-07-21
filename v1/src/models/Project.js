const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require('../scripts/loggers/Project')
const ProjectSchema = new Schema(
  {
    name: {
      type: String
    },
    userId: {
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
  },
  { timestamps: true, versionKey: false }
);


ProjectSchema.post("save", (doc) => {
  logger.log({
    level:"info",
    message:doc
  })
})
module.exports = mongoose.model("Project", ProjectSchema);
