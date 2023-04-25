import React,{useEffect,useState} from 'react';
import Problem from './Problem';
import VirtualProblems  from './VirtualProblems';
import axios from "axios";
import "./Home.css"
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';


const Home = ({isAuth,NeedLoad,setNeedLoad}) => {
    //add dammy data
    const [problemList,setProblemList] = useState([{
        id:1234,
        title:"Home",
        difficulty:4000,
        description:"test data"
    },{
        id:12345,
        title:"TEST",
        difficulty:3000,
        description:"test data 2"
    },{
        id:123456,
        title:"TEST2",
        difficulty:2000,
        description:"test data 3"
    },{
        id:1234567,
        title:"TEST3",
        difficulty:1000,
        description:"test data 4"
    },{
        id:12345678,
        title:"TEST4",
        difficulty:5000,
        description:"test data 5"
    }]);
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
        <input onChange={(e) => setAtcoderUserName(e.target.value)} placeholder='your atcoder-user-name'></input>
        <VirtualProblems problems = {VirtualProblemList}></VirtualProblems>
        </div>
        <div>
            <label className='TitleProblemList'>ProblemList</label>
            <div className='ProblemContainerBack'>
                <div className='ProblemContainer'>
                    {problemList.map((problem_dict) => {
                        return (
                            <Problem key = {problem_dict.id} problem = {problem_dict} id = {problem_dict.id} setNeedLoad={setNeedLoad}></Problem>
                        )
                    })}
                </div>
            </div>
            <Button variant='contained' className='Button' onClick={ () => HandleButtonClick(AtcoderUserName)} >Create Virtual Contest</Button>
        </div>
    </div>
  )
}

export default Home