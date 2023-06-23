const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1];
    if (token == null) {
      return res.status(403).json({ message: "No Autherization Header" });
    }
    jwt.verify(token, "secret", (error, user) => {
      if (error) {
        return res.status(401).json(error);
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Please Authenticate" });
  }
};

module.exports = { authentication };
