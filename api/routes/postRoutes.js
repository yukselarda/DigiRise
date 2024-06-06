const express = require("express");
const multer = require("multer");
const router = express.Router();
const Post = require("../models/Post");
const path = require('path'); 

// Multer ayarları (Depolama klasörü hatası için güncelleme)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/')); // Proje dizinine göre uploads klasörü
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage }); // storage'ı kullanarak upload nesnesi oluşturulur


// Dosya ekleme ( Hata yönetimi ve doğrulama geliştirildi )
router.post("/add", upload.single('img'), async (req, res) => {
  try {
    const { comment, userId, username } = req.body;

    // Dosya yükleme hatası kontrolü
    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenemedi." });
    }
    
    const imgPath = req.file.path.split('api\\')[1];
    console.log("test", imgPath)

    // Gerekli alanların kontrolü
    if (!imgPath || !comment || !userId || !username) {
      return res.status(400).json({ message: "Gerekli alanlar eksik." });
    }

    const newPost = new Post({ img: imgPath, comment, userId, username });
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Post ekleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası: Gönderi eklenemedi." });
  }
});



// Diğer Rotalar

router.get("/get-all", async (req, res) => {
    try {
      const posts = await Post.find().populate("userId").sort({ createdAt: -1 }); // En yeni gönderiler önce gelecek şekilde sıralama
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
