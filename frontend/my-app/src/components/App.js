import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home/Home.js";
import Login from "./Login/Login.js";
import Register from "./Register/Register.js";
import LoggedIn from "./LoggedIn/Loggedin.js";
import RegisterInfo from "./RegisterInfo/RegisterInfo.js";
import { RiH1 } from "react-icons/ri";
const App = () => {
  return (
    <Router>
      <Route exact path='/' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/user' component={LoggedIn} />
      <Route exact path='/registerInfo' component={RegisterInfo} />
    </Router>
  );
};

export default App;
