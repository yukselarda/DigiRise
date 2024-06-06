const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true  
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { type: String, required: true },
  customername: { type: String },
  img: { type: String }, 
}, { timestamps: true });

const User = mongoose.model("User", UserSchema); 
module.exports = User;
