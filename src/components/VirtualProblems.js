import React from 'react'
import "./VirtualProblems.css"

const VirtualProblems = ({problems}) => {
  return (
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
    </div>
  )
}

export default VirtualProblems