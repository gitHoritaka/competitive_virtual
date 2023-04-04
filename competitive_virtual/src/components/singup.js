import {useState} from 'react'
import { auth } from '../firebase';
const SignUp = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const handle_submit = (event) =>{
        event.preventDefault();
        console.log("registration");
        console.log(email,password);
        auth.createUserWithEmailAndPassword(email, password);
    };
    const handleChangeEmail = (event) =>{
        setEmail(event.currentTarget.value)
    };
    const handleChangePassword = (event) =>{
        setPassword(event.currentTarget.value)
    };
    return (
    <div>
    <h1>registration</h1>
    <form onSubmit = {handle_submit}>
        <div>
            <label>mail adress</label>
            <input name = "email" type="email" placeholder = "email" onChange={(event) => handleChangeEmail(event)}  />
        </div>
        <div>
            <label>password</label>
            <input name = 'password' type = 'password' placeholder="password" onChange={(event) => handleChangePassword(event)} ></input>
        </div>
        <div>
            <button tyoe = 'submit'>register</button>
        </div>

    </form> 
    </div>

    );
};
export default SignUp