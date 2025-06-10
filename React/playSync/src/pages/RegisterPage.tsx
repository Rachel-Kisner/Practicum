// import  AuthForm  from "../components/AuthForm";
// import { useAuth } from '../Hooks/useAuth';
// import { useState } from 'react';



// export default function RegisterPage() {
//     const { register } = useAuth();
//     const [isOpen, setIsOpen] = useState(true);
//     return (
//         <AuthForm isOpen={isOpen}
//             onClose={() => setIsOpen(false)}
//             onSubmit={async (formData) => {
//                 await register(formData);
//                 setIsOpen(false); 
//             }}
//             isRegister={true} />)
// }

// pages/RegisterPage.tsx





///before smart authion
// import { useState } from "react";
// import AuthForm from "../components/AuthForm";
// import { useAuth } from "../Hooks/useAuth";

// export default function RegisterPage() {
//   const [isOpen, setIsOpen] = useState(true);
//   const { register: registerUser } = useAuth();
//   const [error, setError] = useState<any>(null);
//   const handleRegister = async (data: any) => {
//     console.log("registing user",data);
//     try{await registerUser(data);
//     setIsOpen(false);}
//     catch (error:any) {
//       console.error("Registration failed:", error);
//       setError({ message: error.message || "Registration failed. Please try again." });
//        throw error;
//     }
    
//   };

//   return (
//     <AuthForm
//       isRegister={true}
//       onSubmit={handleRegister}
//       open={isOpen}
//       onClose={() => setIsOpen(false)}
//     />
//   );
// }
