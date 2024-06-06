const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

//! register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, customername } = req.body;

        const existingCustomername = await User.findOne({ customername });
        const existingPassword = await User.findOne({ password: await bcrypt.hash(password, 10) });

        if (existingCustomername) {
            return res.status(400).json({ error: 'Bu kullanıcı adı zaten mevcut. Lütfen farklı bir isim kullanın.' });
        }

        if (existingPassword) {
            return res.status(400).json({ error: 'Bu şifre zaten kullanılıyor. Lütfen farklı bir şifre kullanın.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            customername,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json("Yeni Hesap Oluşturuldu!");
    } catch (error) {
        res.status(400).json(error);
    }
});

//! singup
router.post("/singup", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).send({ error: "Kişi Bulunamadı!" }); 
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {
            res.status(403).json("Invalid password!");
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;
