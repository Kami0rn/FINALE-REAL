import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { fetchUserProfile } from '../../services/user'; // Adjust the path as necessary

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        const userData = await fetchUserProfile(userId);
        if (userData) {
          setUser(userData);
        }
      }
    };

    getUserProfile();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setIsOpen(false);
    window.location.href = '/'; // Redirect to home page after logout
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-4 fixed top-0 w-full z-50 shadow-lg animate-gradient-x">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold mr-auto" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>
          <Link to="/" className="hover:underline">XenoAI</Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* User Icon */}
          <div className="relative">
            <button
              onClick={() => window.location.href = '/profile'}
              onMouseEnter={toggleProfile}
              onMouseLeave={toggleProfile}
              className="text-white focus:outline-none p-2 rounded-md hover:bg-gray-300"
            >
              <AccountCircleIcon />
            </button>
            {isProfileOpen && user && (
              <div className="absolute right-0 mt-2 w-58 bg-white bg-opacity-90 rounded-md shadow-lg backdrop-blur-sm z-50 p-4">
                <p className="text-gray-800"><span className="font-semibold">Username:</span> {user.username}</p>
                <p className="text-gray-800"><span className="font-semibold">Email:</span> {user.email}</p>
              </div>
            )}
          </div>
          {/* MENU Button */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none p-2 rounded-md hover:bg-gray-300"
            >
              <MenuIcon />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-90 rounded-md shadow-lg backdrop-blur-sm z-50">
                <Link
                  to="/generate"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  Generate
                </Link>
                <Link
                  to="/tracing"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  Tracing
                </Link>
                <Link
                  to="/blockchain"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  Blockchain
                </Link>
                <Link
                  to="/train"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  Train
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-700 hover:text-white"
                  onClick={openLogoutDialog}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
      >
        <DialogTitle>{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="primary">
            Cancel
          </Button>
            <Button onClick={handleLogout} style={{ color: 'red' }} autoFocus>
              Logout
            </Button>
        </DialogActions>
      </Dialog>
    </nav>
  );
};

export default Navbar;
