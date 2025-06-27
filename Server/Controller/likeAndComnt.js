import Post from "../Models/postSchema.js";


// 👍 Toggle Like (Like or Unlike)
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("userId", "username profilePicture")
      .populate("likes", "username profilePicture") // likes just need userId or profile info
      .populate("comments.userId", "username profilePic");

    return res.status(200).json(updatedPost );
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", error: err.message });
  }
};







// ➕ Add a comment
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const user = req.user;

    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      userId: user._id,
      username: user.username,
      text,
    };

    post.comments.push(comment);
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("userId", "username profilePicture")
      .populate("likes", "username profilePicture")
      .populate("comments.userId", "username profilePicture");

    return res.status(201).json( updatedPost );
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};





// 📥 Get all comments of a post


export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const user = req.user;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("userId", "username profilePicture")
      .populate("likes", "username profilePicture")
      .populate("comments.userId", "username profilePic");

    return res.status(200).json(updatedPost );
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
};




