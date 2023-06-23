const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = Schema({
    email: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    userName: {
        type: String,
    },
});

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
