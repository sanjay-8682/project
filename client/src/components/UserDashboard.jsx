import React from 'react';

import { AllPost } from '../pages/AllPost';
 // or '../components/AllPost' if it's in a different folder

export const UserDashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar stays on the left */}
    

      {/* Posts displayed to the right of the sidebar */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', maxHeight: '100vh' }}>
        <AllPost />
      </div>
    </div>
  );
};
