// import React from "react";
// import { AppBar, Toolbar, Typography } from "@mui/material";

// const Header = () => {
//     return (
//         <AppBar position="static" style={{ backgroundColor: "#1976d2", top:"0" }} color="primary" >
//             <Toolbar>
//                 <Typography variant="h6">
//                     🎶🎶Music App🎶🎶
//                 </Typography>
//             </Toolbar>
//         </AppBar>
//     );
// };
// export default Header;

// import React from "react";
// import { AppBar, Toolbar, Typography, 
//   // Box 
// } from "@mui/material";

// const Header: React.FC = () => {
//   return (
//     <AppBar
//       position="static"
//       sx={{
//         background: "linear-gradient(to right, #3f51b5, #2196f3)", // 🎨 גראדיאנט כחול מודרני
//         boxShadow: "0 4px 12px rgba(0,0,0,0.2)", // ☁️ צל עדין
//         mb: 4, // 📦 מרווח מתחת ל־AppBar
//       }}
//     >
//       <Toolbar
//         sx={{
//           display: "flex",
//           justifyContent: "center", // 🟦 ממקם את הטקסט במרכז
//           alignItems: "center",
//         }}
//       >
//         {/* אפשר להוסיף כאן לוגו אם תרצי */}
//         <Typography
//           variant="h5"
//           sx={{
//             textAlign: "center",
//             fontWeight: "bold",
//             color: "white",
//             letterSpacing: 1,
//           }}
//         >
//           🎵 Welcome to PlaySync
//         </Typography>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;


//claude///
// src/components/Layout/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  MusicNote,
  QueueMusic,
  Home,
  ExitToApp,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../Hooks/useAuth';

// הגדרת הממשק של Props שהרכיב מקבל
interface HeaderProps {
  onNavigate: (page: string,isRegister:boolean) => void; // פונקציה לניווט בין דפים
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  // שימוש בהוק האימות לקבלת פרטי המשתמש
  const { user, logout } = useAuth();

  // שימוש בערכת העיצוב ובדיקת גודל מסך
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // בדיקה אם זה מסך קטן
  console.log("user from context:", user);
  // State לניהול תפריטים ומגירות
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // עבור תפריט פרופיל
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // עבור תפריט סלולר

  ///3 useState bellow for search icon - to add !!!!
  // const [searchOpen, setSearchOpen] = useState(false); // ✅ שליטה על המודל
  // const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState<any[]>([]);

  // פונקציות לפתיחה וסגירה של תפריט הפרופיל
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // פונקציה לטיפול בהתנתקות
  const handleLogout = () => {
    logout(); // הפעלת פונקציית ההתנתקות
    handleProfileMenuClose(); // סגירת התפריט
    onNavigate('home',false); // ניווט לדף הבית
  };

  // פונקציה לטיפול בניווט מהתפריט הנייד
  const handleMobileNavigation = (page: string) => {
    onNavigate(page,false);
    setMobileMenuOpen(false); // סגירת התפריט הנייד
  };
//dont forget to add this!!!!!!!!!!!!!!
  // const handleSearch = async () =>{
  //   if(!searchQuery) return;
  //   const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`);
  //   const data = await response.json();
  //   setSearchResults(data.tracks.items);
  // }

