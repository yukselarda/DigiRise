const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        customername: { type: String, required: true },
        img: { type: Object, required: true },
    },
    { timestamps: true }
);

const User = mongoose.model("users", UserSchema);
module.exports = User;