import React, { useState } from 'react';

import {
  AppBar, Box, Toolbar, Typography, Button, IconButton,
  Menu, Avatar, MenuItem, Tooltip, Stack
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/user/userSlice.js';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';

const getColorFromUsername = (username) => {
  if (!username) return '#999';
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
};

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    setAnchorEl(null);
    navigate('/login');
  };

  return (
    <>
      {/* 👇 This keeps space so layout doesn’t jump */}
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

      <AppBar
        position="fixed"
        sx={{
          px: { xs: 1, sm: 2 },
          zIndex: (theme) => theme.zIndex.drawer + 1, // Stay above BottomNav or any drawer
        }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 300,
              fontFamily:  "Orbitron, sans-serif",
              textDecoration: 'none',
            }}
            
            color="inherit"
          >
            Instavibe
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">

            {currentUser ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleAvatarClick} size="small" sx={{ ml: 1 }}>
                    <Avatar
                      src={currentUser?.user?.profilePicture}
                      sx={{
                        bgcolor: currentUser?.user?.profilePicture
                          ? 'transparent'
                          : getColorFromUsername(currentUser?.user?.username),
                        width: 32,
                        height: 32,
                      }}
                    >
                      {!currentUser?.user?.profilePicture &&
                        (currentUser?.user?.username?.charAt(0).toUpperCase() || 'U')}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                {/* Optional username next to the avatar (outside IconButton) */}
                {currentUser?.user?.username && (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {currentUser.user.username}
                  </Typography>
                )}


                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      mt: 1.5,
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem disabled sx={{ color: 'blue' }}>
                    {currentUser.user.username}
                  </MenuItem>
                  <MenuItem component={Link} to="/profile">Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/">
                SignUp
              </Button>


            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};
