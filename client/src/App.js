import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';

import Login from './Login';
import Dashboard from './Dashboard';
import Signup from './Signup';
import Header from './Header';

import { render } from '@testing-library/react';

export default function App() {

  return (
    <Router>
      <Header/>
      <Switch>
        <Route path="/dashboard">
          <Dashboard/>
        </Route>
        <Route path="/signup">
          <Signup/>
        </Route>
        <Route path="/">
          <Login/>
        </Route>
      </Switch>
    </Router>
  );
}

