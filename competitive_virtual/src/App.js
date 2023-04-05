import SignUp from "./components/singup";
import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom"
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Navbar from "./components/Navbar";
import AddProblem from "./components/AddProblem";
import { useState } from "react";
function App() {
  const [isAuth,setIsAuth] = useState(false);
  return (
    <Router>
      <Navbar isAuth = {isAuth}/>
      <Routes>
        <Route path = "/" element = {<Home/>}></Route>
        <Route path = "/addproblem" element = {<AddProblem/>}></Route>
        <Route path = "/login" element = {<Login setIsAuth = {setIsAuth}/>}></Route>
        <Route path = "/logout" element = {<Logout setIsAuth = {setIsAuth}/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
