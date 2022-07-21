const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require("../scripts/loggers/Task");
const TaskSchema = new Schema(
  {
    title: String,
    description: String,
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    dueDate: Date,
    statuses: [String],
    sectionId: {
      type: mongoose.Types.ObjectId,
      ref: "Section",
    },
    projectId: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    order: Number,
    isCompleted: Boolean,
    comments: [
      {
        comment: String,
        commentedAt:Date,
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    media: [String],
    subTasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

TaskSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

module.exports = mongoose.model("Task", TaskSchema);
