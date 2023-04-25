import {signInWithPopup} from 'firebase/auth'
import React from 'react'
import { auth, provider } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

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
    <div>
        <p>login</p>
        <Button onClick={SignInWithGogle}>sign in with google</Button>
    </div>
  )
}

export default Login