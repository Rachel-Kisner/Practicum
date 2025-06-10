// import { useState } from "react";
// import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material";
// import { set, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { checkEmailExists} from "../services/authService";


// const modalStyle = {
//     position: 'absolute' as const,
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     borderRadius: 2,
//     boxShadow: 24,
//     p: 4,
// };
// const schema = yup.object().shape({
//     email: yup
//     .string()
//     .email("Invalid email")
//     .required("Email is required")
//     .test(
//         "check-email-exists",
//         "this email already exists",
//         async (value) => {
//             if (!value) return false;
//             if (!this.options.context?.isRegister) return true; // Skip check if not registering
//             try{
//             const isAvailable=await checkEmailExists(value); 
//             return isAvailable; // Return true if email is available, false otherwise
//             }
//             catch (error) {
//                 console.error("Error validating email:", error);
//                 return false; // Return false if there's an error
//             }
//         }
//     ),
//     password: yup
//     .string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//     name: yup
//     .string()
//     .min(2, "Name must be at least 2 characters")
//     .when([],{
//         is:()=> true,
//         then:(schema,context)=>
//             context?.isRegister
//             ?schema.required("Name is required")
//             : schema.notRequired(), // Set notRequired when isRegister is false(),
//     }),
// });
// interface FormData {
//     email: string;
//     password: string;
//     name?: string; // Optional for login
//     // isRegister?: boolean; // Optional to determine if it's a registration form
// }


// interface AuthFormProps {
//     // isOpen: boolean;
//     isRegister: boolean;
//     onClose: () => void;
//     onSubmit: (data: FormData) =>Promise< void>;
// }


// const[error, setError] = useState<string | null>(null); // State to hold error messages
// const AuthForm: React.FC<AuthFormProps> = ({  isRegister,onClose, onSubmit }) =>{
//     const [loading,setLoading] = useState(false);
//     const{
//         register,//משמש כדי לחבר כל input לטופס ולוולידציה.
//         handleSubmit,//עוטף את פונקציית השליחה שלך ודואג לבדוק אם כל השדות תקינים לפני שהוא מריץ אותה
//         reset,//פונקציה שמחזירה את כל שדות הטופס לערכי ברירת מחדל.
//         setError,//פונקציה שמאפשרת להגדיר שגיאות וולידציה ידנית.
//         formState: { errors },// מאותו אובייקט formState אנחנו שולפים רק את ה־errors, שזה אובייקט שמכיל את שגיאות הוולידציה לפי שם שדה.
//     } = useForm<FormData>({
//         resolver: yupResolver(schema),//resolver: אומר ל־react-hook-form באיזו ספרייה להשתמש כדי לבדוק ולידציה.
//         context: { isRegister }, // Pass context to the resolver
//         mode: "onBlur",
//         reValidateMode: "onChange",
//         // context: { isRegister },
//         defaultValues: {
//             email: "",
//             password: "",
//             name: "" 
//         },
//     });

//     const onFormSubmit =async (data: FormData) => {
//         try {
//             setLoading(true);
//             await onSubmit({
//                 email: data.email,
//                 password: data.password,
//                 ...(isRegister && { name: data.name })
//             });
//             reset();
//             onClose();
//         } catch (error: any) {
//             console.error("Error during form submission:", error);
//             setError("email", {
//                 type: "manual",
//                 message: error?.message || "An unexpected error occurred"
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     // if (!isOpen) {
//     //     return null;
//     // }
//     // const [email, setEmail] = useState("");
//     // const [password, setPassword] = useState("");
//     // const [name, setName] = useState("");
//     // const resetFields = () => {
//         //     setEmail("");
//         //     setPassword("");
//     //     setName("");
//     //     setError(null);
//     // };
//     // const handleFormSubmit = (e: React.FormEvent) => {
//     //     e.preventDefault();
//     //     if (!email || !password || (isRegister && !name)) {
//     //         alert("Please fill in all fields.");
//     //         return;
//     //     }
//     //     setError(null);
//     //     onSubmit({ email, password, ...(isRegister && { name }) });
//     //     resetFields();
//     //     onClose();

//     // };


