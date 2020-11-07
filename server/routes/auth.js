const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");

const schema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string(),
}).with("username", "password");

/////////
// @parameters (URI, form validation, callback)
// It takes email and password and responds with jwt if validation successful
/////////
router.post("/", validateWith(schema), (req, res) => {
  const { email, password } = req.body;
  const user = usersStore.getUserByEmail(email);
  if (!user || user.password !== password)
    return res.status(400).send({ error: "Invalid email or password." });

  const token = jwt.sign({ userId: user.id }, "jwtPrivateKey");
  res.send(token);
});

module.exports = router;
