import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Stack
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Logo from '@/assets/Logo.png'
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSignIn } from '@/network/auth';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const auth = useAuth()
    const signInRequest = useSignIn()

    const handlePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await signInRequest.mutateAsync(formData)

        console.log(response)

        if('error' in response.data) return toast.error(response.data?.error)

        auth.setToken(response.data?.token)
        auth.setUser(response.data?.user)
    };

    return <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
        }}
    >
        <Stack alignItems="center">
            <img src={Logo} alt="logo" width={200} />
        </Stack>

        <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
        />

        <TextField
            label="Contraseña"
            variant="outlined"
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            required
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handlePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />

        <Button type="submit" variant="contained" fullWidth color="primary" disabled={signInRequest.status === 'pending'}>
            Login
        </Button>
    </Box>
}

export default Login