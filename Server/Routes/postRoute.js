import express from 'express'
import { createPost, deletePost, getAllPosts,  getUserPosts, updatePost } from '../Controller/postController.js'
import authMiddleware from '../Middleware/authMiddleware.js'


const router = express.Router()


router.post('/addpost', authMiddleware, createPost );
router.get('/myposts', authMiddleware, getUserPosts);
router.get('/allpost', authMiddleware, getAllPosts);
router.put('/update/:id', authMiddleware, updatePost);
router.delete('/delete/:id', authMiddleware, deletePost);



export default router


