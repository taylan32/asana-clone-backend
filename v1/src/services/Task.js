const Task = require("../models/Task");

const insert = (data) => {
  return new Task(data).save();
};

const list = (where) => {
  return Task.find(where || {}).populate({
    path: "assignedTo",
    select: "fullName email profileImage",
  });
};

const modify = (data, id) => {
  return Task.findByIdAndUpdate(id, data, { new: true });
};

const remove = (id) => {
  return Task.findByIdAndDelete(id);
};

const findOne = (where, expand) => {
  if (!expand) return Task.findOne(where);
  return Task.findOne(where)
    .populate({
      path: "userId",
      select: "fullName email profileImage",
    })
    .populate({
      path: "projectId",
      select: "name",
    })
    .populate({
      path: "sectionId",
      select: "name",
    })
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "fullName email profileImage",
      },
    })
    .populate({
      path:"subTasks",
      select:"title description isCompleted assignedTo dueDate order subTasks statuses"
    })
};

module.exports = {
  insert,
  list,
  modify,
  remove,
  findOne,
};
