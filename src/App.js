import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Navbar from "./components/Navbar";
import AddProblem from "./components/AddProblem";
import { useState } from "react";
import "./App.css"
import Share from "./components/Share";

function App() {
  const [isAuth,setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [NeedLoad,setNeedLoad] = useState(false);
  const [VirtualProblemList,setVirtualProblemList] = useState([
      {name:"test1",url:"https://atcoder.jp/"},
      {name:"dammy1",url:"https://atcoder.jp/"},
  ]);
  
  const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
  );
  //https://qiita.com/kotarosz1/items/9c0841ef26a2947a21a9

  let uuidKey="competitive_virtual_uuid"
  let virtualContestUrl;
  if (localStorage.getItem(uuidKey)===null){
    virtualContestUrl=uuid();
    localStorage.setItem(uuidKey,virtualContestUrl)
  }else{
    virtualContestUrl=localStorage.getItem(uuidKey)
  }
  virtualContestUrl="/share/"+virtualContestUrl

  return (
    <div className="Root">
    <Router >
      <Navbar isAuth = {isAuth}/>
      <Routes>
        <Route path = "/" element = {<Home isAuth={isAuth} NeedLoad = {NeedLoad} setNeedLoad ={setNeedLoad} virtualContestUrl={virtualContestUrl} VirtualProblemList={VirtualProblemList} setVirtualProblemList={setVirtualProblemList} />}></Route>
        <Route path = "/addproblem" element = {<AddProblem isAuth = {isAuth} setNeedLoad = {setNeedLoad} />}></Route>
        <Route path = "/login" element = {<Login setIsAuth = {setIsAuth} />}></Route>
        <Route path = "/logout" element = {<Logout setIsAuth = {setIsAuth}/>}></Route>
        <Route path = {virtualContestUrl} element = {<Share isAuth={isAuth} virtualContestUrl={virtualContestUrl} VirtualProblemList={VirtualProblemList}/>} ></Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
