const User = require("../models/User.js");
const express = require("express");
const router = express.Router();

//! get all User
router.get("/get-all", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/get-by-username", async (req, res) => {
  let username = req.query.username;

  try {
    if (username) {
      if (typeof username !== 'string') {
        username = String(username);
      }

      const user = await User.findOne({ username: { $regex: username, $options: "i" } });

      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
      }

      res.status(200).json(user);
    } else {
      const users = await User.find();
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});



module.exports = router;