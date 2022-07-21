const joi = require("joi");

const createValidation = joi.object({
  fullName: joi.string().required().min(3),
  password: joi.string().required().min(8),
  email: joi.string().required().email().min(8),
});

const loginValidation = joi.object({
  email: joi.string().required().email().min(8),
  password: joi.string().required().min(8),
});

const resetPasswordValidation = joi.object({
  email: joi.string().required().email().min(8),
});

const updateValidation = joi.object({
    fullName: joi.string().min(3),
    email: joi.string().email().min(8),
})

const changePasswordValidation = joi.object({
  password: joi.string().required().min(8),
})

module.exports = {
  createValidation,
  loginValidation,
  resetPasswordValidation,
  updateValidation,
  changePasswordValidation
};
