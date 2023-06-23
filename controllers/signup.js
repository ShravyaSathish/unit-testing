const User = require("../models/user");
const generateToken = require("../utilss/generatetoken");
const register = async (req, res) => {
    try {
        const { email, mobileNumber, password } = req.body;
        // const existingNumber = User.findOne(mobileNumber);
        // const existingemail = User.findOne(email);
        // const existingpassword = User.findOne(password);
        // if (existingNumber || existingemail || existingpassword) {
        //     res.status(400).send({ message: "User Already Exists" });
        // }

        const newUser = await new User({
            email: email,
            mobileNumber: mobileNumber,
            password: password,
        });
        const user = await newUser.save();
        const token = await generateToken(user);
        const result = [];
        result.push("Registered Successfully");
        return res.status(200).send({ message: result, access_token: token });
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: "Unable to Register" });
    }
};

module.exports = register;
