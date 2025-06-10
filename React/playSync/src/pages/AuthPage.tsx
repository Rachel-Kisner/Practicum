// import { useState } from "react";
// import AuthForm from "../components/AuthForm";
// import { Button, Container, Typography } from "@mui/material";

// export default function AuthPage() {
//   const [isOpen, setIsOpen] = useState(true); // שולט על פתיחת המודאל

//   return (
//     <Container
//       maxWidth="sm"
//       sx={{
//         mt: 10,
//         textAlign: "center",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       {/* כותרת ראשית */}
//       <Typography variant="h4" gutterBottom>
//         Welcome to PlaySync
//       </Typography>



//       {/* כפתור לפתיחת המודאל (אם תסגרי אותו ורוצה לפתוח שוב)
//       {!isOpen && (
//         <Button variant="contained" onClick={() => setIsOpen(true)}>
//           Open Login/Register
//         </Button>
//       )} */}

//       {/* מודאל ההתחברות/הרשמה */}
//       <AuthForm
//         open={isOpen}
//         onClose={() => {setIsOpen(false)}} // סוגר את המודאל
//       />
//     </Container>
//   );
// }

import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import {Header} from "../components/Header";

export default function AuthPage() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  return (
    <>
      {/* 🔵 Header קבוע בראש הדף */}
      {/* <Header onNavigate={() => {}} /> */}

      {/* 🔵 תוכן הדף המרכזי */}
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* כפתור לפתיחה מחדש אם רוצים */}
        {/* {!isOpen && (
          <Button variant="contained" onClick={() => setIsOpen(true)}>
            Open Login/Register
          </Button>
        )} */}

        {/* 🔵 קומפוננטת הטופס */}
        <AuthForm 
        open={isOpen} 
        onClose={() => {setIsOpen(false); navigate("/")}} />
      </Container>
    </>
  );
}
