import React, { Component } from 'react'
import { Button, Input } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import GaugeChart from 'react-gauge-chart'

import './Realtime.css'

var APIUrl = 'http://127.0.0.1:8000/polar_result/';

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
      curTime : new Date().toLocaleString(),
      displayTime: false,
    }

    this.keyPressHandler = this.keyPressHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);

  }



  GetData() {
    fetch(APIUrl + this.state.currentTopic)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          positive: this.state.positive + result.positive,
          negative: this.state.negative + result.negative,
          neutral: this.state.neutral + result.neutral,
          total: this.state.positive + this.state.negative + this.state.neutral + result.positive + result.negative + result.neutral,
          curTime: new Date().toLocaleString(),
        })
        console.log(this.state.total, this.state.positive, this.state.negative, this.state.neutral);
      }
    );
  }

  clickHandler() {
    if(this.state.value.length === 0) {
      this.setState({currentTopic: ''});
      return;
    }

    this.setState({
      beginTime: new Date().toLocaleString(),
      currentTopic: this.state.value,
      displayTime: true,
      positive: 0,
      negative: 0,
      neutral: 0,
      total: 0,
    })

    clearInterval(idVar);

    idVar = setInterval( () => {
      this.GetData();
    }, 3000)

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
    var displayTime = {display: this.state.displayTime ? 'block' : 'none' };
    
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
        <Link to={process.env.PUBLIC_URL + "/Demo"} onClick={() => {clearInterval(idVar); }}>
          <Button>
            Demo
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
          <GaugeChart id="gaugeChart2" 
            nrOfLevels={3} 
            animate={false}
            percent={(2 * this.state.positive + 1 * this.state.neutral)/(2 * this.state.total)}
            hideText={true}
            style={chartStyle}
          />
          <br/>

          
          <div style={displayTime}>
            {`From ${this.state.beginTime} to ${this.state.curTime}`}
          </div>

          <br/>
          {`positive: ${this.state.positive}
            negative: ${this.state.negative}
            neutral: ${this.state.neutral}
            total: ${this.state.total}`}
          

      </div>
    )
  }

}

export default Realtime