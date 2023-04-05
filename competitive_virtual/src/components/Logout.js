import { signOut } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

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
        <button onClick={handle_logout}>logout</button>
    </div>
  )
}

export default Logout