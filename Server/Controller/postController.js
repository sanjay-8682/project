  import Post from "../Models/postSchema.js";

  export const createPost = async (req, res) => {
    try {
      const { title, caption, image } = req.body;

      // ✅ Make sure authMiddleware sets req.user from JWT in cookie
      const userId = req.user?._id;

      console.log("💬 Incoming:", { userId, title, caption, image });

      if (!userId || !title || !caption) {
        return res.status(400).json({ message: "userId, title, and caption are required" });
      }

      // Optional: Prevent duplicate titles per user (can skip if not needed)
      const existingPost = await Post.findOne({ title, userId });
      if (existingPost) {
        return res.status(400).json({ message: "Post title already exists" });
      }

      const newPost = new Post({ userId, title, caption, image });
      await newPost.save();

      res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      console.error("❌ Create Post Error:", error.message);
      res.status(500).json({ message: "Failed to create post: " + error.message });
    }
  };

  export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const posts = await Post.find({ userId }).sort({ _id: -1 }); // latest first
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};



export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username profilePicture")
      .populate('likes', 'username profilePicture') // for post author
      .populate("comments.userId", "username profilePicture")
      
  .sort({ createdAt: -1 });
      

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const userId = req.user?._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.userId || post.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ Check for duplicate title (excluding current post)
    const existingPost = await Post.findOne({
      userId,
      title: req.body.title,
      _id: { $ne: postId },
    });

    if (existingPost) {
      return res.status(400).json({ message: "Title already exists" });
    }

    // Proceed with update
    post.title = req.body.title || post.title;
    post.caption = req.body.caption || post.caption;
    post.image = req.body.image || post.image;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("❌ Update Post Error:", error.message);
    res.status(500).json({ message: "Failed to update post: " + error.message });
  }
};
  


export const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted", postId });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post: " + error.message });
  }
};





