import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Avatar,
  CircularProgress,
  InputBase,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material/styles';
import axios from 'axios';

// 🔧 Search styling
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[300], 0.25),
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[300], 0.35),
  },
  marginBottom: theme.spacing(3),
  width: '100%',
  maxWidth: 300,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  padding: theme.spacing(1, 1, 1, 5),
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
}));

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const baseURL = import.meta.env.VITE_API_URL;

      try {
        const res = await axios.get(`${baseURL}/user/all`, { withCredentials: true });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        All Users
      </Typography>

      {/* 🔍 Search Input */}
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search by username..."
          inputProps={{ 'aria-label': 'search' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Search>

      {/* 🧍‍♂️ Responsive List */}
      <Grid container spacing={2}>
        {filteredUsers.length === 0 ? (
          <Typography sx={{ ml: 2 }}>No users found.</Typography>
        ) : (
          filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  p: 1,
                  borderBottom: '1px solid #ddd',
                }}
              >
                <Avatar
                  src={user.profilePicture || ''}
                  alt={user.username}
                  sx={{ width: 56, height: 56 }}
                >
                  {user.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography fontWeight="bold">{user.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};
