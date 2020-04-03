import React from "react";
import Sidebar from "react-sidebar";
import { Container, Row, Col } from 'reactstrap';
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePieCanvas } from '@nivo/pie'
import './Demo.css'
import GaugeChart from 'react-gauge-chart'
import Thermometer from 'react-thermometer-component'
import Slider from '@material-ui/core/Slider';
import { Select, Button, Input, Dropdown, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'
import { ordinalSuffixOf } from 'ordinal-suffix-of';
import Typography from '@material-ui/core/Typography';

// var APIUrl_get_all_topics = 'http://apollo5.cs.illinois.edu:8000/get_all_topics';
// var APIUrl_get_daily_sample = 'http://apollo5.cs.illinois.edu:8000/get_daily_sample';
// var APIUrl_get_result = 'http://apollo5.cs.illinois.edu:8000/get_result/';

var APIUrl_get_all_topics = 'http://127.0.0.1:8000/get_all_topics';
var APIUrl_get_daily_sample = 'http://127.0.0.1:8000/get_daily_sample';
var APIUrl_get_result = 'http://127.0.0.1:8000/get_result/';
var APIUrl_delete = 'http://127.0.0.1:8000/delete/';
var APIUrl_stop_update = 'http://127.0.0.1:8000/stop_update/';
var APIUrl_resume_update = 'http://127.0.0.1:8000/resume_update/';


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
      samples: [],
      neutral_list: [],
      positive_list: [],
      negative_list: [],
      total_list: [],
      polar: 0,
      begin_date: 'Loading...',
      display_charts: false,
      number_of_days: 0,
      curr_attitude: 'positive',
      number_of_samples: 0,
      stopped: false,
      errorMsg: '',
      chartSliderVal: [1, 1],
    };
    this.sliderHandler = this.sliderHandler.bind(this);
    this.sliderTxtHandler = this.sliderTxtHandler.bind(this);

  }

  componentDidMount() {
  	fetch(APIUrl_get_all_topics)
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
  
    inputChangeHandler(e, v) {
      this.setState({
        number_of_samples: parseInt(v.value)
      })
    }

    attitudeChangeHandler(e, v) {
      this.setState({
        curr_attitude: v.value,
      })
    }

    get_samples() {
      if(this.state.number_of_samples == NaN) {
        this.setState({
          samples: [],
          errorMsg: 'Please input an integer between 1-30.'
        })
        return
      }
      if(this.state.number_of_samples > 30 || this.state.number_of_samples < 1) {
        this.setState({
          samples: [],
          errorMsg: 'Please input an integer between 1-30.'
        })
        return
      } 
      fetch(APIUrl_get_daily_sample + '/' + this.state.curr_topic + '/' + this.state.number_of_samples)
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({
              samples: result.data[this.state.sliderVal - 1][this.state.curr_attitude],
            })
            console.log(result.data[this.state.sliderVal - 1][this.state.curr_attitude]);
          
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
      fetch(APIUrl_get_daily_sample + '/' + this.state.curr_topic + '/' + parseInt(this.state.number_of_samples))
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({
              samples: result.data[value - 1][this.state.curr_attitude],
            })
          
        });
    }

    sliderTxtHandler(e) {
      
    }


    fetch_sample_data(topic) {
      fetch(APIUrl_get_daily_sample + '/' + topic + '/3')
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result.data.length , this.state.sliderVal)
          
            this.setState({
              number_of_days: result.data.length,
              neutral_sample: result.data[this.state.sliderVal - 1]['neutral'],
              pro_sample: result.data[this.state.sliderVal - 1]['positive'],
              anti_sample: result.data[this.state.sliderVal - 1]['negative'],
              chartSliderVal: [1, result.data.length],
            })
          
          
        });
    }


    delete_handler(e) {
      fetch(APIUrl_delete + this.state.curr_topic, {
        method: 'DELETE'
      })
      window.location.reload(true);
    }

    stop_handler(e) {
      if(this.state.stopped) {
        fetch(APIUrl_resume_update + this.state.curr_topic, {
          method: 'PUT'
        })
        this.setState({
          stopped: false,
        })
      } else {
        fetch(APIUrl_stop_update + this.state.curr_topic, {
          method: 'PUT'
        })
        this.setState({
          stopped: true,
        })
      }
      
      

    }

    chartSliderChangeHandler(e, value) {
      this.setState({
        chartSliderVal: value,
      });
    }

    changeHandler(e, {value}) {
      this.setState({
        curr_topic: value,
      })

      this.fetch_sample_data(value);

      fetch(APIUrl_get_result + value)
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result.data.length , this.state.sliderVal)
          this.setState({
            positive_list: result.data.positive,
            neutral_list: result.data.neutral,
            negative_list: result.data.negative,
            total_list: result.data.total,
            polar: result.data.polar,
            begin_date: result.start_time,
            display_charts: true,
            stopped: result.pause,
          })
          
        });


    }

  

  // dateParser(date) {
  // 	return date.slice(0, 2) + '-' + date.slice(2, 4) + '-' + date.slice(4,8);
  // }


    

  render() {
    // console.log(this.statestopped);
    // console.log(this.state.chartSliderVal)
    const buttonString = this.state.stopped ? "Resume" : "Stop";

    const activityOptions = {

        title: {
          text: 'Activity by Hours'
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
          title: {
            text: 'From ' + this.state.begin_date + ' (Hours)'
          }
        },

        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },

        credits: {
          enabled: false
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
          data: this.state.positive_list,
        },{
          name: 'Neutral',
          data: this.state.neutral_list,
        },{
          name: 'Negative',
          data: this.state.negative_list,
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

      const sentimentOptions = {


        chart: {
            type: 'area'
        },
        title: {
            text: 'Sentiment Distribution by Hours'
        },
        subtitle: {
            text: 'Source: Twitter'
        },
        xAxis: {
             title: {
                text: 'From ' + this.state.begin_date + ' (Hours)'
              }
        },
        yAxis: {
            labels: {
                format: '{value}%'
            },
            title: {
                text: 'Sentiment Ratio'
            }
        },

        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },

        credits: {
          enabled: false
        },


        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>',
            split: true
        },
        plotOptions: {
            area: {
                stacking: 'percent',
                lineColor: '#ffffff',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff'
                },
                accessibility: {
                    pointDescriptionFormatter: function (point) {
                        function round(x) {
                            return Math.round(x * 100) / 100;
                        }
                        return (point.index + 1) + ', ' + point.category + ', ' +
                            point.y + ' millions, ' + round(point.percentage) + '%, ' +
                            point.series.name;
                    }
                }
            }
        },
        series: [{
            name: 'Positive',
            data: this.state.positive_list,
        }, {
            name: 'Neutral',
            data: this.state.neutral_list,
        }, {
            name: 'Negative',
            data: this.state.negative_list,
        }]

      };


      const LaTeX = 'We calculate the $Support$ $Rate$ by formula $(2$ $\\times$ $#Positive$ $+$ $#Neutral$)$/$ (2 $\\times$ #Total)'

  	const { error, isLoaded} = this.state;

    const topicOptions = this.state.topics.map((e) => {
            return {text: e, key: e, value: e};
          })
    const attitudeOptions = 
      [{text: 'Positive', key: 'positive', value: 'positive'}
      , {text: 'Neutral', key: 'neutral', value: 'neutral'}
      , {text: 'Negative', key: 'negative', value: 'negative'}];

    const marks = [
      {
        value: 1,
        label: '1st Day (' + this.state.begin_date + ')',
      },
      {
        value: this.state.number_of_days,
        label: ordinalSuffixOf(this.state.number_of_days) + ' Day',
      },
    ];


    const samples = this.state.samples.map((e) =>
          <Table.Row>
            <Table.Cell>{e}</Table.Cell>
          </Table.Row>
    );


    const TableExampleDefinition = this.state.samples.length > 0 ? (
      <Table celled structured className='tweet_table'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Sample Tweets</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {samples}

        </Table.Body>
      </Table>
      ) : (<div>
        {this.state.errorMsg}
      </div>);




    var display_charts = {display: this.state.display_charts ? 'block' : 'none' };

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
              <Link to={process.env.PUBLIC_URL + "/Archive"}>
                <Button>
                  Archive
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
 

            <div style={display_charts}>

            <Button compact positive onClick={this.stop_handler.bind(this)}>{buttonString} this topic</Button>
            <Button compact negative onClick={this.delete_handler.bind(this)}>Delete this topic</Button>
            
            <br/>
            <br/>

            <div className='sample-tweets'>
              <div className='date-slider'>
                  <Slider className='slider'
                  onChange={this.sliderHandler}
                  valueLabelDisplay="on"
                  max={this.state.number_of_days}
                  min={1}
                  marks={marks}
                  defaultValue={this.state.sliderVal}/>
                </div>
                <br/>


                <Input type='text' placeholder='#Samples (1~30)' onChange={this.inputChangeHandler.bind(this)} action>
                  <input />
                  <Select compact options={attitudeOptions} defaultValue='positive' onChange={this.attitudeChangeHandler.bind(this)}/>
                  <Button type='submit' onClick={this.get_samples.bind(this)}>GET</Button>
                </Input>
                <br/>
                <br/>
                {TableExampleDefinition}
              </div>
              <br/>
              <br/>
                <Typography gutterBottom>
                  Time Range of Data
                </Typography>
                <br/>
                <Slider className='slider'
                  valueLabelDisplay="on"
                  aria-labelledby="range-slider"
                  max={this.state.number_of_days}
                  min={1}
                  marks={marks}
                  onChange={this.chartSliderChangeHandler.bind(this)}
                  value={this.state.chartSliderVal}
                />
            <HighchartsReact
              className='topic-box'
              highcharts={Highcharts}
              options={activityOptions}
            />
            <HighchartsReact
              className='topic-box'
              highcharts={Highcharts}
              options={sentimentOptions}
            />

           <br/>
           <br/>

           </div>
          </div>
	    );
	  }
	}
}

export default App;
