const express = require('express')
const mysql = require("mysql");
const e = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwtKey = "A secret key for JWT";
var loggedInID = 0;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });

  /*const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'https://webdev4166final.herokuapp.com'];
  const corsOptions = {
    origin: function (origin, callback) {
      console.log("** Origin of request " + origin)
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        console.log("Origin acceptable")
        callback(null, true)
      } else {
        console.log("Origin rejected")
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
  app.use(cors(corsOptions))*/

app.use(express.json());

const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    key: "userId",
    secret: "KodaMikko123!!",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 1000 * 100,
    },
}));

const bcrypt = require("bcryptjs");
const iter = 10;

const db = mysql.createConnection({
    host     : 'sql9.freemysqlhosting.net',
    user     : 'sql9374913',
    password : 'TBe7wjmHE8',
    database : 'sql9374913'
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, iter, (err, hash) => {
        if (err) {
            console.log(err);
        }
        db.query("SELECT * FROM user WHERE username = ?", 
            [username], 
            (err, result) => {
                if (err) {
                    res.send({err: err})
                } 
                else {
                    if (result.length > 0) {
                        res.send("Duplicate");
                    } else {
                        db.query("INSERT INTO user (username, password) VALUES (?,?)", 
                        [username, hash], 
                        (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        res.send("NewAcct");
                    }   
                }
            });
    })    
});

app.get('/budget', (req, res) => {
    if (req.session.user) {
        db.query("SELECT * FROM budget WHERE assignedUserID = ?",  
            req.session.user[0].id,
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.send("0");
                } 
                else {
                    if (result.length === 0) {
                        res.send("You have 0 items in your budget to display.");
                    } else {
                        console.log("DATA RESULT:" + result);
                        var dataSource = {
                            datasets: [
                                {
                                        data: [],
                                        backgroundColor: [                      
                                        ],
                                    }
                                ],
                                labels: []
                            };
                        var dataLength = result.length;

                        for (var i = 0; i <= dataLength-1; i++) {
                            dataSource.datasets[0].data[i] = result[i].budget;
                            console.log(dataSource.datasets[0]);
                            dataSource.labels[i] = result[i].title;
                            var randomColor = Math.floor(Math.random()*16777215).toString(16);
                            dataSource.datasets[0].backgroundColor[i] = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
                        }
                        res.json(dataSource);
                    }
                }
            });
    } else {
        res.send("There is not a user signed in. Please return to login");
    }
});

app.post('/addExp', (req, res) => {
    const expType = req.body.expenseName;
    const expBudget = req.body.expenseBudget;
    const theID = req.body.currentID;
    db.query("SELECT * FROM budget WHERE (title, assignedUserID) = (?,?)", 
    [expType, theID],
    (err, result) => {
        if (err) {
            console.log(err);
            res.send("0");
        } 
        else {
            if (result.length === 0) {
                db.query("INSERT INTO budget (title, budget, assignedUserID) VALUES (?,?,?)", 
                    [expType, expBudget, theID], 
                        (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.send("2");
                            }
                });
            } else {
                res.send("1");
            }
        }
    });
});

app.post('/rmExp', (req, res) => {
    const expType = req.body.expenseName;
    const theID = req.body.currentID;
    db.query("DELETE FROM budget WHERE (title, assignedUserID) = (?, ?)", 
    [expType, theID],
    (err, result) => {
        if (err) {
            res.send("0");
        } 
        else if (result) {
            res.send("1");
        } else {
            res.send("2");
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query("SELECT * FROM user WHERE username = ?", 
    username, 
    (err, result) => {
        if (err) {
            res.send({err: err})
        } 
        else {
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        loggedInID = result[0].id;
                        req.session.user = result;
                        const usersID = result[0].id;
                        let token = jwt.sign({usersID}, jwtKey, { expiresIn: 2500,});
                        res.json({auth: true, token: token, result: result});
                    } else {
                        res.send("Incorrect")
                    };
                })
            } else {
                res.send({message: "No Match User"})
            }
        }
    });
});

app.get('/logout', (req,res) => {
    if (req.session.user) {
        res.clearCookie('userId');
        res.json({loggedIn: false});
    } else {
        res.send("Fail");
    }
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false});
    }
});

app.get('/dashboard', (req, res) => {
    if (loggedInID != 0) {
        res.json({loggedInID: loggedInID});
    } else {
        res.send("There are no users logged in.");
    }
});

const PORT = process.env.PORT || 3001;  
app.listen(PORT, "0.0.0.0", process.env.port, () => {
    console.log(`TRUE port: ${process.env.PORT}`);
    console.log(`Running on the following port: ${PORT}`);
});