// import AuthForm from "../components/AuthForm";
// import { useAuth } from '../Hooks/useAuth';
// import { useState } from 'react';



// export default function LoginPage() {
//     const { login } = useAuth();
//     const [isOpen, setIsOpen] = useState(true);
//     const handleLogin = async (formData: { email: string; password: string }) => {
//         try {
//             console.log("Trying to login with:", formData);
//             await login(formData);
//             console.log("Login success ✅");
//             setIsOpen(false);
//         } catch (error: any) {
//             console.error("Login failed ❌", error.message);
//             throw error; // חשוב! כדי שה־AuthForm יציג את השגיאה
//         }
//     };
//     return (
//         <AuthForm
//         isRegister={false}
//             isOpen={isOpen}
//             onClose={() => setIsOpen(false)}
//             onSubmit={handleLogin}
//         />);
// }
////////////before warpping with formWarpping
// import AuthForm from "../components/AuthForm";
// import { useAuth } from '../Hooks/useAuth';
// import { useState } from 'react';



// export default function RegisterPage() {
//     const { login } = useAuth();
//     const [isOpen, setIsOpen] = useState(true);
//     return (
//         <AuthForm
//             isRegister={false}
//             isOpen={isOpen}
//             onClose={() => setIsOpen(false)}
//             onSubmit={async (formData) => {
//                 await login(formData);
//                 setIsOpen(false);
//             }}
//         />)
// }
// pages/LoginPage.tsx



//before smart authion
// import { useState } from "react";
// import AuthForm from "../components/AuthForm";
// import { useAuth } from "../Hooks/useAuth";

// export default function LoginPage() {
//   const [isOpen, setIsOpen] = useState(true);
//   const { login } = useAuth();

//   const handleLogin = async (data: any) => {
//    try{ await login(data);
//     setIsOpen(false);}
//     catch(error: any){
//         console.error("Login failed ❌", error.message); 
//             throw new Error(error?.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <AuthForm
//       isRegister={false}
//       onSubmit={handleLogin}
//       open={isOpen}
//       onClose={() => setIsOpen(false)}
//     />
//   );
// }
