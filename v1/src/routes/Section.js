const express = require("express")
const router = express.Router()
const validate = require("../middlewares/validate")
const authentication = require("../middlewares/authenticate")
const schemas = require("../validations/Section")
const { index, create, update, deleteSection } = require("../controllers/Section")


router.route("/:projectId").get(authentication,index)
router.route("/").post(authentication ,validate(schemas.createValidation), create)
router.route("/:id").patch(authentication, validate(schemas.updateValidation), update)
router.route("/:id").delete(authentication, deleteSection)

module.exports = router