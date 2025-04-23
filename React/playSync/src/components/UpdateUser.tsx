import { Modal, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useState, useContext, useRef } from "react";
import { userContext } from "./Home";
import { Action, User } from "../user";
import { api } from "../services/api";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
interface UpdateUserProps {  
  onClose: () => void;
  isRegister: boolean;
}
export default function UpdateUser({ onClose, isRegister }: UpdateUserProps) {
  const [open, setOpen] = useState(true);  
  const handleClose = onClose;  
  const [updateBtn, setUpdateBtn] = useState(false);  
  const [user, userDispatch] = useContext(userContext);  
  const firstNameRef = useRef<HTMLInputElement>(null);  
  const lastNameRef = useRef<HTMLInputElement>(null);  
  const addressRef = useRef<HTMLInputElement>(null);  
  const passRef = useRef<HTMLInputElement>(null);  
  const emailRef = useRef<HTMLInputElement>(null);  
  const phonRef = useRef<HTMLInputElement>(null); 
  const [isLoading, setIsLoading] = useState(false);  
  const [error, setError] = useState<string | null>(null);  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault(); 
    const userSubmit: User = { 
      firstName: firstNameRef.current!.value,
      lastName: lastNameRef.current!.value,
      email: emailRef.current!.value,
      address: addressRef.current!.value,
      phone: phonRef.current!.value,
      password: user.password,
      id: user.id
    };
    try {
      setIsLoading(true);
      setError(null); 
      let response;  
      console.log("USER BEFORE UPDATE:", user.id,user.email);
      response = await api.updateUser(userSubmit); 
      const action: Action = {
        type: 'UPDATE',
        data: userSubmit
      };
      userDispatch(action);  
      setUpdateBtn(!updateBtn); 
      handleClose(); 
    } catch (e) {
      console.error("Error: ", e);  
      setError(`An error occurred while processing your request. :${e}`); 
    } finally {
      setIsLoading(false); 
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" sx={{ mt: 2 }}>
            Please fill in the details below.
          </Typography>
          <form>
            <TextField label="First Name" defaultValue={user.firstName} inputRef={firstNameRef} sx={{ mt: 2 }} />
            <TextField label="Last Name" defaultValue={user.lastName} inputRef={lastNameRef} sx={{ mt: 2 }} />
            <TextField label="Address" defaultValue={user.address} inputRef={addressRef} sx={{ mt: 2 }} />
            <TextField label="Phone" defaultValue={user.phone} inputRef={phonRef} sx={{ mt: 2 }} />
            <TextField label="Email" defaultValue={user.email} inputRef={emailRef} sx={{ mt: 2 }} />
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            <Button
              onClick={handleSubmit}
              style={{ margin: '40px' }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : isRegister ? 'Register' : 'Update'}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
