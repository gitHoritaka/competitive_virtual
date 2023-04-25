import { signOut } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { Button } from '@mui/material'

const Logout = ({setIsAuth}) => {
    const navigate = useNavigate();
    const handle_logout =() =>{
        signOut(auth).then(() =>{
            localStorage.clear();
            setIsAuth(false);
            navigate('/login')

        });
    }
  return (
    <div>
        <p>Logout</p>
        <Button variant='contained' onClick={handle_logout}>logout</Button>
    </div>
  )
}

export default Logout