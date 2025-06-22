import React from "react";
import {Header} from "./Header";
import {Container,Box} from "@mui/material";
import { Outlet } from "react-router-dom";

interface LayoutProps {
    onNavigate: (page:string) => void;
    children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ onNavigate }) => {

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <Header  onNavigate={onNavigate} />
      <Container sx={{ mt: 3, mb: 3 }}>
        <Outlet /> {/* כאן יופיעו כל הדפים הפנימיים */}
      </Container>
    </Box>
  );
};
