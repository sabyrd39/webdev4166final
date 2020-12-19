import React, { useEffect, useState } from "react";
import Axios from 'axios';
import {
  Link
} from "react-router-dom";

export default function Signup() {
    const [loginWarnings, setLoginWarnings] = useState("");
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
  
    Axios.defaults.withCredentials = true;
  
    const register = () => {
      if (passwordReg.length > 0) {
      Axios.post('http://localhost:3001/register', {username: usernameReg, password: passwordReg})
      .then((response) => {
        if (response.data === "Duplicate") {
          setLoginWarnings("An account with this username already exists.")
        } else {
          setLoginWarnings("Account Created Successfully!")
          //document.querySelector('button.appearHere').innerHTML = "<button><Link to='/dashboard'>Continue Here</Link></button>";
        }
      });
    } else {
      setLoginWarnings("The account password cannot be empty.")
    }
    };
  
    useEffect(() => {
      Axios.get('http://localhost:3001/login').then((response) => {
        if (response.data.loggedIn === true) {
          setLoginWarnings(response.data.user[0].username);
        }  
      });
    }, []);
  
    return (
      <div className="App">
        <h1 className="title">A Budgeting Application By Seth Byrd</h1>
        <div className="loginForm"> 
          <h1>Account Creation</h1>
          <input type="text" placeholder="Username" name="username" onChange={(e) => {setUsernameReg(e.target.value)}} />
          <input type="text" placeholder="Password" name="password" onChange={(e) => {setPasswordReg(e.target.value)}} />
          <button className="appearHere" onClick={register}>Create Account</button>
          <br></br>
          <button><Link to='/login'>Continue Here</Link></button>"
        </div>
        <h1>{loginWarnings}</h1>
      </div>
    );
}