//     return (
//         <Modal open onClose={onClose}>
//             <Box sx={modalStyle}>
//                 <Typography variant="h5" textAlign={"center"} gutterBottom>
//                     {isRegister ? "Register" : "Login"}
//                 </Typography>
//                 <form onSubmit={handleSubmit(onFormSubmit)                                                          } >
//                     <Stack spacing={2}>

//                         {isRegister && (
//                             <TextField
//                                 label="Name"
//                                 // placeholder="Name"
//                                 {...register("name")}
//                                 error={!!errors.name}
//                                 // onChange={(e) => setName(e.target.value)}
//                                 // className="p-2 border rounded"
//                                 helperText={errors.name?.message}
//                                 required
//                                 fullWidth
//                             />
//                         )}
//                         <TextField
//                             label="Email"
//                             type="email"
//                             placeholder="Email"
//                             // value={email}
//                             // onChange={(e) => setEmail(e.target.value)}
//                             className="p-2 border rounded"
//                             // required
//                             fullWidth
//                             helperText={errors.email?.message}
//                             error={!!errors.email}
//                             {...register("email")}
//                         />
//                         <TextField
//                             label="Password"
//                             type="password"
//                             placeholder="Password"
//                             // value={password}
//                             // onChange={(e) => setPassword(e.target.value)}
//                             className="p-2 border rounded"
//                             required
//                             fullWidth
//                             {...register("password")}
//                             error={!!errors.password}
//                             helperText={errors.password?.message}
//                         />
//                         {error && (
//                             <Typography color="error" textAlign="center">
//                                 {error}
//                             </Typography>
//                         )}
//                         <Button variant="contained" color="primary" type="submit" onClick={handleSubmit(onFormSubmit)} disabled={loading} fullWidth>
//                             {loading 
//                             ? "Loading..." 
//                             : isRegister 
//                             ? "Register" : "Login"}
//                         </Button>
//                         <Button variant="outlined" color="secondary" onClick={() => { reset(); onClose(); }} fullWidth>
//                             Cancel
//                         </Button>
//                     </Stack>

//                 </form>
//             </Box>
//         </Modal>
//     );
// }
// export default AuthForm;



// import { useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Stack,
// } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { checkEmailExists } from "../services/authService";

// // עיצוב למודל
// const modalStyle = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 4,
// };

// // טיפוס לטופס
// interface FormData {
//   email: string;
//   password: string;
//   name?: string;
// }

// // פרופס לקומפוננטה
// interface AuthFormProps {
//   isRegister: boolean;
//   onClose: () => void;
//   onSubmit: (data: FormData) => Promise<void>;
// }

// // סכימת ולידציה של Yup
// const getSchema = (isRegister: boolean) =>
//   yup.object().shape({
//     email: yup
//       .string()
//       .email("Invalid email")
//       .required("Email is required")
//       .test(
//         "check-email-exists",
//         "This email already exists",
//         async function (value) {
//           // השתמש ב־function ולא ב־arrow כדי לגשת ל־this
//           if (!value) return false;
//           if (!this.options.context?.isRegister) return true;

//           try {
//             const isAvailable = await checkEmailExists(value);
//             return isAvailable;
//           } catch (error) {
//             console.error("Error validating email:", error);
//             return false;
//           }
//         }
//       ),
//     password: yup
//       .string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//     name: yup
//       .string()
//       .min(2, "Name must be at least 2 characters")
//       .when("$isRegister", {
//         is: true,
//         then: (schema) => schema.required("Name is required"),
//         otherwise: (schema) => schema.notRequired(),
//       }),
//   });

// const AuthForm: React.FC<AuthFormProps> = ({
//   isRegister,
//   onClose,
//   onSubmit,
// }) => {
//   const [loading, setLoading] = useState(false); // מצב טעינה
//   const [error, setError] = useState<string | null>(null); // הודעת שגיאה כללית (לא של ולידציה)

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setError: setFormError, // נשתמש בו כדי להציג שגיאות ידניות
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: yupResolver(getSchema(isRegister)),
//     context: { isRegister }, // כדי להעביר את isRegister ליופ
//     mode: "onBlur",
//     reValidateMode: "onChange",
//     defaultValues: {
//       email: "",
//       password: "",
//       name: "",
//     },
//   });

