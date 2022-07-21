const validate = require("../middlewares/validate")
const schemas = require("../validations/User")
const {create, index, login, projectList, resetPassword, update, deleteUser, changePassword, updateProfileImage} = require("../controllers/User")
const express = require("express")
const authenticate = require("../middlewares/authenticate")
const router = express.Router()

router.get("/", index)
router.route("/register").post(validate(schemas.createValidation), create)
router.route("/login").post(validate(schemas.loginValidation), login)
router.route("/").patch(authenticate, validate(schemas.updateValidation), update)
router.route("/projects").get(authenticate, projectList)
router.route("/reset-password").post(validate(schemas.resetPasswordValidation),resetPassword)
router.route("/:id").delete(authenticate, deleteUser)
router.route("/change-password").post(authenticate, validate(schemas.changePasswordValidation), changePassword)
router.route("/update-profile-image").post(authenticate, updateProfileImage)

module.exports = router