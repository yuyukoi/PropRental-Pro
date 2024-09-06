import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Grid, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const RegisterForm = (para) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const navigate = useNavigate();
  // register page
  const Register = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const url = 'http://localhost:5005/user/auth/register';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });
    const res = await response.json();
    if (res.token !== undefined) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('email', email);
      para.setToken(res.token);
      console.log('Register success');
      navigate('/');
    } else {
      alert('Register fail: ' + res.error);
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
            required
            label='Name'
            id='Name'
            variant='outlined'
            fullWidth
            onChange={a => setName(a.target.value)}
          />
        </Grid>
        <Grid item xs={7}>
          <TextField
            required
            label='Password'
            id='Password'
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            fullWidth
            onChange={a => setPassword(a.target.value)}
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
        <Grid item xs={7}>
          <TextField
            required
            label='Confirm Password'
            id='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            variant='outlined'
            fullWidth
            onChange={a => setConfirmPassword(a.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton aria-label='toggle confirm password visibility' onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {password !== confirmPassword && (
          <Grid item xs={7}>
            <Typography color='error'>Passwords do not match</Typography>
          </Grid>
        )}
        <Grid item xs={7} textAlign='center'>
          <Button id='submit' variant='contained' color='primary' onClick={Register}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
