import React, { useState, useEffect } from 'react';
import { Link, Route, BrowserRouter, Routes, useNavigate } from 'react-router-dom';
import { LoginForm } from './component/Login';
import { RegisterForm } from './component/Register';
import { Dashboard } from './component/Dashboard';
import { CreateList } from './component/CreateList';
import { ViewYourList } from './component/ViewList';
import { ViewAllList } from './component/ViewAllList';
import { ListingDetails } from './component/DetailInfo';
import { YourListingDetails } from './component/YourDetail';
import { EditListing } from './component/Edit';
import { PublishListing } from './component/Publish';
import { ManageRequest } from './component/ManageRequest';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography, Button, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
// import pink from '@mui/material/colors/pink';
// import blue from '@mui/material/colors/blue';

// Click the button on the left to ‘Create my listings’/'View my listings'/'View all listings'
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(160, 147, 184, 0.16)',
    },
    secondary: {
      main: '#ffc107',
    },
  },
});

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '27px',
  fontFamily: 'cursive',
  color: '#6f4e83',
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.light,
    // textShadow: '0px 0px 8px rgba(0, 0, 0, 0.5)',
  },
}));

const Header = (para) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  // if login, this button will become logout
  const whenLoginLogout = () => {
    if (para.token) {
      LogOut();
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  const whenRegister = () => {
    navigate('/register');
  };
  // this is a menu button, it can go to page of 'create list'/'my list'/'all list'
  const whenClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const whenClose = () => {
    setAnchorEl(null);
  };

  const LogOut = () => {
    localStorage.removeItem('token');
    para.setToken(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position='static' style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)' }}>
        <Toolbar style={{ height: '80px' }}>
        {para.token && (
          <IconButton id='totalButton'
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            onClick={whenClick}
          >
            <MenuIcon />
          </IconButton>
        )}
          <StyledTitle textAlign='left' variant='h6' component='div' sx={{ flexGrow: 1 }}>
            <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }} id='airbrb'>PropRental-Pro</Link>
          </StyledTitle>
          {!para.token && (
            <Button onClick={whenRegister} style={{ fontSize: '15px', backgroundColor: '#e6684c', color: '#eee5e5', borderRadius: '10px', margin: '8px' }}>
              JOIN
            </Button>
          )}
          <Button id='logout' onClick={whenLoginLogout} style={{ fontSize: '15px', backgroundColor: '#d0b5d8', color: '#6f4e83', borderRadius: '10px' }}>
            {para.token ? 'Log Out' : 'Log In'}
          </Button>
        </Toolbar>
        {para.token && (
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={open}
            onClose={whenClose}
          >
            <MenuItem id='createList' onClick={whenClose}><Link to={'/createNewList'}>Create my listings</Link></MenuItem>
            <MenuItem id='myList' onClick={whenClose}><Link to={'/yourList'}>View my listings</Link></MenuItem>
            <MenuItem id='allList' onClick={whenClose}><Link to={'/allList'}>View all listings</Link></MenuItem>
          </Menu>
        )}
      </AppBar>
    </ThemeProvider>
  );
};

function App () {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header token={token} setToken={setToken} />
        <Routes>
          <Route path='/login' element={<LoginForm setToken={setToken}/>}></Route>
          <Route path='/register' element={<RegisterForm setToken={setToken}/>}></Route>
          <Route path='/createNewList' element={<CreateList />} />
          <Route path='/allList' element={<ViewAllList />} />
          <Route path='/yourList' element={<ViewYourList />} />
          <Route path='' element={<Dashboard />}></Route>
          <Route path='/allList/:listingId' element={<ListingDetails />} />
          <Route path='/yourList/:listingId' element={<YourListingDetails />} />
          <Route path='/editListing/:listingId' element={<EditListing />} />
          <Route path='/yourList/:listingId/publish' element={<PublishListing />} />
          <Route path='/yourList/:listingId/requests' element={<ManageRequest />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
