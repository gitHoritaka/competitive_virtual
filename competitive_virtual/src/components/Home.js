import React,{useEffect,useState} from 'react';
import Problem from './Problem';
import axios from "axios";
import "./Home.css"
import { useNavigate } from 'react-router-dom';


const Home = ({isAuth}) => {
    const [problemList,setProblemList] = useState([]);
    const url = "http://127.0.0.1:8000";
    const navigate = useNavigate()
    useEffect(() =>{
        const getProlems = async () =>{
            const user_id = localStorage.getItem('user_id');
            console.log(user_id);
            const firebase_data = await axios.get(url,{
                params:{
                    id:user_id,
                }
            }).then((res) =>{
                const dict = res.data;
                const values = Object.keys(dict).map(
                    (key) => { return dict[key] })
                setProblemList(values);
            });
            console.log(problemList);
        };
        if (isAuth){
            getProlems();
        }
        else{
            navigate('/login');
        }
    },[])
  return (
    <div className='Home'>
        <div>
        <button className='Button'>Create Virtual Contest</button>
        </div>
        <div>
            <label className='TitleProblemList'>ProblemList</label>
            <div className='ProblemContainer'>
                {problemList.map((problem_dict) => {
                    return (
                        <Problem key = {problem_dict.id} problem = {problem_dict} id = {problem_dict.id}></Problem>
                    )
                }) }
            </div>
        </div>
    </div>
  )
}

export default Home