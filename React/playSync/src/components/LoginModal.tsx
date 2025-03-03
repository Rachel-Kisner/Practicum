// import Box from '@mui/material/Box';  
// import Modal from '@mui/material/Modal';  
// import Button from '@mui/material/Button';  
// import { TextField, Typography } from '@mui/material';  
// import {  useContext, useRef, useState } from 'react'; 
// import {  User } from '../user'; 
// import { api } from '../services/api';
// import { LoginContext, userContext } from './Home';
// const style = { 
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     pt: 2,
//     px: 4,
//     pb: 3,
// };
// interface LoginModalProps { 
//     onClose: () => void;    
//     onLoginSuccess: () => void
// }
// export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) { 
//     const [emailRef, passwordRef] = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];  // שימוש ב-refs לטופס
//     const [isOpen, setIsOpen] = useState(true); 
//     const [user, userDispatch] = useContext(userContext);
//     const [isLogin, setIsLogin] = useContext(LoginContext);  
//     const [error, setError] = useState<string | null>(null);
//     const handleSubmitWithValidation = async (register: boolean) => {
//         if (!emailRef.current?.value || !passwordRef.current?.value) {
//             setError("Email and password are required.");
//             return;
//         }
//         try {
//             const exists = await api.checkEmailAndPassword(emailRef.current.value,passwordRef.current.value);
//             if (register && exists) {
//                 setError(" you have already registered. Please login.");
//                 return;
//             }
//             if (!register && !exists) {
//                 setError("Maybe you are not registered?- Please sign up first. Maybe one of the details is wrong ? -try again");
//                 return;
//             }
//             await handleSubmit(register);
//         } catch (error: any) {  
//             setError(error.response?.data?.message || "An error occurred. Please try again.");
//         }  
//     };
//     const handleSubmit = async (register: boolean) => { 
//         try {
//             const response = register ?
//                 await api.register(emailRef.current!.value, passwordRef.current!.value):
//                 await api.login(emailRef.current!.value, passwordRef.current!.value) 
//             if (response) {  
//                 setIsOpen(false);  
//                 setIsLogin(true);
//                 userDispatch ({
//                     type:register?'ADD':'UPDATE',
//                     data:register?{firstName:"",lastName:"",email:emailRef.current!.value,address:"",phone:"",password:passwordRef.current!.value,id:response.userId}as User:response
//                 });
//                 onClose();  
//                 onLoginSuccess();
//             }
//         }
//         catch (error: any) {  
//             setError(error.response?.data?.message || "An error occurred. Please try again.");
//         }        
//     }
//     return (
//         <Modal
//             open={!isLogin}
//             onClose={onClose} 
//             aria-labelledby="parent-modal-title"
//             aria-describedby="parent-modal-description"
//         >
//             <Box sx={{ ...style, width: 400 }}>
//                 <Typography id="modal-modal-title" variant="h6" component="h2">
//                     Enter details:
//                 </Typography>
//                 <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                     <TextField label="email" inputRef={emailRef} required fullWidth type='email'  sx={{ mb: 2 }} />
//                     <TextField label="password" inputRef={passwordRef} required fullWidth type="password" sx={{ mb: 2 }} />
//                     {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
//                     <Button
//                         onClick={() => handleSubmitWithValidation(false)}
//                         sx={{ mt: 2 }}
//                     >Login
//                     </Button>
//                     <Button 
//                         onClick={() => handleSubmitWithValidation(true)}
//                         sx={{ mt: 2 }}>
//                         Register
//                     </Button>
//                 </Typography>
//             </Box>
//         </Modal>
//     );}
