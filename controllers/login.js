const generateToken = require("../utilss/generatetoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.json({ message: "No user found" });
    else {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const token = await generateToken(user);
        return res.json({
          access_token: token,
          message: "Login successful",
        });
      } else {
        return res.json({
          message: "Invalid Password! Please try again",
        });
      }
    }
  } catch (err) {
    res.json({ message: "internal server error" });
    // throw new Error("internal server error");
  }
};

// function generatePassword(passwordLength) {
// 	const numberChars = "0123456789";
// 	const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// 	const lowerChars = "abcdefghijklmnopqrstuvwxyz";
//     const symbols = "@#$%&*!"
// 	const allChars = numberChars + upperChars + lowerChars + symbols
// 	var randomPasswordArray = Array(passwordLength);
//     randomPasswordArray[0] = numberChars;
//     randomPasswordArray[1] = upperChars;
//     randomPasswordArray[2] = lowerChars;
//     randomPasswordArray[3] = symbols

//   randomPasswordArray = randomPasswordArray.fill(allChars, 4);
//   return shuffleArray(randomPasswordArray.map(function(x) {
//     return x[Math.floor(Math.random() * x.length)]
//   })).join('');
// }

// function shuffleArray(array) {
//   for (var i = array.length - 1; i > 0; i--) {
//     var j = Math.floor(Math.random() * (i + 1));
//     var temp = array[i];
//     array[i] = array[j];
//     array[j] = temp;
//   }
//   return array;
// }
// console.log(generatePassword(8))

// {s: a.b.replace(/^.{5}/gmi, (match) => match.toUpperCase())}

module.exports = login;
