const express = require("express")
const router = express.Router()
const authenticate = require("../middlewares/authenticate")
const validate = require("../middlewares/validate")
const schemas =  require("../validations/Task")
const  {create, update, deleteTask, addComment, deleteComment, addSubTask, fetchTask} = require("../controllers/Task")

router.route("/").post(authenticate, validate(schemas.createValidation), create),
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), update)
router.route("/:id").delete(authenticate, deleteTask)

router.route("/:id/add-comment").post(authenticate, validate(schemas.commentValidation),addComment)
router.route("/:id/:commentId").delete(authenticate, deleteComment)

router.route("/:id/add-sub-task").post(authenticate, validate(schemas.createValidation), addSubTask)
router.route("/:id").get(authenticate, fetchTask)

module.exports = router