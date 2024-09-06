import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Grid, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const LoginForm = (para) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // login page
  const LogIn = async () => {
    const url = 'http://localhost:5005/user/auth/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const res = await response.json();
    if (res.token !== undefined && res.token !== null) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('email', email);
      para.setToken(res.token);
      navigate('/');
    } else {
      console.log('Submit fail');
    }
  };
  return (
    <Box sx={{ p: 2 }}>
      <Grid item xs={7}>
        <Button variant='contained' color='secondary' onClick={() => navigate('/')}>
          Back
        </Button>
      </Grid>
      <Grid container spacing={2} justifyContent='center'>
        <Grid item xs={7} textAlign='center'>
          <Typography variant='h4' gutterBottom>Welcome to Airbrb!</Typography>
        </Grid>
        <Grid item xs={7}>
          <TextField
            required
            label='Email'
            id='Email'
            variant='outlined'
            fullWidth
            onChange={a => setEmail(a.target.value)}
          />
        </Grid>
        <Grid item xs={7}>
          <TextField
            label='Password'
            id='Password'
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton aria-label='toggle password visibility' onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={7} textAlign='center'>
          <Button id='submit' variant='contained' color='primary' onClick={LogIn}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
};
