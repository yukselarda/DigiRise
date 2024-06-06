const express = require("express");
const multer = require("multer");
const router = express.Router();
const Post = require("../models/Post");

// Multer ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

router.post("/add", upload.single('img'), async (req, res) => {
    const { comment } = req.body;
    const imgPath = req.file.path;

    if (!imgPath || !comment) {
        return res.status(400).json({ message: "Gerekli alanlar eksik" });
    }

    try {
        const newPost = new Post({ img: imgPath, comment });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

router.get("/get-all", async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Gönderi bulunamadı" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/update/:id", upload.single('img'), async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const imgPath = req.file ? req.file.path : null;

    try {
        const updateData = { comment };
        if (imgPath) {
            updateData.img = imgPath;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: "Gönderi bulunamadı" });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Gönderi bulunamadı" });
        }
        res.status(200).json({ message: "Gönderi silindi" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
