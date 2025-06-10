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

import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(to right, #3f51b5, #2196f3)", // 🎨 גראדיאנט כחול מודרני
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)", // ☁️ צל עדין
        mb: 4, // 📦 מרווח מתחת ל־AppBar
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center", // 🟦 ממקם את הטקסט במרכז
          alignItems: "center",
        }}
      >
        {/* אפשר להוסיף כאן לוגו אם תרצי */}
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            letterSpacing: 1,
          }}
        >
          🎵 Welcome to PlaySync
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
