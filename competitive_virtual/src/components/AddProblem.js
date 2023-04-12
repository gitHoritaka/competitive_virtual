import React, { useEffect } from 'react'
import {addDoc,collection} from "firebase/firestore"
import {auth, db} from "../firebase"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AddProblem.css'

const AddProblem = ({isAuth}) => {
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
    navigate("/");
  };
  return (
    <div >
      <form className = 'register_card' onSubmit = {HandleSubmit}>
          <div>
              <p>input url</p>
              <input name = "problem_url" type="url" placeholder = "add url" onChange={(event) => setURL(event.target.value)}  />
          </div>
          <div>
              <p>title</p>
              <input name = 'problem_title' type = 'text' placeholder="title" onChange={(event) => setTitle(event.target.value)} ></input>
          </div>
          <div>
              <p>description</p>
              <input name = "description" type = 'text' planholder = 'describe' onChange = {(event) => setDescription(event.target.value)}></input>
          </div>
          <div>
              <p>dificulty</p>
              <input type = 'number' placeholder='dificulty'  onChange = {(event) => setDeficulty(event.target.value)}></input>
          </div>
          <div>
            <p></p>
              <button tyoe = 'submit'>register</button>
          </div>

      </form> 
  </div>
  )
}

export default AddProblem