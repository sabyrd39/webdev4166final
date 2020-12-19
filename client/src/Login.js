import React, { useEffect, useState } from "react";
import Axios from 'axios';
import {
  Link
} from "react-router-dom";

function Login() {
    const [loginWarnings, setLoginWarnings] = useState("");
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    Axios.defaults.withCredentials = true;
  
    const login = () => {
      Axios.post('/login', {username: username, password: password})
      .then((response) => {
        if (response.data === "Incorrect") {
          setLoginWarnings("The password is incorrect.");
        } else if (response.data.message === "No Match User") {
          setLoginWarnings("A user with this username cannot be found!");
        } else {
          setLoginWarnings(response.data.result[0].username + " has logged in successfully!");
          var dashButton = document.getElementById('dashboardButton');
          dashButton.style.display = 'block';
          localStorage.setItem('jwt', response.data.token);
        }
      });
    };
  
    const register = () => {
      if (passwordReg.length > 0) {
      Axios.post('/register', {username: usernameReg, password: passwordReg})
      .then((response) => {
        if (response.data === "Duplicate") {
          setLoginWarnings("An account with this username already exists.")
        } else {
          setLoginWarnings("Account Created Successfully!")
        }
      });
    } else {
      setLoginWarnings("The account password cannot be empty.")
    }
    };
  
    useEffect(() => {
      Axios.get('/login').then((response) => {
        if (response.data.loggedIn === true) {
          setLoginWarnings(response.data.user[0].username + " is currently logged in.");
          var dashButton = document.getElementById('dashboardButton');
          dashButton.style.display = 'block';
        }  
      });
    }, []);

    const logout = () => {
      Axios.get('/logout')
      .then((response) => {
        if (response.data.loggedIn === false) {
          setLoginWarnings("The user has been signed out.");
          var dashButton = document.getElementById('dashboardButton');
          dashButton.style.display = 'none';
        } else if (response.data === "Fail") {
          setLoginWarnings("There are no users logged in.");
        } else {
          setLoginWarnings("Error in logout");
        }
      });
    };
          
  
    return (
      <div className="login">
        <div className="loginForm">
          <h3 className="loginHeader">User Login</h3>
          <input type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value)}} />
          <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} />
          <br></br>
          <button className = "buttonOne" onClick={login}>Log in</button>
          <br></br>
          <br></br>
          <br></br>
        </div>
        <div className="loginForm"> 
          <h3 className="loginHeader">Account Creation</h3>
          <input type="text" placeholder="Username" name="username" onChange={(e) => {setUsernameReg(e.target.value)}} />
          <input type="text" placeholder="Password" name="password" onChange={(e) => {setPasswordReg(e.target.value)}} />
          <br></br>
          <button className="buttonOne" onClick={register}>Create Account</button>
          <br></br>
          <br></br>
          <br></br>
        </div>
        <button id="dashboardButton"><Link to='/dashboard'>Expense Dashboard</Link></button>
        <br></br>
        <h3 className="loginWarnings">{loginWarnings}</h3>
        <br></br>
        <button className="logButton" onClick={logout}>Log Out</button>
        <br></br>
      </div>
    );
}

export default Login;