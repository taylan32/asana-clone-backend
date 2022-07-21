const joi = require("joi")

const createValidation = joi.object({
    title:joi.string().required().min(3),
    description:joi.string().min(8),
    assignedTo:joi.string().min(10),
    dueDate:joi.date(),
    statuses:joi.array(),
    sectionId: joi.string().required().min(10),
    projectId:joi.string().required().min(10),
    order:joi.number(),
    isCompleted:joi.boolean(),
    comments: joi.array(),
    media:joi.array(),
    subTasks:joi.array()
})

const updateValidation = joi.object({
    title:joi.string().min(3),
    description:joi.string().min(8),
    assignedTo:joi.string().min(10),
    dueDate:joi.date(),
    statuses:joi.array(),
    sectionId: joi.string().min(10),
    projectId:joi.string().min(10),
    order:joi.number(),
    isCompleted:joi.boolean(),
    comments: joi.array(),
    media:joi.array(),
    subTasks:joi.array()
})

const commentValidation = joi.object({
    comment:joi.string().required().min(5)
})

module.exports = {
    createValidation,
    updateValidation,
    commentValidation
}