import React from "react";
import Sidebar from "react-sidebar";
import { Container, Row, Col } from 'reactstrap';
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePieCanvas } from '@nivo/pie'
import './Demo.css'
import GaugeChart from 'react-gauge-chart'
import Thermometer from 'react-thermometer-component'
// import Slider, { Range } from 'rc-slider'; 
// import 'rc-slider/assets/index.css';
import Slider from '@material-ui/core/Slider';
import { Button, Input, Dropdown, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

var APIUrl_get_curr_topics = 'http://127.0.0.1:8000/get_curr_topics';
var APIUrl_get_daily_sample = 'http://127.0.0.1:8000/get_daily_sample';
var beginDate = '01242020';
var endDate = '02162020';

const options = {

  title: {
    text: 'Sentiment by hours'
  },

  subtitle: {
    text: 'Source: Twitter'
  },

  yAxis: {
    title: {
      text: 'Number of Posts'
    }
  },

  xAxis: {
    accessibility: {
      rangeDescription: 'Range: 2010 to 2017'
    }
  },

  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      },
      pointStart: 0
    }
  },

  series: [{
    name: 'Positive',
    data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
  }],

  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }

};




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	error: null,
    	isLoaded: false,
    	topics: [],
      topicOptions: [],
      curr_topic: '',
      sliderVal: 1,
      neutral_sample: [],
      pro_sample: [],
      anti_sample: [],
    };
    this.sliderHandler = this.sliderHandler.bind(this);
    this.sliderTxtHandler = this.sliderTxtHandler.bind(this);

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
  

    sliderHandler(e, value) {
      this.setState({
        sliderVal: value,
      });
      // console.log(value);
      if(this.state.curr_topic == '') {
        return
      }
      fetch(APIUrl_get_daily_sample + '/' + this.state.curr_topic)
      .then(res => res.json())
      .then(
        (result) => {
          if(result.data.length < value) {
            this.setState({
              neutral_sample: '',
              pro_sample: '',
              anti_sample: '',
            })
          } else {
            this.setState({
              neutral_sample: result.data[value - 1]['neutral'],
              pro_sample: result.data[value - 1]['positive'],
              anti_sample: result.data[value - 1]['negative'],
            })
          }
        });
    }

    sliderTxtHandler(e) {
      
    }


    fetch_sample_data(topic) {
      fetch(APIUrl_get_daily_sample + '/' + topic)
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result.data.length , this.state.sliderVal)
          if(result.data.length < this.state.sliderVal) {
            this.setState({
              neutral_sample: '',
              pro_sample: '',
              anti_sample: '',
            })
          } else {
            this.setState({
              neutral_sample: result.data[this.state.sliderVal - 1]['neutral'],
              pro_sample: result.data[this.state.sliderVal - 1]['positive'],
              anti_sample: result.data[this.state.sliderVal - 1]['negative'],
            })
          }
          
        });
    }

    changeHandler(e, {value}) {
      this.setState({
        curr_topic: value,
      })

      this.fetch_sample_data(value);
    }

  

  // dateParser(date) {
  // 	return date.slice(0, 2) + '-' + date.slice(2, 4) + '-' + date.slice(4,8);
  // }

  valuetext(value) {
  return `${value}°C`;
}


    

  render() {
  	const { error, isLoaded} = this.state;

    const topicOptions = this.state.topics.map((e) => {
            return {text: e, key: e, value: e};
          })


    const marks = [
      {
        value: 1,
        label: '1st Day',
      },
      {
        value: 15,
        label: '15th Day',
      },
    ];


    const TableExampleDefinition = (
      <Table celled structured>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Beliefs</Table.HeaderCell>
            <Table.HeaderCell>Sample Tweets</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell rowSpan='3'>Neutral</Table.Cell>            
            <Table.Cell>{this.state.neutral_sample[0]}</Table.Cell>
          </Table.Row>
          <Table.Row>
              <Table.Cell>{this.state.neutral_sample[1]}</Table.Cell>
          </Table.Row>
          <Table.Row>
              <Table.Cell>{this.state.neutral_sample[2]}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell rowSpan='3'>{'Pro-' + this.state.curr_topic}</Table.Cell>            
            <Table.Cell>{this.state.pro_sample[0]}</Table.Cell>
          </Table.Row>
          <Table.Row>
              <Table.Cell>{this.state.pro_sample[1]}</Table.Cell>
          </Table.Row>
          <Table.Row>
              <Table.Cell>{this.state.anti_sample[2]}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell rowSpan='3'>{'Anti-' + this.state.curr_topic}</Table.Cell>            
            <Table.Cell>{this.state.anti_sample[0]}</Table.Cell>
          </Table.Row>
          <Table.Row>
              <Table.Cell>{this.state.anti_sample[1]}</Table.Cell>
          </Table.Row>
          <Table.Row>
              <Table.Cell>{this.state.anti_sample[2]}</Table.Cell>
          </Table.Row>

        </Table.Body>
      </Table>
      );






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
              placeholder='Select Topic'
              className='topic-box'
              fluid
              search
              selection
              options={topicOptions}
              onChange={this.changeHandler.bind(this)}
            />


            <br/>
            <br/>
            <br/>
            <br/>


            <div className='date-slider'>
                <Slider className='slider'
                onChange={this.sliderHandler}
                getAriaValueText={this.valuetext}
                valueLabelDisplay="on"
                max={15}
                min={1}
                marks={marks}
                defaultValue={this.state.sliderVal}/>
              </div>


              {TableExampleDefinition}


            <HighchartsReact
              className='topic-box'
              highcharts={Highcharts}
              options={options}
            />
            <HighchartsReact
              className='topic-box'
              highcharts={Highcharts}
              options={options}
            />
	        </div>
	    );
	  }
	}
}

export default App;
