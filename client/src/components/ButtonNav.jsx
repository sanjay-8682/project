// components/BottomNav.jsx
import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector } from 'react-redux';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);
  const { currentUser } = useSelector((state) => state.user);;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };
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

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        borderTop: '1px solid #ccc',
      }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction  value="/dashboard" icon={<HomeIcon />} />
        <BottomNavigationAction  value="/add-post" icon={<AddCircleOutlineIcon />} />
        <BottomNavigationAction  value="/all-post" icon={<DashboardIcon />} />
        <BottomNavigationAction  value="/all-users" icon={<PeopleIcon />} />
        <BottomNavigationAction
          value="/profile"
          icon={
            <Avatar
              src={currentUser?.user?.profilePicture || ''}
              sx={{
                bgcolor: currentUser?.user?.profilePicture
                  ? 'transparent'
                  : getColorFromUsername(currentUser?.user?.username),
                width: 24,
                height: 24,
              }}
            >
              {!currentUser?.user?.profilePicture &&
                (currentUser?.user?.username?.charAt(0).toUpperCase() || 'U')}
            </Avatar>
          }
        />
      </BottomNavigation>
    </Paper>
  );
};
