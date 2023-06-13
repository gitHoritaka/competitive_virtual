import React,{useEffect,useState} from 'react';
import Problem from './Problem';
import VirtualProblems  from './VirtualProblems';
import axios from "axios";
import "./Home.css"
import { useNavigate } from 'react-router-dom';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';


const Home = ({isAuth,NeedLoad,setNeedLoad,virtualContestUrl,VirtualProblemList,setVirtualProblemList}) => {
    //add dammy data, need delete
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
        description:"long text... long text... long text... long text... long text... // long text... long text... long text... long text... long text... long text... long text... long text...// long text... long text... long text... long text... long text... long text... long text... long text...  "
    }]);
    //add dammy, need delete
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
        <div className="InputUserName">
        <TextField size="small" onChange={(e) => setAtcoderUserName(e.target.value)} placeholder='your atcoder-user-name' sx={{maxWidth:"30vw"}}/>
        </div>
        <div className='VirtualProblemsField'>
            <Box sx={{display: "flex",flexDirection: "column",alignItems: "center",minWidth:400}}>
                <VirtualProblems problems = {VirtualProblemList}></VirtualProblems>
                <Button variant='contained' className='Button' onClick={ () => HandleButtonClick(AtcoderUserName)} >Create Virtual Contest</Button>
                {VirtualProblemList.length!==0 && <Button variant='contained' className='ShareButton' onClick={() => navigate(virtualContestUrl)}>Start</Button>}
            </Box>
        </div>
        <div>
            <label className='TitleProblemList'>ProblemList</label>
            <Box sx={{
                backgroundColor : "white",
                minWidth:800,}}>
                <Table sx={{minWidth:700,}} aria-label="caption table">
                    <caption>your selected problems</caption>
                <TableHead>
                    <TableRow>
                        <TableCell>title</TableCell>
                        <TableCell align='right'>difficulty</TableCell>
                        <TableCell align='right' sx={{textAlign:"center"}}>description</TableCell>
                        <TableCell align='right'>deleteButton</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className='ProblemContainer'>
                    {problemList.map((problem_dict) => {
                        return (
                            <Problem key = {problem_dict.id} problem = {problem_dict} id = {problem_dict.id} setNeedLoad={setNeedLoad}></Problem>
                        )
                    })}
                </TableBody>
                </Table>
            </Box>
        </div>
    </div>
    )
}

export default Home