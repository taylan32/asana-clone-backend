const Section = require("../models/Section");

const list = (where) => {
  return Section.find(where || {})
    .populate({
      path: "userId",
      select: "fullName email profileImage",
    })
    .populate({
      path: "projectId",
      select: "name",
    });
};

const insert = (sectionData) => {
  const section = new Section(sectionData);
  return section.save();
};
const modify = (data, id) => {
  return Section.findByIdAndUpdate(id, data, { new: true });
};

const remove = (id) => {
  return Section.findByIdAndDelete(id);
};

module.exports = {
  list,
  insert,
  modify,
  remove,
};
