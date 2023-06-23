const express = require("express");
const router = new express.Router();

const register = require("../controllers/signup");
const login = require("../controllers/login");

router.post("/register", register);
router.post("/signIn", login);

module.exports = router;
