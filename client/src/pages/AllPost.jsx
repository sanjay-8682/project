import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Stack,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Collapse,
  Box,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  fetchAllPostsStart,
  fetchAllPostsSuccess,
  fetchAllPostsFailure,
  likePostStart,
  likePostSuccess,
  likePostFailure,
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  deleteCommentFailure,
} from '../redux/user/postSlice';

export const AllPost = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { allposts, loading, error } = useSelector((state) => state.userPost);
  const { currentUser } = useSelector((state) => state.user);

  const [commentTexts, setCommentTexts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [likesDialog, setLikesDialog] = useState({ open: false, users: [] });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchAllPost = async () => {
      dispatch(fetchAllPostsStart());

      const baseURL = import.meta.env.VITE_API_URL;

      try {
        const { data } = await axios.get(`${baseURL}/userpost/allpost`, {
          withCredentials: true,
        });
        dispatch(fetchAllPostsSuccess(data));
      } catch (err) {
        dispatch(fetchAllPostsFailure(err?.response?.data?.message || 'Failed to fetch posts'));
      }
    };
    fetchAllPost();
  }, [dispatch, location.pathname]);

  const handleLike = async (postId) => {
    dispatch(likePostStart());

    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const { data } = await axios.post(`${baseURL}/interact/like/${postId}`, {}, { withCredentials: true });
      dispatch(likePostSuccess(data));
    } catch (err) {
      dispatch(likePostFailure(err?.response?.data?.message || 'Failed to like post'));
    }
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    dispatch(addCommentStart());

    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const { data } = await axios.post(`${baseURL}/interact/comment/${postId}`, { text }, { withCredentials: true });
      dispatch(addCommentSuccess(data));
      setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      dispatch(addCommentFailure(err?.response?.data?.message || 'Failed to add comment'));
    }
  };

  const handleCommentDelete = async (postId, commentId) => {
    dispatch(deleteCommentStart());

    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const { data } = await axios.delete(`${baseURL}/interact/comment/${postId}/delete/${commentId}`, {
        withCredentials: true,
      });
      dispatch(deleteCommentSuccess(data));
    } catch (err) {
      dispatch(deleteCommentFailure(err?.response?.data?.message || 'Failed to delete comment'));
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const openLikesDialog = (likes) => {
    setLikesDialog({ open: true, users: likes });
  };

  const closeLikesDialog = () => {
    setLikesDialog({ open: false, users: [] });
  };

  const filteredPosts = allposts.filter((post) =>
    post.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh', // or 100vh for full screen
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: '100%', px: { xs: 1, sm: 2, md: 4 }, py: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <TextField
          placeholder="Search by username"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {filteredPosts.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>
            No matching posts found.
          </Typography>
        ) : (
          filteredPosts.map((post) => {
            const isLiked = post.likes?.some((likeUser) =>
              typeof likeUser === 'string'
                ? likeUser === currentUser?.user?._id
                : likeUser._id === currentUser?.user?._id
            );

            const postComments = post.comments || [];
            const isExpanded = expandedComments[post._id];

            const CaptionWithReadMore = ({ caption }) => {
              const [expanded, setExpanded] = useState(false);

              return (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: expanded ? 'none' : 1,
                      WebkitBoxOrient: 'vertical',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {caption}
                  </Typography>

                  {!expanded && caption.length > 100 && (
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setExpanded(true)}
                    >
                      more
                    </Typography>
                  )}
                </Box>
              );
            };


            return (
              <Card key={post._id} sx={{ mb: 4 }}>
                <CardMedia component="img" image={post.image} alt={post.title} sx={{ height: { xs: 200, sm: 300 } }} />
                <CardContent>
                  <Typography variant="h6">{post.title}</Typography>
                  <CaptionWithReadMore caption={post.caption} />


                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton onClick={() => handleLike(post._id)} color="error">
                      {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography
                      variant="body2"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => openLikesDialog(post.likes)}
                    >
                      {post.likes?.length} {post.likes?.length === 1 ? 'like' : 'likes'}
                    </Typography>

                    <IconButton onClick={() => toggleComments(post._id)}>
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                    <Typography variant="body2">{postComments.length}</Typography>
                  </Stack>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Stack spacing={1} mt={2}>
                      {postComments.map((cmt) => {
                        const user = cmt.userId;
                        return (
                          <Stack key={cmt._id} direction="row" spacing={1} alignItems="flex-start">
                            <Avatar src={user?.profilePicture || ''}>
                              {user?.username?.[0]?.toUpperCase() || 'U'}
                            </Avatar>
                            <Stack flex={1}>
                              <Typography variant="body2" fontWeight={600}>
                                {user?.username || 'User'}
                              </Typography>
                              <Typography variant="body2">{cmt.text}</Typography>
                            </Stack>
                            {String(currentUser?.user?._id) === String(user?._id) && (
                              <IconButton size="small" onClick={() => handleCommentDelete(post._id, cmt._id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Stack>
                        );
                      })}
                    </Stack>

                    <Stack direction="row" spacing={1} mt={2}>
                      <TextField
                        placeholder="Add a comment..."
                        variant="standard"
                        fullWidth
                        value={commentTexts[post._id] || ''}
                        onChange={(e) =>
                          setCommentTexts((prev) => ({ ...prev, [post._id]: e.target.value }))
                        }
                        InputProps={{
                          disableUnderline: false,
                          sx: {
                            fontSize: 14,
                            paddingY: 0.5,
                            paddingX: 1,
                          },
                        }}
                      />
                      {(commentTexts[post._id] || '').trim() !== '' && (
                        <IconButton
                          color="primary"
                          onClick={() => handleCommentSubmit(post._id)}
                        >
                          <SendIcon sx={{ transform: 'rotate(-45deg)' }} />
                        </IconButton>
                      )}
                    </Stack>
                  </Collapse>

                  {post.userId && (
                    <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                      <Avatar src={post.userId.profilePicture || ''}>
                        {post.userId.username?.[0]?.toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">{post.userId.username}</Typography>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

      {/* Likes Dialog */}
      <Dialog open={likesDialog.open} onClose={closeLikesDialog} fullWidth maxWidth="xs">
        <DialogTitle>Liked by</DialogTitle>
        <DialogContent>
          <List>
            {likesDialog.users.map((user) => (
              <ListItem key={user._id || user}>
                <ListItemAvatar>
                  <Avatar src={user?.profilePicture || ''}>
                    {user?.username?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user?.username || user} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLikesDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
