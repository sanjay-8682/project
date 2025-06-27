import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userPosts: [],
  allposts: [],
  loading: false,
  error: null,
  likeLoading: false,
  commentLoading: false,
  deleteCommentLoading: false,
};

const postSlice = createSlice({
  name: 'userPost',
  initialState,
  reducers: {
    // 🔹 Create Post
    createPostStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPostSuccess: (state, action) => {
      state.loading = false;
      state.userPosts = [action.payload, ...state.userPosts];
      state.allposts = [action.payload, ...state.allposts];
    },
    createPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetCreatePost: (state) => {
      state.loading = false;
      state.error = null;
    },

    // 🔹 Fetch My Posts
    fetchUserPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserPostsSuccess: (state, action) => {
      state.loading = false;
      state.userPosts = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchUserPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Fetch All Posts
    fetchAllPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAllPostsSuccess: (state, action) => {
      state.loading = false;
      state.allposts = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchAllPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Update Post
    updatePostStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePostSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.userPosts = state.userPosts.map(p => p._id === updated._id ? updated : p);
      state.allposts = state.allposts.map(p => p._id === updated._id ? updated : p);
    },
    updatePostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Delete Post
    deletePostStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deletePostSuccess: (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      state.userPosts = state.userPosts.filter(p => p._id !== deletedId);
      state.allposts = state.allposts.filter(p => p._id !== deletedId);
    },
    deletePostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Like/Unlike Post
    likePostStart: (state) => {
      state.likeLoading = true;
      state.error = null;
    },
    likePostSuccess: (state, action) => {
      state.likeLoading = false;
      const updated = action.payload;
      state.allposts = state.allposts.map(p => p._id === updated._id ? updated : p);
      state.userPosts = state.userPosts.map(p => p._id === updated._id ? updated : p);
    },
    likePostFailure: (state, action) => {
      state.likeLoading = false;
      state.error = action.payload;
    },

    // 🔹 Add Comment
    addCommentStart: (state) => {
      state.commentLoading = true;
      state.error = null;
    },
    addCommentSuccess: (state, action) => {
      state.commentLoading = false;
      const updated = action.payload;
      state.allposts = state.allposts.map(p => p._id === updated._id ? updated : p);
      state.userPosts = state.userPosts.map(p => p._id === updated._id ? updated : p);
    },
    addCommentFailure: (state, action) => {
      state.commentLoading = false;
      state.error = action.payload;
    },

    // 🔹 Delete Comment
    deleteCommentStart: (state) => {
      state.deleteCommentLoading = true;
      state.error = null;
    },
    deleteCommentSuccess: (state, action) => {
      state.deleteCommentLoading = false;
      const updated = action.payload;
      state.allposts = state.allposts.map(p => p._id === updated._id ? updated : p);
      state.userPosts = state.userPosts.map(p => p._id === updated._id ? updated : p);
    },
    deleteCommentFailure: (state, action) => {
      state.deleteCommentLoading = false;
      state.error = action.payload;
    },
    clearError:(state) => {
      state.error = null;

    }
  },
});

export const {
  createPostStart,
  createPostSuccess,
  createPostFailure,
  resetCreatePost,
  fetchUserPostsStart,
  fetchUserPostsSuccess,
  fetchUserPostsFailure,
  fetchAllPostsStart,
  fetchAllPostsSuccess,
  fetchAllPostsFailure,
  updatePostStart,
  updatePostSuccess,
  updatePostFailure,
  deletePostStart,
  deletePostSuccess,
  deletePostFailure,
  likePostStart,
  likePostSuccess,
  likePostFailure,
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  deleteCommentFailure,
  clearError
} = postSlice.actions;

export default postSlice.reducer;
