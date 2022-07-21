const express = require("express");
const fileUpload = require("express-fileupload")
const helmet = require("helmet");
const config = require("./config/index");
const routers = require("./routes/index");
const loaders = require("./loaders");
const cors = require("cors");
const events = require("./scripts/events")
const path = require("path")

config();
loaders();
events()

const app = express();
app.use("/api/uploads", express.static(path.join(__dirname, "./", "uploads")))
app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);
app.use(express.json());
app.use(helmet());
app.use(fileUpload())

app.listen(process.env.APP_PORT, () => {
  console.log("Server running");
  app.use("/api", routers);
});
