import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import logo from './logo.svg';
import './App.css';

// include new components here!


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/Realtime" component={Realtime}/>
        </Switch>
      </Router>
    );
  }
}

export default App;