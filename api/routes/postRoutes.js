const express = require("express");
const multer = require("multer");
const router = express.Router();
const Post = require("../models/Post");
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Yeni bir gönderi eklemek için endpoint
router.post("/add", upload.single('img'), async (req, res) => {
  try {
    const { comment, userId, username, follower_comment } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenemedi." });
    }

    const imgPath = req.file.path.split('uploads\\')[1];

    if (!imgPath || !userId || !username) {
      return res.status(400).json({ message: "Gerekli alanlar eksik." });
    }

    const newPost = new Post({ img: imgPath, comment, userId, username, follower_comment });
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Post ekleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası: Gönderi eklenemedi." });
  }
});

// Tüm gönderileri getirmek için endpoint
router.get("/get-all", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId").sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Gönderileri getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// Belirli bir gönderiyi getirmek için endpoint
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

// Bir gönderiyi güncellemek için endpoint
router.put("/update/:id", upload.single('img'), async (req, res) => {
  const { id } = req.params;
  const { comment, follower_comment } = req.body;
  const imgPath = req.file ? req.file.path.split('uploads\\')[1] : null;

  try {
    const updateData = { comment, follower_comment };
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

// Bir gönderiyi silmek için endpoint
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

// Beğenileri getirmek için endpoint
router.get('/:postId/likes', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Gönderi bulunamadı' });
    }

    const userId = req.user ? req.user._id : null;
    const liked = userId && post.likes.includes(userId);
    const likeCount = post.likes.length;

    res.status(200).json({ liked, likeCount });
  } catch (error) {
    console.error('Beğeni bilgisi alma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası: Beğeni bilgisi alınamadı.' });
  }
});

// Bir gönderiyi beğenmek için endpoint
router.post('/:postId/like', async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    if (!userId) {
      console.error('Kullanıcı kimliği eksik.');
      return res.status(400).json({ message: 'Kullanıcı kimliği eksik.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      console.error('Gönderi bulunamadı:', postId);
      return res.status(404).json({ message: 'Gönderi bulunamadı' });
    }

    const likedIndex = post.likes.indexOf(userId);
    if (likedIndex > -1) {
      post.likes.splice(likedIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    const likeCount = post.likes.length;

    res.status(200).json({ liked: likedIndex === -1, likeCount });
  } catch (error) {
    console.error('Beğeni işlemi hatası:', error);
    res.status(400).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
