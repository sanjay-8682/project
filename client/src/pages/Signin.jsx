import React, { useState } from 'react';
import {
  TextField,
  Stack,
  Button,
  Typography,
  Alert,
  Box,
  Paper,
} from '@mui/material';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import axios from 'axios'; // ✅ direct import

export const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setErrorMessage('All fields are required');
      return;
    }

    dispatch(signInStart());
    setLoading(true);
 
    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const { data } = await axios.post(
        `${baseURL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(signInSuccess(data));
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      dispatch(signInFailure(errorMsg));
      setErrorMessage('Login failed: ' + errorMsg);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f7f7f7',
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Welcome to Login
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              variant="outlined"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              variant="outlined"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              fullWidth
              size="large"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Stack>
        </form>

        <Typography align="center" mt={2}>
          You don't have an account?{' '}
          <NavLink to="/" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Sign Up
          </NavLink>
        </Typography>
      </Paper>
    </Box>
  );
};
