const jwt = require("jsonwebtoken");
const Token = require("../models/refreshToken");
const generateToken = async (user) => {
  try {
    const token = await jwt.sign({ _id: user._id.toString() }, "secret", {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { _id: user._id.toString() },
      "refreshToken",
      { expiresIn: "5d" }
    );
    const userToken = await Token.findOne({ _id: user._id.toString() });
    if (userToken) await userToken.remove(); // remove matched document with old refresh token
    await new Token({
      _id: user._id.toString(),
      refreshToken: refreshToken,
    }).save(); // create new document with new refresh token
    // return new Promise.resolve(token);
    return token;
  } catch (error) {
    return error;
    // return error;
  }
};

module.exports = generateToken;
