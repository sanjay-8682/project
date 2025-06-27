import { useState } from 'react';
import {
  TextField,
  Stack,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ Direct axios import

export const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    // ✅ Validation
    if (!username.trim()) return alert('Please enter your name');
    if (!email.trim()) return alert('Please enter your email');
    if (!email.includes('@')) return alert('Enter a valid email');
    if (!password.trim()) return alert('Please enter a password');
    if (password.length < 8) return alert('Password must be at least 8 characters');

    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const { data } = await axios.post(
        `${baseURL}/user/register`,
        { username, email, password },
        { withCredentials: true }
      );

      alert('User registration successful');
      navigate('/login'); // ✅ redirect to login after success
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      alert(errorMsg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f9f9f9',
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Welcome to SignUp!
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              variant="outlined"
              type="text"
              id="username"
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              id="email"
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              id="password"
              onChange={handleChange}
              fullWidth
              required
            />
            <Button variant="contained" type="submit" fullWidth>
              SignUp
            </Button>
          </Stack>
        </form>

        <Typography align="center" mt={2}>
          Already have an account?{' '}
          <NavLink to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Log in
          </NavLink>
        </Typography>
      </Paper>
    </Box>
  );
};
