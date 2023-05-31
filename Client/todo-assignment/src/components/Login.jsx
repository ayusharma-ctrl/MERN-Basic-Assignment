import React from 'react'
import { Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

// components-import
import LoginForm from '../utils/LoginForm';
import RegisterForm from '../utils/RegisterForm';


const Login = ({ setAuth }) => {
    const [login, setLogin] = React.useState(true)
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    // funct to login
    const handleLogin = async () => {
        if (username === "" || password === "") {
            toast.error('Both fields are required');
            return
        }
        if (username.length < 3 || password.length < 6) {
            toast.error('Please enter a valid username or password');
            return
        }
        try {
            const { data } = await axios.post("https://basic-assignment.onrender.com/api/user/login",
                { username: username, password: password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            )
            console.log(data.success)
            if (data.success === false) {
                toast.error(data.message)
                return
            }
            setAuth(true)
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <ToastContainer />
            <Grid container spacing={2} style={{ width: '100vw', height: '94vh', position: 'relative', top: '1rem', margin: 0, padding: 0 }}>
                <Grid item xs={12} md={12} style={{ width: '40%', backgroundColor: "#F0F2F5" }}>
                    {login ? (<LoginForm setLogin={setLogin} handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />)
                        : (<RegisterForm setLogin={setLogin} />)}
                </Grid>
            </Grid>
        </div>
    )

}

export default Login