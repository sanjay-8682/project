import React, { useState, useRef } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Typography,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  createPostStart,
  createPostSuccess,
  createPostFailure,
  resetCreatePost,
} from '../redux/user/postSlice.js';

export const AddPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userPost);

  const [postData, setPostData] = useState({ title: '', caption: '' });
  const [postImage, setPostImage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPostImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createPostStart());
   
    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const res = await axios.post(
       `${baseURL}/userpost/addpost`,
        { ...postData, image: postImage },
        { withCredentials: true }
      );
      dispatch(createPostSuccess(res.data.post));
      setPostData({ title: '', caption: '' });
      setPostImage('');
      setShowSuccess(true);

      setTimeout(() => {
        dispatch(resetCreatePost());
        navigate('/profile'); // 🔁 Redirect to Profile Page
      }, 1500);
    } catch (error) {
      const msg = error.response?.data?.message || 'Post failed';
      dispatch(createPostFailure(msg));
    }
  };

  return (
    <Box display="flex">
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create a Post
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {showSuccess && <Alert severity="success" sx={{ mb: 2 }}>Post created!</Alert>}

          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
            />

            <Box textAlign="center" mb={2}>
              <IconButton onClick={() => fileInputRef.current.click()}>
                {postImage ? (
                  <Avatar
                    src={postImage}
                    variant="rounded"
                    sx={{ width: 100, height: 100 }}
                  />
                ) : (
                  <ImageIcon fontSize="large" />
                )}
              </IconButton>
            </Box>

            <TextField
              name="title"
              label="Title"
              value={postData.title}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              name="caption"
              label="Caption"
              value={postData.caption}
              onChange={handleInputChange}
              fullWidth
              required
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={20} /> : 'Post'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};
