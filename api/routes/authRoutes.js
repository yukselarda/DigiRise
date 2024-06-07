const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const nodemailer = require('nodemailer');
require('dotenv/config');

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

function isCodeExpired(timestamp) {
    const expirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    return Date.now() - timestamp > expirationTime;
}

async function sendVerificationEmail(email, code) {
    let transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
            user: "muhammedarda.yuksel@mrevyap.k12.tr",
            pass: "gaS00908"
        }
    });

    let info = await transporter.sendMail({
        from: "muhammedarda.yuksel@mrevyap.k12.tr",
        to: email,
        subject: "Verification Code",
        text: `Your verification code is: ${code}`
    });

    console.log("Email sent: %s", info.messageId);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Register route
router.post("/register", upload.single('img'), async (req, res) => {
    try {
        const { username, email, password, customername } = req.body;
        const img = req.file ? req.file.path : null;

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already exists. Please choose a different one.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            customername,
            password: hashedPassword,
            img,
        });
        await newUser.save();
        res.status(200).json("New account created!");
    } catch (error) {
        res.status(400).json({ error: 'Error creating account.' });
    }
});

// Update route
router.put("/update/:currentUsername", upload.single('img'), async (req, res) => {
    try {
        const { newUsername, email, customername, password, verificationCode } = req.body;
        const updatedUser = {};

        if (email && !validateEmail(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }
        if (password && !validatePassword(password)) {
            return res.status(400).json({ error: "Password must be at least 6 characters." });
        }

        const user = await User.findOne({ username: req.params.currentUsername });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.verificationCode !== parseInt(verificationCode) || isCodeExpired(user.verificationCodeTimestamp)) {
            return res.status(403).json({ error: "Invalid or expired verification code." });
        }

        if (newUsername && newUsername !== req.params.currentUsername) {
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return res.status(400).json({ error: "Username already exists." });
            }
            updatedUser.username = newUsername;
        }
        if (email) updatedUser.email = email;
        if (customername) updatedUser.customername = customername;
        if (req.file) updatedUser.img = req.file.path;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedUser.password = await bcrypt.hash(password, salt);
        }

        const updated = await User.findOneAndUpdate(
            { username: req.params.currentUsername },
            { $set: updatedUser },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating user." });
    }
});

// Send verification code route
router.post('/send-verification-code', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeTimestamp = Date.now();
        await user.save();

        await sendVerificationEmail(user.email, verificationCode);
        res.status(200).json({ message: 'Verification code sent.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error sending verification code.' });
    }
});

// Login route
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "Invalid username or password." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(403).json({ error: "Invalid username or password." });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Error logging in.' });
    }
});

module.exports = router;


