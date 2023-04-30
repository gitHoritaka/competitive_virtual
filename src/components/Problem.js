import React from 'react'
import axios from 'axios'
import "./Problem.css"
import { Button, Card, CardActions, CardContent, Link, TableCell, TableRow, Typography } from '@mui/material';

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
    //color dict
    return (
    /*<div className='card'>
        <label>{problem.difficulty}</label>
        <label className= 'title'>{problem.title}</label>
        <button className = 'deleteButton' onClick={() =>HandleDalete(id)}>delete</button>
        <br></br>
        <label className = 'description'>{problem.description}</label>
    </div>*/
    <TableRow key={problem.title}>
      <TableCell component="th" space="row">
        <Link href="https://atcoder.jp/" target='_blank'>{problem.title}</Link>
      </TableCell>
      <TableCell align="right">{problem.difficulty}</TableCell>
      <TableCell align="right" sx={{textAlign:"center", overflow:"hidden"}}>{problem.description}</TableCell>
      <TableCell align="right">
        <Button onClick={() =>HandleDalete(id)}>delete</Button>
      </TableCell>
    </TableRow>
  )
};

export default Problem