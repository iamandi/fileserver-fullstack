const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const express = require("express");
const router = express.Router();

/////////
// @parameters (URI, authentication_middleware, callback)
// list directories and files at level 1 and NOT the subdirectories in the levels below
/////////
router.get("/*", auth, (req, res) => {
  const userDir = req.user.userId;
  console.log(`userDir = ${userDir}`);
  const homeDir = path.join(__dirname, `../uploads/${userDir}/${req.url}`);

  let response = { items: [] };
  fs.readdir(homeDir, (err, files) => {
    if (err) {
      console.log("err", err);
      res.send(err);
    } else {
      console.log("\nCurrent directory filenames:");
      files.forEach((file) => {
        const dirPath = path.join(homeDir, file);
        const isDirectory = fs.statSync(dirPath).isDirectory();

        if (isDirectory) {
          console.log(`${dirPath}/${file} is directory`);
          response.items.push({ type: "directory", name: file, mime: "" });
        } else {
          console.log(`${dirPath}/${file} is file`);

          const mimeType = mime.contentType(file);
          console.log("mime type", mimeType);
          response.items.push({
            type: "file",
            name: file,
            mime: mimeType,
          });
        }
      });
    }

    console.log("response:", response);
    res.send(response);
  });
});

module.exports = router;
