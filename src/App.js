import React from 'react';
import './App.css';
import Header from "./Components/Header";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import CreateList from "./Components/CreateList"
import Search from '../src/Components/Search';
import Lists from './Components/Lists';
import Friends from "./Components/Friends";
import FindFriends from "./Components/FindFriends";

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Login}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/main" component={Header} />
        <Route exact path="/create-list" component={CreateList} />
        <Route exact path="/search" component={Search}/>
        <Route exact path = '/lists' component = {Lists}/>
        <Route exact path="/friends" component={Friends}/>
        <Route exact path="/findFriends" component={FindFriends}/>
      </div>
    </Router>
  );
}

export default App;
