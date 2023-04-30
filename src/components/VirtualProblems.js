import React from 'react'
import "./VirtualProblems.css"
import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material'

const VirtualProblems = ({problems}) => {
  return (
    /*
    <div>
        <label className='label'>Hello</label>
        {problems.map((problem) => {
            return (
                <div>
                <label key={problem.name}>{problem.name}</label>
                <label key={problem.url}> {problem.url}</label>
                </div>
            )

        })}
    </div>*/
    <Box sx={{backgroundColor:"white",maxWidth:400,minWidth:300}}>
    <List>
      <ListItemText primary="contest problems"/>
      {problems.map((problem)=>{
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
  )
}

export default VirtualProblems