const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  limits: function (req, file, cb) {
    cb(null, "25 * 1024 * 1024");
  },
});
const upload = multer({ storage: storage });

router.get("/", auth, (req, res) => {
  const uploadPage = `
  <html>
    <body>   
      <form id='uploadForm' action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="avatar" />
        <input type='submit' value='Upload' />
      </form>
    </body>
  </html>`;
  res.send(uploadPage);
});

router.post(
  "/",
  auth,
  //[
  // Order of these middleware matters.
  // "upload" should come before other "validate" because we have to handle
  // multi-part form data. Once the upload middleware from multer applied,
  // request.body will be populated and we can validate it. This means
  // if the request is invalid, we'll end up with one or more image files
  // stored in the uploads folder. We'll need to clean up this folder
  // using a separate process.
  // auth,
  //upload.array("images", config.get("maxImageCount")),
  //validateWith(schema),
  //validateCategoryId,
  //imageResize,
  //],
  upload.single("avatar"),
  (req, res) => {
    const listing = {};
    listing.images = [req.file.originalname]; //req.images.map((fileName) => ({ fileName: fileName }));
    if (req.body.location) listing.location = JSON.parse(req.body.location);
    if (req.user) listing.userId = req.user.userId;

    //store.addListing(listing);

    res.status(201).send(listing);
  }
);

module.exports = router;
