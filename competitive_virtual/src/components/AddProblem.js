import React from 'react'

const AddProblem = () => {
  const HandleChangeURL = (event) =>{
  };
  const HandleChangeTitle = (event) => {
  };
  const HandleSubmit = (event) =>{
    console.log("submit");
  };
  return (
    <div>
      <h1>add problem</h1>
    <form onSubmit = {HandleSubmit}>
        <div>
            <label>input url</label>
            <input name = "problem_url" type="url" placeholder = "add url" onChange={(event) => HandleChangeURL(event)}  />
        </div>
        <div>
            <label>title</label>
            <input name = 'problem_title' type = 'text' placeholder="title" onChange={(event) => HandleChangeTitle(event)} ></input>
        </div>
        <div>
            <button tyoe = 'submit'>register</button>
        </div>

    </form> 
    </div>
  )
}

export default AddProblem