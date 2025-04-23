import Avatar from '@mui/material/Avatar'; 
import Stack from '@mui/material/Stack';  
import { deepOrange } from '@mui/material/colors';  
import { useContext, useState } from 'react';  
import { userContext } from './Home';  
import { Button } from '@mui/material'; 
import UpdateUser from './UpdateUser'; 

export default function ShowUser() {
  const [user] = useContext(userContext);  
  const [isOpenBtn, setIsOpenBtn] = useState(false);  

  return (
    <div style={{ position: 'relative' }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        {user.firstName ? (
          <Avatar
            sx={{ bgcolor: deepOrange[300] }}  
            alt="User Avatar"
          >
            {user.firstName[0]} 
          </Avatar>
        ) : (
          <Avatar src="/broken-image.jpg" />
        )}

        <Button
          variant="outlined"
          onClick={() => setIsOpenBtn(true)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            marginTop: "10px"
          }}
        >
          Update
        </Button>
      </Stack>

      <h3 style={{ textAlign: 'center' }}>
        {user.firstName} {user.lastName}
      </h3>

      {isOpenBtn && <UpdateUser onClose={() => setIsOpenBtn(false)} isRegister={false} />}
    </div>
  );
}