//   const onFormSubmit = async (data: FormData) => {
//     try {
//       setLoading(true);
//       await onSubmit({
//         email: data.email,
//         password: data.password,
//         ...(isRegister && { name: data.name }),
//       });
//       reset();
//       onClose();
//     } catch (error: any) {
//       console.error("Error during form submission:", error);
//       setFormError("email", {
//         type: "manual",
//         message: error?.message || "An unexpected error occurred",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal open onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h5" textAlign={"center"} gutterBottom>
//           {isRegister ? "Register" : "Login"}
//         </Typography>
//         <form onSubmit={handleSubmit(onFormSubmit)}>
//           <Stack spacing={2}>
//             {isRegister && (
//               <TextField
//                 label="Name"
//                 {...register("name")}
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//                 required
//                 fullWidth
//               />
//             )}

//             <TextField
//               label="Email"
//               type="email"
//               placeholder="Email"
//               className="p-2 border rounded"
//               fullWidth
//               helperText={errors.email?.message}
//               error={!!errors.email}
//               {...register("email")}
//             />

//             <TextField
//               label="Password"
//               type="password"
//               placeholder="Password"
//               className="p-2 border rounded"
//               required
//               fullWidth
//               {...register("password")}
//               error={!!errors.password}
//               helperText={errors.password?.message}
//             />

//             {error && (
//               <Typography color="error" textAlign="center">
//                 {error}
//               </Typography>
//             )}

//             <Button
//               variant="contained"
//               color="primary"
//               type="submit"
//               disabled={loading}
//               fullWidth
//             >
//               {loading
//                 ? "Loading..."
//                 : isRegister
//                 ? "Register"
//                 : "Login"}
//             </Button>

//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={() => {
//                 reset();
//                 onClose();
//               }}
//               fullWidth
//             >
//               Cancel
//             </Button>
//           </Stack>
//         </form>
//       </Box>
//     </Modal>
//   );
// };

// export default AuthForm
//----without warpComponents----!!!
// import { useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Stack,
//   IconButton,
// } from "@mui/material";
// import { checkEmailExists } from "../services/authService";
// import FormWrapper from "./FormWrapper";
// // עיצוב למודל
// const modalStyle = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 4,
// };

// // טיפוס לנתונים מהטופס
// interface FormData {
//   email: string;
//   password: string;
//   name?: string;
// }

// // פרופס לקומפוננטה
// interface AuthFormProps {
//   isRegister: boolean;
//   isOpen: boolean; // ✨ חדש
//   onClose: () => void;
//   onSubmit: (data: FormData) => Promise<void>;
// }

// // סכימת ולידציה של Yup
// const getSchema = (isRegister: boolean) =>
//   yup.object().shape({
//     email: yup
//       .string()
//       .email("Invalid email")
//       .required("Email is required")
//     // .when("$isRegister", {
//     //   is: true,
//     //   then: (schema) =>
//     //     schema.test(
//     //       "check-email-exists",
//     //       "This email already exists",
//     //       async function (value) {
//     //         console.log("📩 Running email availability check on:", value); // 👈👈👈 שימי את זה!
//     //         if (!value) return false;
//     //         try {
//     //           const isAvailable = await checkEmailExists(value);
//     //           console.log("✅ Email available?", isAvailable); // 👈
//     //           return isAvailable; // Return true if email is available, false otherwise
//     //         }
//     //         catch (error) {
//     //           console.error("Error validating email:", error);
//     //           return false; // Return false if there's an error
//     //         }
//     //       }),
//     //   otherwise: (schema) => schema.notRequired(),
//     // }),
//     ,
//     password: yup
//       .string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//     name: yup
//       .string()
//       .min(2, "Name must be at least 2 characters")
//       .when("$isRegister", {
//         is: true,
//         then: (schema) => schema.required("Name is required"),
//         otherwise: (schema) => schema.notRequired(),
//       }),
//   });

// const AuthForm: React.FC<AuthFormProps> = ({
//   isRegister,
//   isOpen, // ✨ חדש
//   onClose,
//   onSubmit,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const schema = useMemo(() => getSchema(isRegister), [isRegister]);
//   const formKey = isRegister ? "register-form" : "login-form"; // 🆕 מפתח דינמי שגורם ל־useForm להתאפס

