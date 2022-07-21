const express = require("express");
const router = express.Router();
const projectRoute = require("./Projects");
const userRoute = require("./User");
const sectionRoute = require("./Section")
const taskRoute = require("./Task")

router.use("/projects", projectRoute);
router.use("/users", userRoute);
router.use("/sections", sectionRoute)
router.use("/tasks", taskRoute)

module.exports = router;
