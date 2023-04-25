import React, { useEffect } from 'react'
import {addDoc,collection} from "firebase/firestore"
import {auth, db} from "../firebase"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AddProblem.css'
import { Button, TextField } from '@mui/material'

const AddProblem = ({isAuth,setNeedLoad}) => {
  const navigate = useNavigate();
  const [url,setURL] = useState('');
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [dificulty,setDeficulty] = useState(0);
  useEffect(() =>{
    console.log(isAuth)
    if (!isAuth){
      navigate('/login');
    }
  },[])
  const HandleSubmit = (event) =>{
    event.preventDefault();
    console.log("submit");
    addDoc(collection(db,auth.currentUser.uid),{
      url: url,
      title: title,
      description :description,
      dificulty: dificulty,
      author:{
        username: auth.currentUser.displayName,
        id: auth.currentUser.uid,
      }
    });
    setNeedLoad(true);
    navigate("/");
  };
  return (
    <div className='AddProblemBack'>
      <form className = 'register_card' onSubmit = {HandleSubmit}>
          <div>
              <p>input url</p>
              <TextField name = "problem_url" type="url" placeholder = "add url" onChange={(event) => setURL(event.target.value)}  />
          </div>
          <div>
              <p>title</p>
              <TextField name = 'problem_title' type = 'text' placeholder="title" onChange={(event) => setTitle(event.target.value)} ></TextField>
          </div>
          <div>
              <p>description</p>
              <TextField name = "description" type = 'text' planholder = 'describe' onChange = {(event) => setDescription(event.target.value)}></TextField>
          </div>
          <div>
              <p>dificulty</p>
              <TextField type = 'number' placeholder='dificulty'  onChange = {(event) => setDeficulty(event.target.value)}></TextField>
          </div>
          <div>
            <p></p>
              <Button variant='contained' type = 'submit'>register</Button>
          </div>
      </form> 
  </div>
  )
}

export default AddProblem