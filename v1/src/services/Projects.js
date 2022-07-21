const Project = require("../models/Project");

const insert = (projectData) => {
  const project = new Project(projectData);
  return project.save();
};

const list = (where) => {
  return Project.find(where || {}).populate({
    path: "userId",
    select: "email fullName profileImage",
  });
};

const modify = (data, id) => {
  return Project.findByIdAndUpdate(id, data, { new: true });
};

const remove = (projectId) => {
  return Project.findByIdAndDelete(projectId);
};

module.exports = {
  insert,
  list,
  modify,
  remove,
};
