const User = require("../models/User");

const insert = (userData) => {
  const user = new User(userData);
  return user.save();
};

const list = () => {
  return User.find({});
};

const loginUser = (loginData) => {
  return User.findOne(loginData);
};

const modify = (where, updatedData) => {
    // filtering the information over incoming data. It is already handled by joi
  // const updateData = Object.keys(data).reduce((obj, key) => {
  //   if (key != "password") {
  //     obj[key] = data[key];
  //   }
  //   return obj;
  // }, {});
  return User.findOneAndUpdate(where, updatedData, { new: true });
};

const remove = (userId) => {
  return User.findByIdAndDelete(userId)
}

module.exports = {
  insert,
  list,
  loginUser,
  modify,
  remove
};
