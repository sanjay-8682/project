// ✅ DashProfile with Error Snackbar for post and user update errors

import React, { useState, useRef, useEffect } from 'react';
import {
  Avatar,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert as MuiAlert,
  IconButton,
  Box,
  TextField,
  Menu,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserPostsStart,
  fetchUserPostsSuccess,
  fetchUserPostsFailure,
  updatePostStart,
  updatePostSuccess,
  updatePostFailure,
  deletePostStart,
  deletePostSuccess,
  deletePostFailure,
  clearError as clearPostError
} from '../redux/user/postSlice.js';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  logout,
  clearError as clearUserError
} from '../redux/user/userSlice';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, error: userError } = useSelector((state) => state.user);
  const { userPosts = [], loading: postLoading, error: postError } = useSelector((state) => state.userPost);

  const [editData, setEditData] = useState({});
  const [profileImage, setProfileImage] = useState('');
  const fileInputRef = useRef(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openEditPostDialog, setOpenEditPostDialog] = useState(false);
  const [editPostData, setEditPostData] = useState({ title: '', caption: '', image: '' });
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const editPostImageInputRef = useRef(null);

  useEffect(() => {
    if (currentUser?.user) {
      const u = currentUser.user;
      setEditData({
        username: u.username || '',
        email: u.email || '',
        profilePicture: u.profilePicture || '',
        password: '',
      });
      setProfileImage(u.profilePicture || '');
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      dispatch(fetchUserPostsStart());

      const baseURL = import.meta.env.VITE_API_URL;

      try {
        const res = await axios.get(`${baseURL}/userpost/myposts`, {
          withCredentials: true,
        });
        const payload = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.posts)
          ? res.data.posts
          : [];
        dispatch(fetchUserPostsSuccess(payload));
      } catch (err) {
        dispatch(fetchUserPostsFailure('Failed to fetch posts'));
      }
    };
    fetchMyPosts();
  }, [dispatch]);

  useEffect(() => {
    if (postError || userError) {
      setErrorMessage(postError || userError);
      setOpenErrorSnackbar(true);
    }
  }, [postError, userError]);

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
    dispatch(clearUserError());
    dispatch(clearPostError());
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setEditData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPostImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPostData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    dispatch(updateStart());

    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const body = { ...editData };
      if (!body.password) delete body.password;
      const res = await axios.put(`${baseURL}/user/updateuser/${currentUser.user._id}`, body, {
        withCredentials: true,
      });
      dispatch(updateSuccess({ message: res.data.message, user: res.data.data }));
      setOpenSnackbar(true);
      setOpenEditDialog(false);
    } catch (err) {
      dispatch(updateFailure(err.response?.data?.message || err.message));
    }
  };

  const handleDeleteAccount = async () => {

    const baseURL = import.meta.env.VITE_API_URL;

    try {
      await axios.delete(`${baseURL}/user/delete/${currentUser.user._id}`, {
        withCredentials: true,
      });
      dispatch(logout());
      window.location.href = '/';
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error deleting account');
      setOpenErrorSnackbar(true);
    }
  };

  const handleMenuClick = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = async () => {
    handleMenuClose();
    if (!selectedPost?._id) return;
    dispatch(deletePostStart());

    const baseURL = import.meta.env.VITE_API_URL;

    try {
      await axios.delete(`${baseURL}/userpost/delete/${selectedPost._id}`, {
        withCredentials: true,
      });
      dispatch(deletePostSuccess(selectedPost._id));
    } catch (err) {
      dispatch(deletePostFailure(err.response?.data?.message || 'Delete failed'));
    }
  };

  const handleEditPostOpen = () => {
    if (!selectedPost) return;
    setEditPostData({ title: selectedPost.title, caption: selectedPost.caption, image: selectedPost.image });
    setOpenEditPostDialog(true);
    handleMenuClose();
  };

  const handleEditPostSubmit = async () => {
    if (!selectedPost?._id) return;
    dispatch(updatePostStart());

    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const res = await axios.put(`${baseURL}/userpost/update/${selectedPost._id}`, editPostData, {
        withCredentials: true,
      });
      dispatch(updatePostSuccess(res.data));
      setOpenEditPostDialog(false);
    } catch (err) {
      dispatch(updatePostFailure(err.response?.data?.message || 'Update failed'));
    }
  };

  if (!currentUser?.user) return <Typography align="center">Loading...</Typography>;

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} sm="auto">
          <Avatar src={profileImage} sx={{ width: 100, height: 100 }} />
        </Grid>
        <Grid item xs={12} sm>
          <Typography variant="h5">{editData.username}</Typography>
          <Typography color="text.secondary">{editData.email}</Typography>
          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            <Button variant="contained" onClick={() => setOpenEditDialog(true)}>Edit Profile</Button>
            <Button variant="outlined" color="error" onClick={() => setShowDeleteDialog(true)}>Delete</Button>
          </Box>
        </Grid>
      </Grid>

      <Box mt={5}>
        <Typography variant="h6" gutterBottom>Posts</Typography>
        {postLoading ? (
          <Typography>Loading posts...</Typography>
        ) : postError ? (
          <Typography color="error">{postError}</Typography>
        ) : userPosts.length === 0 ? (
          <Typography>No posts found.</Typography>
        ) : (
          <Grid container spacing={2}>
            {userPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <Box sx={{ position: 'relative' }}>
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
                    onClick={(e) => handleMenuClick(e, post)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Box
                    component="img"
                    src={post.image}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditPostOpen}>Edit</MenuItem>
        <MenuItem onClick={handleDeletePost} sx={{ color: 'red' }}>Delete</MenuItem>
      </Menu>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Box textAlign="center">
              <input type="file" accept="image/*" ref={fileInputRef} hidden onChange={handleImageChange} />
              <IconButton onClick={() => fileInputRef.current.click()}>
                <Avatar src={profileImage} sx={{ width: 80, height: 80, mx: 'auto' }} />
                <CameraAltIcon fontSize="small" sx={{ ml: -2, mt: 6 }} />
              </IconButton>
            </Box>
            <TextField label="Username" id="username" value={editData.username} onChange={handleChange} fullWidth />
            <TextField label="Email" id="email" value={editData.email} onChange={handleChange} fullWidth />
            <TextField label="Password" id="password" type="password" value={editData.password} onChange={handleChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditPostDialog} onClose={() => setOpenEditPostDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Title" value={editPostData.title} onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })} fullWidth />
            <TextField label="Caption" value={editPostData.caption} onChange={(e) => setEditPostData({ ...editPostData, caption: e.target.value })} fullWidth multiline rows={3} />
            <Box>
              <input type="file" accept="image/*" ref={editPostImageInputRef} hidden onChange={handleEditPostImageChange} />
              <Button onClick={() => editPostImageInputRef.current.click()} variant="outlined">Upload Image</Button>
              {editPostData.image && (
                <Box component="img" src={editPostData.image} alt="Preview" sx={{ width: '100%', mt: 1, borderRadius: 1 }} />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditPostDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditPostSubmit}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Account?</DialogTitle>
        <DialogContent>This action is irreversible.</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteAccount}>I'm Sure</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">Profile updated!</Alert>
      </Snackbar>

      <Snackbar open={openErrorSnackbar} autoHideDuration={4000} onClose={handleCloseErrorSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" onClose={handleCloseErrorSnackbar}>{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
};
