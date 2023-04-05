import React from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css"

const Navbar = ({isAuth}) => {
  return (
    <nav>
        <Link to = '/'>Home</Link>
        <Link to = '/addproblem'>Add Problem</Link>
        {!isAuth ? 
        <Link to = '/login'>Login</Link>
        : <Link to = '/logout'>Logout</Link>}

    </nav>
  )
}

export default Navbar