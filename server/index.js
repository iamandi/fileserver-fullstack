const express = require("express");

const uploads = require("./routes/uploads");
const users = require("./routes/users");
const user = require("./routes/user");
const auth = require("./routes/auth");
const home = require("./routes/home");
const authMiddleware = require("./middleware/auth");

const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const path = require("path");
const app = express();

app.use(express.static("public"));
app.use(
  "/home",
  authMiddleware,
  express.static(path.join(__dirname, "uploads"))
);

app.use(express.json());
app.use(helmet());
app.use(compression());

app.use("/api/auth", auth); // LOGIN
app.use("/api/user", user); // Get logged in user's info
app.use("/api/users", users); // Get all users' info --- for Admin usage
app.use("/upload", uploads); // Upload file (only logged in users)
app.use("/home", home); // List or download your files,

const port = process.env.PORT || config.get("port");
app.listen(port, function () {
  console.log(`Server started on port ${port}...`);
});