//   // 🔍 הדפסה לוודא שהסכמה מתחלפת
//   useEffect(() => {
//     console.log("🧩 Schema now:", isRegister ? "Register Schema" : "Login Schema");
//   }, [isRegister]);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setError: setFormError,
//     formState: { errors },
//   } = useForm<FormData>({
//     key: formKey, // 🧠 כדי לאפס טופס וסכימה בכל מעבר בין מצב
//     resolver: yupResolver(schema), // 🧠 מתעדכן בזכות key
//     context: { isRegister },
//     mode: "onBlur",
//     reValidateMode: "onChange",
//     defaultValues: {
//       email: "",
//       password: "",
//       name: "",
//     },
//   });

//   const onFormSubmit = async (data: FormData) => {
//     console.log("🔥 FORM SUBMITTED!", data);
//     try {
//       console.log("Submitting form with data:", data.email, data.password);

//       setLoading(true);
//       await onSubmit({
//         email: data.email,
//         password: data.password,
//         ...(isRegister && { name: data.name }),
//       });
//       reset(); // איפוס שדות
//       onClose(); // ✨ סגירת מודל לאחר שליחה מוצלחת
//     } catch (error: any) {
//       console.error("Error during form submission:", error);
//       setFormError("email", {
//         type: "manual",
//         message: error?.message || "An unexpected error occurred",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal open={isOpen} onClose={onClose}>
//       <Box key={isRegister ? "register" : "login"} sx={modalStyle}>
//         <Typography variant="h5" textAlign={"center"} gutterBottom>
//           {isRegister ? "Register" : "Login"}
//         </Typography>
//         <form onSubmit={handleSubmit(onFormSubmit, (errors) => {
//           console.log("❌ שגיאות ולידציה!", errors);
//         })}>
//           <Stack spacing={2}>
//             {isRegister && (
//               <TextField
//                 label="Name"
//                 {...register("name")}
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//                 required
//                 fullWidth
//               />
//             )}

//             <TextField
//               label="Email"
//               type="email"
//               placeholder="Email"
//               fullWidth
//               helperText={errors.email?.message}
//               error={!!errors.email}
//               {...register("email")}
//             />

//             <TextField
//               label="Password"
//               type="password"
//               placeholder="Password"
//               required
//               fullWidth
//               {...register("password")}
//               error={!!errors.password}
//               helperText={errors.password?.message}
//             />

//             {error && (
//               <Typography color="error" textAlign="center">
//                 {error}
//               </Typography>
//             )}

//             <Button
//               variant="contained"
//               color="primary"
//               type="submit"
//               disabled={loading}
//               onClick={() => console.log("🟢 נלחץ LOGIN")}
//               fullWidth
//             >
//               {loading
//                 ? "Loading..."
//                 : isRegister
//                   ? "Register"
//                   : "Login"}
//             </Button>

//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={() => {
//                 reset();
//                 onClose(); // ✨ סגירה גם על ביטול
//               }}
//               fullWidth
//             >
//               Cancel
//             </Button>
//           </Stack>
//         </form>
//       </Box>
//     </Modal>
//   );
// };

// export default AuthForm;


/////it's good!!!! dont forget!!!before smartest ...

// import { Modal, Box, IconButton, Typography, Button } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';
// import { useState } from "react";
// import FormWrapper from "./FormWrapper";
// import { Alert } from "@mui/material";
// import { checkEmailAndPassword } from "../services/authService";

// interface FormData {
//   email: string;
//   password: string;
//   username?: string;
// }

// // ✅ פרופס לקומפוננטה
// interface AuthFormProps {
//   isRegister: boolean;
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: FormData) => Promise<void>;
// }

// export default function AuthForm({
//   isRegister,
//   onSubmit,
//   open,
//   onClose,
// }: AuthFormProps) {
//   const [formError, setFormError] = useState<string | null>(null);

//   const formKey = isRegister ? "register" : "login";

//   const handleFormSubmit = async (data: FormData) => {
//     setFormError(null); // איפוס שגיאה קודמת
//     if (!isRegister) {
//       console.log("Checking email and password for login:", data.email, data.password);

//       const isValid = await checkEmailAndPassword(data.email, data.password);
//       console.log("Login result:", isValid);

