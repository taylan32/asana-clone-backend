const express = require("express");
const { create, index, update, deleteProject } = require("../controllers/Projects");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Project");
const router = express.Router();

// validations
// validation middleware

router.route("/").post(authenticate, validate(schemas.createValidation),create);
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), update) 
router.route("/").get(authenticate, index);
router.route("/:id").delete(authenticate, deleteProject)

module.exports = router;
