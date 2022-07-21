const joi = require("joi")
const Section = require("../models/Section")

const createValidation = joi.object({
    name:joi.string().required().min(3),
    projectId:joi.string().required().min(10)
})

const updateValidation = joi.object({
    name:joi.string().min(3),
    projectId:joi.string().min(10)
})


module.exports = {
    createValidation,
    updateValidation,
}