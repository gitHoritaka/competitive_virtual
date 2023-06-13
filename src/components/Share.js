import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material'
import "./Share.css"

import {
  TwitterShareButton,
  TwitterIcon,
} from 'next-share'

var interrupt=false;

const Share = ({isAuth,VirtualProblemList}) => {
  const navigator=useNavigate();
  const location = useLocation();
  if (!isAuth){
    navigator("/login");
  }
  const [contestTime,setContestTime] = useState(100);
  var endTime=NaN
  var seconds=0;
  const [isOnContest, setIsOnContest] = useState(false);
  let timerInterval=NaN;
  const [displayMinutes,setDisplayMinutes] = useState(0);
  const [displaySeconds,setDisplaySeconds] = useState(0);

  const setContestTimer = ()=>{
    let time=document.getElementById("timer").value
    let ntime=Number(time)
    if ( !isNaN(ntime) ) {
      setContestTime(ntime)
    }
  }

  const startTimer = () =>{
    seconds=contestTime * 60;
    endTime = new Date()
    endTime.setMinutes(endTime.getMinutes() + contestTime )
    setIsOnContest(true);

    Notification.requestPermission();

    timerInterval = setInterval(setCurrentTimer,200);
  }
  const setCurrentTimer = () => {
    if (endTime.getTime() <= new Date().getTime() || interrupt){
      if (!interrupt){
        const notification = new Notification("Contest finished!")
      }
      setDisplayMinutes(0)
      setDisplaySeconds(0)
      setIsOnContest(false)
      clearInterval(timerInterval)
      interrupt=false
    }

    let diff = endTime.getTime() - new Date().getTime();
    setDisplayMinutes( Math.floor(diff/60000) )
    setDisplaySeconds( Math.floor(diff/1000 % 60) )
  }

  const stopTimer = () => {
    console.log("stop")
    interrupt=true;
  }

  return (
    <div className='back'>
      <div className='main'>
        <Box sx={{backgroundColor:"white",width:"40vw"}}>
        <List>
          <ListItemText primary="contest problems"/>
          {VirtualProblemList.map((problem)=>{
            return (
              <>
              <Divider/>
              <ListItem sx={{padding:0,}}>
                <ListItemButton component="a" href={problem.url} target='_blank'>
                  <ListItemText primary={problem.name}/>
                </ListItemButton>
              </ListItem>
              </>
            )
          })}
        </List>
        </Box>
        <Box sx={{width:"20px"}}/>
        <Box sx={{width:"40vw"}}>
          <div><p> contest time limit : <TextField id="timer" size='small' placeholder='minutes' sx={{maxWidth:"100px"}}></TextField></p></div>
          { !isOnContest && <Button variant='contained' onClick={()=>setContestTimer()}>set timer</Button>}
          <p>contest time limit : {contestTime} min { !isOnContest && <Button variant='contained' onClick={() => startTimer()}>start</Button>} </p>
          { isOnContest && <p>time limit /  {displayMinutes} : {displaySeconds} <Button variant='contained' onClick={()=> stopTimer()}>stop</Button></p>}
        </Box>
      </div>
      <TwitterShareButton
        url={window.location.href}
        title={"Code on the virtual contest!\n"}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </div>)
}

export default Share