//       if (!isValid) {
//         console.log("שגיאה: מייל וסיסמה לא תואמים");
//         setFormError("Invalid email or password. Please try again.");
//         return;
//       }
//     }
//     try {
//       await onSubmit(data);
//       onClose(); // סגירת המודל לאחר שליחה מוצלחת
//     }
//     catch (error: any) {
//       setFormError(error?.message || "An unexpected error occurred");
//       console.error("Error during form submission:", error);
//     }
//   }

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           width: 400,
//           bgcolor: 'background.paper',
//           borderRadius: 2,
//           boxShadow: 24,
//           p: 4,
//           mx: 'auto',
//           mt: 10,
//           position: "relative",
//         }} >
//         <IconButton
//           onClick={onClose}
//           sx={{ position: "absolute", top: 8, right: 8 }}
//         >
//           <CloseIcon />
//         </IconButton>
//         <Typography variant="h5" textAlign={"center"} mb={2} >
//           {isRegister ? "Register" : "Login"}
//         </Typography>
//         <FormWrapper key={formKey} isRegister={isRegister} onSubmit={handleFormSubmit} formError={formError}
//         />
//         {formError && (
//           <Alert severity="error" sx={{ textAlign: "center", mt: 2 }}>
//             {formError}
//           </Alert>)}



//       </Box>
//     </Modal>
//   );
// }





import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Modal, TextField, Typography, CircularProgress } from "@mui/material";
import { checkEmailAndPassword, checkEmailExists, registerUser } from "../services/authService"; // ✅ שונה: משתמשים ב-checkEmailExists במקום checkEmailAndPassword
// import { useAuth } from "../Hooks/useAuth";

interface AuthFormProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface FormData {
  email: string;
  password: string;
  username?: string;
}

// ✅ סכימה עם שדות מייל וסיסמה בלבד – username רק אם מצב הרשמה מופעל ידנית
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Password must contain letters and numbers"),
});





const AuthForm: React.FC<AuthFormProps> = ({ open, onClose }) => {
  const [isRegister, setIsRegister] = useState(false); // 🟦 מצב האם אנחנו ברישום
  const [showPasswordField, setShowPasswordField] = useState(false); // 🟦 האם להציג שדה סיסמה
  const [isLoading, setIsLoading] = useState(false); // 🟦 האם להציג Spinner
  // const { login } = useAuth(); // 🟦 hook להתחברות למערכת

  const {
    handleSubmit,
    control,
    setError,
    // clearErrors,
    watch,
    // getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const email = watch("email");

  // 🟩 בכל פעם שהמייל משתנה – נבדוק אם הוא קיים במסד
  useEffect(() => {
    const check = async () => {
      if (!email || !email.includes("@")) return; // 📌 התעלמות ממייל לא תקין
      setIsLoading(true);
      try {
        const exists = await checkEmailExists(email); // 🟦 שליפת סטטוס קיום
        setIsRegister(!exists); // ✅ אם קיים – login, אם לא – register
        setShowPasswordField(true); // ✅ מציגים את שדה הסיסמה רק אחרי בדיקה
      } catch (error: any) {
        console.error("Email check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    check();
  }, [email]);
  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (isRegister) {
        // ✅ אם במצב הרשמה – נדרוש גם שם משתמש
        if (!data.username) {
          setError("username", { type: "manual", message: "Username is required" });
          return;
        }
        await registerUser({
          email: data.email,
          password: data.password,
          username: data.username,
        });

        handleClose(); // סגירת המודל לאחר רישום מוצלח
      } else {
        // 🔵 אם המשתמש קיים – נבדוק אם הסיסמה תואמת לפני login
        console.log("Email:", data.email, "Password:", data.password);
        const isValid = await checkEmailAndPassword(data.email, data.password);
        console.log("Password is valid?", isValid);
        if (!isValid) {
          // 🔵 אם לא תואם – נציג שגיאה בשדה הסיסמה
          setError("password", { type: "manual", message: "Incorrect password" });
          return;
        }
        handleClose(); // סגירת המודל לאחר התחברות מוצלחת

      }

    } catch (error: any) {
      setError("email", { type: "manual", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          {isRegister ? "Register" : "Login"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          {showPasswordField && (
            <>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
              {isRegister && (
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      fullWidth
                      margin="normal"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                    />
                  )}
                />
              )}
              <Box mt={2}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : isRegister ? "Register" : "Login"}
                </Button>
              </Box>
            </>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default AuthForm;

