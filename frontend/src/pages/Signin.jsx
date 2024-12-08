import { useContext, useRef, useState } from "react";
import "./Signin.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Login() {

  const email = useRef();
  const password = useRef();
  const [admin , setadmin] = useState(false);
  const[userrole , setuserrole] = useState(false);
  const Navigate = useNavigate();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if(userrole === true){ 
      
      const loginUser = async (userCredential, dispatch) => {  
        dispatch({ type: "LOGIN_START" });
        try {
          const res = await axios.post( `${process.env.REACT_APP_BACKENDAPI}/api/user/signin`, userCredential);
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
          console.log(res);
          Navigate(`/dashboard/${res.data.user.name}`)
          
        } catch (err) {
          dispatch({ type: "LOGIN_FAILURE", payload: err });
          alert("Incorrect credentials")
        }
      }

      const userCredential =  { email: email.current.value, password: password.current.value };
      loginUser(userCredential , dispatch);

  }

    if(admin === true){

      const loginUser = async (userCredential, dispatch) => {  
        dispatch({ type: "LOGIN_START" });
        try {
          const res = await axios.post( `${process.env.REACT_APP_BACKENDAPI}/api/admin/signin`, userCredential);
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
          console.log(res.data)
          Navigate(`/monitorslots/${res.data.centerId}`)
          
        } catch (err) {
          dispatch({ type: "LOGIN_FAILURE", payload: err });
          alert("Incorrect credentials")
        }
      }

      const userCredential =  { email: email.current.value, password: password.current.value };
      loginUser(userCredential , dispatch);
     
    }
  };

  return (
    <div className='login'>
        <div className='loginwrapper'>
          <div className='loginlogo'>
            <span>Game Theory</span>
           </div>
           <div className='loginform'>
            <span className="logintitle">Login </span> 
           <form onSubmit={handleLogin}>
           <div className='roleinput'>
              <span>Login as</span> <br />
              <input type="radio"  name='role' required   onChange={(e) => setuserrole(true)}/> <label htmlFor="user">User</label> <br/>
              <input type="radio" name='role' required   onChange={(e) => setadmin(true)}/> <label htmlFor="admin">I own a games centre</label>
              </div>
             <input type="email" placeholder='email'  className="logininput" ref={email} required/>
              <input type="password" placeholder='password' ref={password}  className="logininput" required/><br />
               <button type='submit' className="loginButton" disabled={isFetching}  >Login</button>
           </form>
           </div>
        </div>
    </div>
  )
}