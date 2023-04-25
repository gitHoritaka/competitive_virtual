import React from 'react'
import axios from 'axios'
import "./Problem.css"
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';

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
    <Card sx={{minWidth:300,minHeight:200}}>
      <CardContent>
        <Typography sx={{fontSize:20}} color="text.primary" href="https://atcoder.jp/">
          {problem.title}
        </Typography>
        <Typography sx={{fontSize:15}} color="text.primary">
          {problem.difficulty}
        </Typography>
        <Typography sx={{fontSize:15}} color="text.primary" component="p">
          {problem.description}
        </Typography>
        <a href='https://atcoder.jp/'>jump to problem</a>
      </CardContent>
      <CardActions>
        <Button sx={{bottom:0}} size='small' variant='contained' onClick={() =>HandleDalete(id)} >delete</Button>
      </CardActions>
    </Card>
  )
};

export default Problem