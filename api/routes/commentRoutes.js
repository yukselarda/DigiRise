const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.post('/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Gönderi bulunamadı' });
    }

    post.comments.push({ text: comment });
    await post.save();

    res.status(201).json({ message: 'Yorum eklendi', post });
  } catch (error) {
    console.error('Yorum ekleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası: Yorum eklenemedi.' });
  }
});

module.exports = router;
