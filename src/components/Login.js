import {signInWithPopup} from 'firebase/auth'
import React from 'react'
import { auth, provider } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import "./Login.css"

const Login = ({setIsAuth}) => {
    const navigate = useNavigate();//useNavigateはcallback function内で呼び出せない
    const SignInWithGogle = () =>{
        //Google ポップアップでログイン
        signInWithPopup(auth,provider).then((result) =>{
            console.log(result);
            setIsAuth(true);
            localStorage.setItem('isAuth',true);
            localStorage.setItem('user_id',auth.currentUser.uid)
            navigate("/");
        });
    }
  return (
    <div className='LoginField'>
        <p>login</p>
        <Button variant='contained' onClick={SignInWithGogle}>sign in with google</Button>
    </div>
  )
}

export default Login