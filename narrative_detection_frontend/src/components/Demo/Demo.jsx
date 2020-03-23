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
import { Button, Input } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

var API = 'http://127.0.0.1:8000/polar_result/demo/';
var beginDate = '01242020';
var endDate = '02162020';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	error: null,
    	isLoaded: false,
    	sidebarOpen: true,
        selected: 0,
    	currentTopic:"ACFT",
    	positive: 0,
    	negative: 0,
    	neutral: 0,
    	total: 0,
    	threshold: 100,
    	date: '',
    	dayChange: 0,
    	sliderVal: 1,
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.sliderHandler = this.sliderHandler.bind(this);
    this.sliderTxtHandler = this.sliderTxtHandler.bind(this);
  }

  componentDidMount() {
  	fetch(API + this.state.currentTopic + '/' + endDate)
  	.then(res => res.json())
  	.then(
  		(result) => {
  			this.setState({
  				dayChange: result.positive + result.negative + result.neutral,
  			})
  			console.log(result);
  		}
  	);
  	fetch(API + this.state.currentTopic + '/' + beginDate + '/' + endDate)
  	.then(res => res.json())
  	.then(
  		(result) => {
  			this.setState({
  				isLoaded: true,
  				positive: result.positive,
  				negative: result.negative,
  				neutral: result.neutral,
  				total: result.positive + result.negative + result.neutral,
  			})
  			console.log(result);
  		}

  	);
  }

  sliderTxtHandler(e) {

  }

  sliderHandler(e) {
  	console.log(e);
  	this.setState({
  		isLoaded: false,
  		sliderVal: e,
  	})
  	if(e < 9) {
  		endDate = '01' + (23 + e).toString() + '2020';
  	} else if(e < 18){
  		endDate = '020' + (e - 8).toString() + '2020';
  	} else {
  		endDate = '02' + (e - 8).toString() + '2020';
  	}
  	this.componentDidMount();
  }

  dateParser(date) {
  	return date.slice(0, 2) + '-' + date.slice(2, 4) + '-' + date.slice(4,8);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

    changeTitle = (title) => {
        this.setState(
            { currentTopic: title,
                sidebarOpen: false }
            );
    }

    changeColor = (number) => {
        this.setState(
            { selected: number}
        );
    }

    myColor =(position) => {
        if (this.state.selected === position) {
            return "grey";
        }
        return "";
    }

  render() {
  	const { error, isLoaded} = this.state;
  	 if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
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
	            <h1>
	                {this.state.currentTopic}
	            </h1>
	            <h2>
	            	{'From ' + this.dateParser(beginDate) + ' to ' + this.dateParser(endDate)}
	            </h2>
	            <div className='date-slider'>
	            	<Slider className='slider'
	            	ariaLabelForHandle='hello'
	            	ariaLabelledByForHandle='hello'
	            	ariaValueTextFormatterForHandle={this.sliderTxtHandler}
	            	onAfterChange={this.sliderHandler}
	            	max={24}
	            	min={1}
	            	defaultValue={this.state.sliderVal}/>
	            </div>
	            <div className='charts'>
	            	<div>
			            <GaugeChart id="gauge-chart1" 
			              nrOfLevels={2} 
			              animate={false}
			              percent={(2 * this.state.positive + 1 * this.state.neutral)/(2 * this.state.total)}
			           	  hideText={true}
			            />
			            Sentiment
		            </div>
		            <div>
			            <GaugeChart id="gauge-chart2" 
			              nrOfLevels={1} 
			              animate={false}
			              percent={Math.min(this.state.dayChange/this.state.threshold, 1)}
			              hideText={true}
			            />
			            Activity
			        </div>
		            <div>

			            <div className='temperature'>
				            <Thermometer
							  theme="light"
							  value={Math.min(this.state.dayChange, 100).toString()}
							  max="100"
							  size="normal"
							  height="150"
							/>
						</div>
						<br/>
						Alert Status
					</div>
	            </div>

	            
	        </div>
	    );
	  }
	}
}

export default App;
