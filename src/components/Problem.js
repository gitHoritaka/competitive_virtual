import React from 'react'
import axios from 'axios'
import "./Problem.css"

const Problem = ({problem,id,setNeedLoad}) => {
    const HandleDalete = async (id)=>{
        console.log(id);
      const url = "http://127.0.0.1:8000/delete";
      console.log(problem)
        await axios.get(url,{
                params:{
                    user_id:problem.author.id,
                    problem_id:id,
                }
            });
          setNeedLoad(true);
    }
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