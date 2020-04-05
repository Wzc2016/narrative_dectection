import React, { Component } from 'react';
import {Redirect, BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';


import Home from '../Home/Home.jsx'
import Demo from '../Demo/Demo.jsx'
import Realtime from '../Realtime/Realtime.jsx'
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path={process.env.PUBLIC_URL + "/"} component={Home}/>
          <Route exact path={process.env.PUBLIC_URL + "/Search"} component={Realtime}/>
          <Route exact path={process.env.PUBLIC_URL + "/Archive"} component={Demo}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
