import React,{useEffect,useState} from 'react';
import Problem from './Problem';
import VirtualProblems  from './VirtualProblems';
import axios from "axios";
import "./Home.css"
import { useNavigate } from 'react-router-dom';


const Home = ({isAuth,NeedLoad,setNeedLoad}) => {
    const [problemList,setProblemList] = useState([]);
    const [VirtualProblemList,setVirtualProblemList] = useState([]);
    const [AtcoderUserName,setAtcoderUserName] = useState('');
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
        setNeedLoad(false);
    },[NeedLoad])
    const HandleButtonClick = async(atcoder_user_name) =>{
        const recommended_data = await axios.get(url + "/create_problems",{
            params:{
                user_name:atcoder_user_name,
                flag:"sample",//test_sample用のデータを取ってくる
            }
        }).then((res) =>{
                const dict = res.data;
                const values = Object.keys(dict).map(
                    (key) => { return dict[key] })
                console.log(values)
                setVirtualProblemList(values);

        })
    }
  return (
    <div className='Home'>
        <div>
        <input onChange={(e) => setAtcoderUserName(e.target.value)}></input>
        <button className='Button' onClick={ () => HandleButtonClick(AtcoderUserName)} >Create Virtual Contest</button>
        <VirtualProblems problems = {VirtualProblemList}></VirtualProblems>
        </div>
        <div>
            <label className='TitleProblemList'>ProblemList</label>
            <div className='ProblemContainer'>
                {problemList.map((problem_dict) => {
                    return (
                        <Problem key = {problem_dict.id} problem = {problem_dict} id = {problem_dict.id} setNeedLoad={setNeedLoad}></Problem>
                    )
                }) }
            </div>
        </div>
    </div>
  )
}

export default Home