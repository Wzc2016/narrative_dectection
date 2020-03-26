import React from "react";
import Sidebar from "react-sidebar";
import { Container, Row, Col } from 'reactstrap';
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePieCanvas } from '@nivo/pie'
import './Demo.css'
import GaugeChart from 'react-gauge-chart'
import Thermometer from 'react-thermometer-component'
import Slider, { Range } from 'rc-slider'; 
import 'rc-slider/assets/index.css';
import { Button, Input, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

var APIUrl_get_curr_topics = 'http://127.0.0.1:8000/get_curr_topics';
var beginDate = '01242020';
var endDate = '02162020';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	error: null,
    	isLoaded: false,
    	topics: [],
      topicOptions: [],
    };

  }

  componentDidMount() {
  	fetch(APIUrl_get_curr_topics)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          topics: result.data,
          topicOptions: result.data.map((e) => {
            return {text: e};
          })
        })
      });

    }
  

  

  // dateParser(date) {
  // 	return date.slice(0, 2) + '-' + date.slice(2, 4) + '-' + date.slice(4,8);
  // }

  

    

  render() {
  	const { error, isLoaded} = this.state;
  	 if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoaded) {
      return <div className='display'>Loading...</div>;
    } else {
	    return (
	        <div className='display'>
            <br/>
            <Button.Group size='large'>
              <Link to={process.env.PUBLIC_URL + "/Realtime"}>
                <Button>
                  Realtime
                </Button>
              </Link>
              <Button.Or />
              <Link to={process.env.PUBLIC_URL + "/Demo"}>
                <Button>
                  Demo
                </Button>
              </Link>
            </Button.Group>
            <h1>Choose a topic!</h1>
            <Dropdown
              className='topic-box'
              placeholder='Select Topic'
              fluid
              search
              selection
              options={this.state.topicOptions}
            />
	        </div>
	    );
	  }
	}
}

export default App;
