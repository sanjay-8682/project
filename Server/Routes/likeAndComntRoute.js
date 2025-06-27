import express from 'express'
import authMiddleware from '../Middleware/authMiddleware.js';
import { addComment, deleteComment, toggleLike } from '../Controller/likeAndComnt.js';


const router = express.Router();

//❤️ Route
router.post('/like/:postId', authMiddleware, toggleLike);


//💬 Route
router.post('/comment/:postId', authMiddleware, addComment);
router.delete('/comment/:postId/delete/:commentId', authMiddleware, deleteComment);



export default router