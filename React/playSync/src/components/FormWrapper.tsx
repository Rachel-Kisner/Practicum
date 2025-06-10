// import { yupResolver } from "@hookform/resolvers/yup";
// import { useMemo } from "react";
// import { get, useForm } from "react-hook-form";
// import { useAuth } from "../Hooks/useAuth";
// import { Box, Button, CircularProgress, TextField } from "@mui/material";
// import * as yup from "yup";
// type FormData = {
//     email: string;
//     password: string;
//     name?: string | null;
// }
// type Props = {
//     isRegister: boolean;
//     onClose: () => void;
// }

// function getSchema  (isRegister: boolean) {
//     return yup.object().shape({
//         name: isRegister
//             ? yup.string().required("Name is required")
//             : yup.string().notRequired(),
//         email: yup
//             .string()
//             .email("Invalid email")
//             .required("Email is required"),
//         password: yup
//             .string()
//             .min(6, "Password must be at least 6 characters")
//             .required("Password is required"),
//     });
// }


// export default function FormWrapper ({ isRegister, onClose }: Props)   {
//     const schema = useMemo(() => getSchema(isRegister), [isRegister]);

//     const {
//         register,
//         handleSubmit,
//         setError,
//         formState: { errors, isSubmitting },
//     } = useForm<FormData>({
//         resolver: yupResolver(schema),
//         context: { isRegister },

//     });

//     const { login, register: signUp } = useAuth();
//     const onSubmit = async (data: FormData) => {
//         try {
//             if (isRegister) {
//                 await signUp(data);
//             } else {
//                 await login(data);
//             }
//             onClose();
//         } catch (error: any) {
//             if (error?.response?.data?.message) {
//                 setError("email", {
//                     type: "manual",
//                     message: error?.response?.data?.message,
//                 });
//             }
//             else {
//                 console.log(error);
//             }
//         }
//     };
//     return ( 
//         <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
//             {isRegister && (
//                 <TextField
//                     label="Name"
//                     fullWidth
//                     margin="normal"
//                     {...register("name")}
//                     error={!!errors.name}
//                     helperText={errors.name?.message}
//                 />
//             )}
//             <TextField
//                 label="Email"
//                 fullWidth
//                 margin="normal"
//                 {...register("email")}
//                 error={!!errors.email}
//                 helperText={errors.email?.message}
//             />
//             <TextField
//                 label="Password"
//                 type="password"
//                 fullWidth
//                 margin="normal"
//                 {...register("password")}
//                 error={!!errors.password}
//                 helperText={errors.password?.message}
//             />
//             <Button
//                 type="submit"
//                 variant="contained"
//                 fullWidth
//                 color="primary"
//                 sx={{ mt: 2 }}
//                 disabled={isSubmitting}
//             >
//                 {isSubmitting ? <CircularProgress size={24} /> : isRegister ? "Register" : "Login"}
//             </Button>
//             </Box>





//             );
// }

// components/FormWrapper.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { checkEmailExists } from "../services/authService";
import {
  Button,
  TextField,
  Stack,
  Box,
} from "@mui/material";

interface FormData {
  email: string;
  password: string;
  username?: string;
}

// ✅ פרופס לקומפוננטה
interface FormWrapperProps {
  isRegister: boolean;
  onSubmit: (data: FormData) => void;
  formError?: string|null; // Optional prop for form error messages
}

// ✅ סכמת וולידציה לפי מצב התחברות / הרשמה
const getSchema = (isRegister: boolean) =>
  yup.object({
    email: yup
      .string()
      .email("Invalid email")
      .required("Email is required")
      .test(
        "check-email-exists",
        "This email already exists",
        async function (value) {
      if (!this.options.context?.isRegister || !value) return true;
      try {
        const exists = await checkEmailExists(value);
        return !exists;// Return true if email is available, false otherwise
      } catch (err) {
        return this.createError({ message: "Cannot verify email" });
      }
    }
      ),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Password must contain letters and numbers"),
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .matches(/^[A-Za-z]+$/, "Username must contain letters only")
      .when([], {
        is: () => isRegister,
        then: (schema) => schema.required("Username is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

export default function FormWrapper({ isRegister, onSubmit, formError }: FormWrapperProps) {
   const schema = React.useMemo(() => getSchema(isRegister), [isRegister]);

  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onBlur", // Optional: to validate on blur
    reValidateMode: "onChange", // Optional: to re-validate on change
    context: { isRegister }, // Pass isRegister to the resolver context
  });



  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {isRegister && (
          <TextField
            label="Username"
            type="text"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
            
            
          />
        )}
        <TextField
          label="Email"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : isRegister ? "Register" : "Login"}
        </Button>
        </Box>
      </Stack>
    </form>
  );
}
