import React from "react";
import Sidebar from "react-sidebar";
import { Container, Row, Col } from 'reactstrap';
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePieCanvas } from '@nivo/pie'
import {pie_data, line_data, line_pos_neg,activity_pie_data} from "./data";
import './App.css'
import GaugeChart from 'react-gauge-chart'
import Thermometer from 'react-thermometer-component'
import Slider, { Range } from 'rc-slider'; 
import 'rc-slider/assets/index.css';


var API = 'http://127.0.0.1:8000/polar_result/';
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
      return <div>Loading...</div>;
    } else {
	    return (
	        	<div className='display'>
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

// function linechart(data) {
//     return (
//         <ResponsiveLine
//             data={data}
//             curve="natural"
//             // width={1000}
//             // height={500}
//             axisTop={null}
//             axisRight={null}
//             axisBottom={{
//                 orient: 'bottom',
//                 tickSize: 10,
//                 tickPadding: 5,
//                 tickRotation: 0,
//                 legend: 'Date',
//                 legendOffset: 36,
//                 legendPosition: 'middle',
//                 format: "%b %d"
//             }}
//             axisLeft={{
//                 orient: 'left',
//                 tickSize: 10,
//                 tickPadding: 5,
//                 tickRotation: 0,
//                 legend: 'activity count',
//                 legendOffset: -40,
//                 legendPosition: 'middle'
//             }}
//             margin={{
//                 top: 50,
//                 right: 50,
//                 bottom: 50,
//                 left: 50
//             }}
//             yScale={{
//                 type: "linear",
//                 stacked: false,
//                 min: 0,
//                 max: "auto"
//             }}
//             xScale={{
//                 type: "time",
//                 precision: "day",
//                 format: "native"
//             }}
//             legends={[
//                 {
//                     anchor: 'bottom-right',
//                     direction: 'column',
//                     justify: false,
//                     translateX: 0,
//                     translateY: 0,
//                     itemsSpacing: 0,
//                     itemDirection: 'left-to-right',
//                     itemWidth: 80,
//                     itemHeight: 20,
//                     itemOpacity: 0.75,
//                     symbolSize: 12,
//                     symbolShape: 'circle',
//                     symbolBorderColor: 'rgba(0, 0, 0, .5)',
//                     effects: [
//                         {
//                             on: 'hover',
//                             style: {
//                                 itemBackground: 'rgba(0, 0, 0, .03)',
//                                 itemOpacity: 1
//                             }
//                         }
//                     ]
//                 }
//             ]}
//         />
//     );
// }

// function piechart(data) {
//     return (
//         <ResponsivePieCanvas
//             data={data}
//             margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
//             pixelRatio={2}
//             innerRadius={0.5}
//             padAngle={0.7}
//             cornerRadius={3}
//             colors={{ scheme: 'paired' }}
//             width={800}
//             height={800}
//             borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.6 ] ] }}
//             radialLabelsSkipAngle={10}
//             radialLabelsTextXOffset={6}
//             radialLabelsTextColor="#333333"
//             radialLabelsLinkOffset={0}
//             radialLabelsLinkDiagonalLength={16}
//             radialLabelsLinkHorizontalLength={24}
//             radialLabelsLinkStrokeWidth={1}
//             radialLabelsLinkColor={{ from: 'color' }}
//             slicesLabelsSkipAngle={10}
//             slicesLabelsTextColor="#333333"
//             animate={true}
//             motionStiffness={90}
//             motionDamping={15}
//             legends={[
//                 {
//                     anchor: 'right',
//                     direction: 'column',
//                     translateX: 140,
//                     itemWidth: 60,
//                     itemHeight: 14,
//                     itemsSpacing: 2,
//                     symbolSize: 14,
//                     symbolShape: 'circle'
//                 }
//             ]}
//         />
//     )
// }
// // const styles = StyleSheet.create({
// //
// // });

export default App;
