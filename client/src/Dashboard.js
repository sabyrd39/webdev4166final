import React, { useEffect, useState } from "react";
import Chart from 'chart.js';
import Axios from 'axios';
import {
    Link
  } from "react-router-dom";


function Dashboard() {
    const [expenseName, setExpenseName] = useState('');
    const [loginWarnings, setLoginWarnings] = useState('');
    const [expenseBudget, setExpenseBudget] = useState('');

    Axios.defaults.withCredentials = true;

    function getBudget() {
        Axios.get('/budget/')
                .then(function (res) {
                    if (res === "0") {
                        setLoginWarnings("Error.");
                    } else if (res === "You have 0 items in your budget to display.") {
                        setLoginWarnings("You have 0 items in your budget to display.");
                    } else if (res === "There is not a user signed in. Please return to login") {
                        setLoginWarnings("There is not a user signed in. Please return to login");
                    } else {
                        console.log(res.data);
                        /*var ctx = document.getElementById("myChart1");
                        var myPieChart = new Chart(ctx, {
                            type: 'pie',
                            data: res.data
                        });
                        var ctx = document.getElementById("myChart2");
                        var myPieChart2 = new Chart(ctx, {
                            type: 'bar',
                            data: res.data
                        });
                        var ctx = document.getElementById("myChart3");
                        var myPieChart3 = new Chart(ctx, {
                            type: 'doughnut',
                            data: res.data
                        });*/

                        }
                    }
                )
        };

        const addExpense = () => {
            if (expenseName !== "") {
            Axios.get('/login/').then((response) => {
                if (response.data.loggedIn === true) {
                    var currentUserID = response.data.user[0].id;
                    Axios.post('/addExp/', {currentID: currentUserID, expenseName: expenseName, expenseBudget: expenseBudget})
                        .then((response) => {
                            console.log(response.data);
                                if (response.data === 1) {
                                    setLoginWarnings("An item already exists with this name within your budget.");
                                } else if (response.data === 2) {
                                    setLoginWarnings("Item " + expenseName + " with value " + expenseBudget + " has been added to your monthly budget.");
                                }
                        })
                } else {
                    setLoginWarnings("There is not a user signed in. Please return to login");
                }
            });
            } else {
                setLoginWarnings("The item name cannot be null.");
            }
          };

          const removeExpense = () => {
            if (expenseName !== "") {
            Axios.get('/login/').then((response) => {
                if (response.data.loggedIn === true) {
                    var currentUserID = response.data.user[0].id;
                    Axios.post('/rmExp/', {currentID: currentUserID, expenseName: expenseName})
                        .then((response) => {
                                if (response.data === 1) {
                                    setLoginWarnings("Item " + expenseName + " has been removed from your monthly budget.")
                                } else if (response.data === 0) {
                                    setLoginWarnings("Error");
                                } else if (response.data === 2) {
                                    setLoginWarnings("There are no items in your profile titled " + expenseName);
                                }
                        })
                } else {
                    setLoginWarnings("There is not a user signed in. Please return to login");
                }
            });
            } else {
                setLoginWarnings("The item name cannot be null.");
            }
          };

return (
    <div className="login">
        <div className="loginForm">
            <h3 className="loginHeader">Add Budget Item</h3>
            <input type="text" placeholder="Expense Name" name="expenseName" onChange={(e) => {setExpenseName(e.target.value)}}/>
            <input type="text" placeholder="Expense Amount" name="expenseBudget" onChange={(e) => {setExpenseBudget(e.target.value)}} />
            <br></br>
            <button className="buttonOne" onClick={addExpense}>Add Budget Item</button>
            <br></br>
            <br></br>
            <br></br>
        </div>
        <div className="loginForm"> 
            <h3 className="loginHeader">Remove Budget Item</h3>
            <input type="text" placeholder="Expense Name" name="expenseName" onChange={(e) => {setExpenseName(e.target.value)}} />
            <br></br>
            <button className="buttonOne" onClick={removeExpense}>Remove Item</button>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <button id="returnToLoginButton"><Link to='/login'>Return To Login</Link></button>
            <br></br>
            <h3 className="loginWarnings">{loginWarnings}</h3>
            <br></br>
            <button className="buttonOne" onClick={getBudget}>Get Budget</button>
            <br></br>
        </div>
        <div className="charts">
            <canvas id="myChart1" height="200" width="200"/>
            <canvas id="myChart2" height="200" width="200"/>
            <canvas id="myChart3" height="200" width="200"/>
        </div>
    </div>
  );
}

export default Dashboard;