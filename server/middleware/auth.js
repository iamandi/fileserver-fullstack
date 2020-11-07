const jwt = require("jsonwebtoken");

/////////
// Middleware for validating JWT token
/////////
module.exports = (req, res, next) => {
  const bearerHeader = req.header("Authorization");

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];

    try {
      const payload = jwt.verify(token, "jwtPrivateKey");
      req.user = payload;
      next();
    } catch (err) {
      res.status(400).send({ error: "Invalid token." });
    }
  } else {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }
};
