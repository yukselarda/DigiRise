const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

const upload = multer({ storage });

//! register
router.post("/register", upload.single('img'), async (req, res) => {
    try {
        const { username, email, password, customername } = req.body;
        const img = req.file ? req.file.path : null;

        // Kullanıcı adı ve şifre kontrolü
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Bu kullanıcı adı zaten mevcut. Lütfen farklı bir isim kullanın.' });
        }

        // Yeni kullanıcı oluşturma
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            customername,
            password: hashedPassword, // Plain text parolayı hashlemek
            img,
        });
        await newUser.save();
        res.status(200).json("Yeni Hesap Oluşturuldu!");
    } catch (error) {
        res.status(400).json({ error: 'Hesap oluşturulurken bir hata oluştu.' });
    }
});

//! login
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "Hatalı Bir Bilgi Girdiniz!" }); 
        }

        // Parolayı kontrol et
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(403).json({ error: "Hatalı Bir Bilgi Girdiniz!" });
        }

        // Başarılı giriş
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Giriş yapılırken bir hata oluştu.' });
    }
});

module.exports = router;