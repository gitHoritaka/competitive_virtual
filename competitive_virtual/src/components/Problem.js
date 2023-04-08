import React from 'react'
import { deleteDoc,doc } from 'firebase/firestore';
import { db,clname } from '../firebase';
import "./Problem.css"

const Problem = ({problem,id}) => {
    const HandleDalete = async (id)=>{
        await deleteDoc(doc(db,clname,id));
        window.location.href ='/';
    };
  return (
    <div className='card'>
        <label>{problem.dificulty}</label>
        <label className= 'title'>{problem.title}</label>
        <button className = 'deleteButton' onClick={() =>HandleDalete(id)}>delete</button>
        <br></br>
        <label className = 'description'>{problem.description}</label>
    </div>
  )
};

export default Problem