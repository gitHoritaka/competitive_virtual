import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css"
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';

const Navbar = ({isAuth}) => {
  const navigate=useNavigate()
  return (
    /*
    <nav>
        <Link to = '/'>Home</Link>
        {!isAuth ? (
        <Link to = '/login'>Login</Link>)
        : (
        <>
        <Link to='/addproblem'>Add Problem</Link>
        <Link to='/logout'>Logout</Link>
        </>
        )}

    </nav>*/
    
    <Box sx={{flexGrow:1}}>
      <AppBar position='static'>
        <Toolbar sx={{left:"8vw",width:"80vw",display:"flex",justifyContent:"space-between"}}>
          <Button color='inherit' onClick={() => navigate("/")} sx={{textTransform:'none'}}>Home</Button>
          {!isAuth ? (<Button color='inherit' onClick={() => navigate("/login")} sx={{textTransform:'none'}}>Login</Button>)
          : (
          <>
          <Button color='inherit' onClick={() => navigate("/addproblem")} sx={{textTransform:'none'}}>AddProblem</Button>
          <Button color='inherit' onClick={() => navigate("/logout")} sx={{textTransform:'none'}}>Logout</Button>
          </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar