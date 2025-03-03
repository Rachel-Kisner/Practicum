import LoginModal from './loginModal';
import { createContext, Dispatch, SetStateAction, useReducer, useState } from 'react';
import { User, Action } from '../user';
import { reducer } from '../user';
import ShowUser from './showUser';
import { Button } from '@mui/material';
import UpdateUser from './updateUser';
import MenuLink from './menu';

const initialState: User = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    password: ''
} as User;

export const userContext = createContext<[User,React.Dispatch<Action>]>([
    initialState,
    () => {},
]);

export const LoginContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>([
    false,
    () => { },
]);

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [isregister, setIsRegister] = useState(false);
    const [user, userDispatch] = useReducer(reducer, initialState);
    const [isLogin, setIsLogin] = useState(false);
    return (
        <userContext.Provider value={[user, userDispatch]}>
            <LoginContext.Provider value={[isLogin, setIsLogin]}>
                <MenuLink />
                <div>
                    {isLogin ? (
                        <div style={{ position: "fixed", top: "15px", left: "30px" }}>
                            <ShowUser />
                        </div>
                    ) : (
                        <>
                            <Button style={{
                                position: "fixed",
                                top: "15px",
                                left: "30px",
                                backgroundColor: "#007bff",
                                color: "white",
                                padding: "8px 16px",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                            }} onClick={() => setShowModal(true)}>
                                Login
                            </Button>
                            {showModal && (
                                isregister ?
                                    <UpdateUser onClose={() => setShowModal(false)} isRegister={true} /> :
                                    <LoginModal
                                        onClose={() => setShowModal(false)}
                                        onLoginSuccess={() => setIsLogin(true)} 
                                    />
                            )}
                        </>
                    )}
                </div>
            </LoginContext.Provider>
        </userContext.Provider>
    );
}


