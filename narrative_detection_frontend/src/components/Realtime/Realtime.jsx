import React, { Component } from 'react'
import { Table, Button, Input, Label, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import GaugeChart from 'react-gauge-chart'
import Thermometer from 'react-thermometer-component'

import './Realtime.css'

// var APIUrl_get_curr_result = 'http://apollo5.cs.illinois.edu:8000/get_curr_result/';
// var APIUrl_post = 'http://apollo5.cs.illinois.edu:8000/start_update/';

var APIUrl_get_curr_result = 'http://apollo5.cs.illinois.edu:8000/get_curr_result/';
var APIUrl_post = 'http://apollo5.cs.illinois.edu:8000/start_update/';
var APIUrl_curr_sample = 'http://apollo5.cs.illinois.edu:8000/get_curr_sample/';


// var APIUrl_get_curr_result = 'http://127.0.0.1:8000/get_curr_result/';
// var APIUrl_post = 'http://127.0.0.1:8000/start_update/';
// var APIUrl_curr_sample = 'http://127.0.0.1:8000/get_curr_sample/';

// var host = '127.0.0.1';
// // Listen on a specific port via the PORT environment variable
// var port = 8000;
 
// var cors_proxy = require('cors-anywhere');
// cors_proxy.createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, function() {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
// });


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const chartStyle = {
  width: 500,
  margin: 'auto auto',
}

var idVar;

class Realtime extends Component {

  constructor() {
    super();

    this.state = {
      error: null,
      isLoaded: false,
      value: '',
      positive: 0,
      negative: 0,
      currentTopic: '',
      neutral: 0,
      total: 0,
      beginTime: null,
      curTime : null,
      displayTime: false,
      activity: 0,
      displayCharts: false,
      displayLoading: false,
      neutral_sample: [],
      pro_sample: [],
      anti_sample: [],
      displaySuccess: false,

    }

    this.keyPressHandler = this.keyPressHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);

  }



  GetData() {
    fetch(APIUrl_get_curr_result + this.state.currentTopic)
    .then(res => {
      if(res.status === 400) {
        return 'Loading'
      } else {
        return res.json()
      }
    })
    .then(
      (result) => {
        if(result === 'Loading') {
          return
        }
        this.setState({
            positive: this.state.positive + result.positive,
            negative: this.state.negative + result.negative,
            neutral: this.state.neutral + result.neutral,
            total: this.state.positive + this.state.negative + this.state.neutral + result.positive + result.negative + result.neutral,
            curTime: new Date().toLocaleString(),
            activity:  (result.positive + result.negative + result.neutral) / 100.0,

          displayLoading: false,
          displayCharts: true,
          displaySuccess: true,
        })
        // console.log(this.state.total, this.state.positive, this.state.negative, this.state.neutral);
      }
    );

  }

  clickHandler() {

    clearInterval(idVar);


    this.setState({
      displayLoading: true,
      currentTopic: this.state.value.split(' ').join('_'),
    })

    fetch(APIUrl_post + this.state.value.split(' ').join('_'), {method: 'POST'});


    sleep(5000).then(() => {


      if(this.state.value.length === 0) {
      this.setState({currentTopic: ''});
      return;
    }



    this.setState({
      beginTime: new Date().toLocaleString(),
      curTime: new Date().toLocaleString(),
      currentTopic: this.state.value.split(' ').join('_'),
      displayTime: true,
      positive: 0,
      negative: 0,
      neutral: 0,
      total: 0,
      activity: 0,
      displayLoading: true,
      displayCharts: false,
      displaySuccess: false,
    })

    

      idVar = setInterval( () => {
        this.GetData();
      }, 3000)


    })
    

  }


  keyPressHandler(e) {
    if(e.key != 'Enter'){
      return;
    }
    this.clickHandler();
  }


  inputChangeHandler(e) {
    this.setState({ value: e.target.value});
  }

  render() {

    const TableExampleDefinition = (
      <Table celled structured className='tweet_table'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Attitude</Table.HeaderCell>
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
            <Table.Cell rowSpan='3'>Positive</Table.Cell>            
            <Table.Cell>{this.state.pro_sample[0]}</Table.Cell>
          </Table.Row>
          <Table.Row>
              <Table.Cell>{this.state.pro_sample[1]}</Table.Cell>
          </Table.Row>
          <Table.Row>
              <Table.Cell>{this.state.anti_sample[2]}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell rowSpan='3'>Negative</Table.Cell>            
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


    var displayTime = {display: this.state.displayTime ? 'block' : 'none' };
    var displayCharts = {display: this.state.displayCharts ? 'block' : 'none' }
    var displayLoading = {display: this.state.displayLoading ? 'block' : 'none' }
    var displaySuccess = {display: this.state.displaySuccess ? 'block' : 'none' }
    return (
      <div className='Realtime'>
      <br/>
      <Button.Group size='large'>
        <Link to={process.env.PUBLIC_URL + "/Realtime"}>
          <Button>
            Realtime
          </Button>
        </Link>
        <Button.Or />
        <Link to={process.env.PUBLIC_URL + "/Archive"} onClick={() => {clearInterval(idVar); }}>
          <Button>
            Archive
          </Button>
        </Link>
      </Button.Group>
      <h1>Choose a topic!</h1>
        <Input
            onKeyPress={this.keyPressHandler}
            onChange={this.inputChangeHandler}
            label='Search'
            placeholder='Key word here!'
            value={this.state.value}
          />
          <Button onClick={this.clickHandler}>
            GET
          </Button>
          <br/>
          <br/>
         <div style={displayLoading}>
            Loading......(May take a few seconds.)
          </div>

          <div style={displaySuccess}>
            Successful! You can find your result at Archive!
          </div>

            {/* <div className='charts'>
                  <div>
                    <GaugeChart id="gauge-chart1" 
                      nrOfLevels={2} 
                      animate={false}
                      percent={(2 * this.state.positive + 1 * this.state.neutral)/(2 * this.state.total)}
                      hideText={true}
                      colors={['#FF0000', '#00FF00']}
                    />
                    Sentiment
                  </div>
                  <div>
                    <GaugeChart id="gauge-chart2" 
                      nrOfLevels={1} 
                      animate={false}
                      percent={this.state.activity}
                      hideText={true}
                    />
                    Activity
                </div>
                  <div>

                    <div className='temperature'>
                      <Thermometer
                          theme="light"
                          value={this.state.activity * 100}
                          max="100"
                          size="normal"
                          height="150"
                        />
                      </div>
                    <br/>
                      Alert Status
                    </div>
                  </div>
          <br/>

          
          <div style={displayTime}>
            {`From ${this.state.beginTime} to ${this.state.curTime}`}
          </div>

          <br/>
          <Label color={'green'}>
            Positive:
            <Label.Detail>{this.state.positive}</Label.Detail>
          </Label>
          <Label color={'red'}>
            Negative:
            <Label.Detail>{this.state.negative}</Label.Detail>
          </Label>
          <Label >
            Neutral:
            <Label.Detail>{this.state.neutral}</Label.Detail>
          </Label>
          <Label color={'yellow'}>
            Total:
            <Label.Detail>{this.state.total}</Label.Detail>
          </Label>
          <br/>
          <br/>
         */} <br/>

      </div>
    )
  }

}

export default Realtime