  // רכיב התפריט הנייד (Drawer)
  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 250,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* לוגו וכותרת בתפריט הנייד */}
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MusicNote sx={{ mr: 1, color: theme.palette.primary.main }} />
          PlaySync
        </Typography>

        {/* רשימת קישורי ניווט */}
        <List>
          <ListItemButton onClick={() => handleMobileNavigation('home')}>
            <ListItemIcon>
              <Home sx={{ color: theme.palette.text.primary }} />
            </ListItemIcon>
            <ListItemText primary="home page" />
          </ListItemButton>

          <ListItemButton onClick={() => handleMobileNavigation('playlists')}>
            <ListItemIcon>
              <QueueMusic sx={{ color: theme.palette.text.primary }} />
            </ListItemIcon>
            <ListItemText primary="playlists" />
          </ListItemButton>

          <ListItemButton onClick={() => handleMobileNavigation('songs')}>
            <ListItemIcon>
              <MusicNote sx={{ color: theme.palette.text.primary }} />
            </ListItemIcon>
            <ListItemText primary="songs" />
          </ListItemButton>

          {/* אם המשתמש מחובר - הצגת אפשרויות נוספות */}
          {user && (
            <>
              <ListItemButton onClick={() => handleMobileNavigation('profile')}>
                <ListItemIcon>
                  <Settings sx={{ color: theme.palette.text.primary }} />
                </ListItemIcon>
                <ListItemText primary="הגדרות" />
              </ListItemButton>

              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp sx={{ color: theme.palette.text.primary }} />
                </ListItemIcon>
                <ListItemText primary="התנתק" />
              </ListItemButton>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* צד שמאל - לוגו ותפריט המבורגר (במובייל) */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* כפתור המבורגר - רק במסכים קטנים */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* לוגו וכותרת */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease',
                }
              }}
              onClick={() => onNavigate('home',false)}
            >
              <MusicNote
                sx={{
                  mr: 1,
                  fontSize: 32,
                  color: theme.palette.primary.main,
                  filter: 'drop-shadow(0 0 8px rgba(29, 185, 84, 0.3))'
                }}
              />
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                PlaySync
              </Typography>
            </Box>
          </Box>

          {/* ניווט במסכים גדולים */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button
                color="inherit"
                onClick={() => onNavigate('home',true)}
                startIcon={<Home />}
                sx={{ '&:hover': { color: theme.palette.primary.main } }}
              >
                home page
              </Button>
              <Button
                color="inherit"
                onClick={() => onNavigate('playlists',true)}
                startIcon={<QueueMusic />}
                sx={{ '&:hover': { color: theme.palette.primary.main } }}
              >
                PlayLists
              </Button>
              <Button
                color="inherit"
                onClick={() => onNavigate('songs',true)}
                startIcon={<MusicNote />}
                sx={{ '&:hover': { color: theme.palette.primary.main } }}
              >
                Songs
              </Button>
            </Box>
          )}

          {/* צד ימין - חיפוש ופרופיל */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* כפתור חיפוש */}
            {user && (<IconButton
              color="inherit"
              aria-label="search"
              //to add after you have search method
              // onClick={() => setSearchOpen(true)}
              sx={{
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'scale(1.1)',
                  transition: 'all 0.3s ease',
                }
              }}
            >
              <SearchIcon />
            </IconButton>)}


            {/* אזור משתמש - תלוי באם מחובר או לא */}
            {user ? (
              // אם המשתמש מחובר - הצגת אווטר ותפריט
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease',
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 40,
                      height: 40,
                      fontSize: '1.2rem',
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>

                {/* תפריט פרופיל */}
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      minWidth: 200,
                    },
                  }}
                >
                  {/* פרטי המשתמש */}
                  <MenuItem onClick={handleProfileMenuClose} disabled>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* הגדרות */}
                  <MenuItem onClick={() => { handleProfileMenuClose(); onNavigate('profile',true); }}>
                    <Settings sx={{ mr: 2 }} />
                    profile settings
                  </MenuItem>

                  {/* התנתקות */}
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 2 }} />
                    sign out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // אם המשתמש לא מחובר - כפתורי התחברות והרשמה
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => onNavigate('login',false)}
                  sx={{
                    borderRadius: 20,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  sign in
                </Button>
                <Button
                  variant="contained"
                  onClick={() => onNavigate('register',  true)}

                  sx={{
                    borderRadius: 20,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(29, 185, 84, 0.4)',
                    }
                  }}
                >
                  sign up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* תפריט נייד */}
      <MobileDrawer />
    </>
  );
};
