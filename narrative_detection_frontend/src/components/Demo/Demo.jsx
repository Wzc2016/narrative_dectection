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
import { Select, Button, Input, Dropdown, Table, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'
import { ordinalSuffixOf } from 'ordinal-suffix-of';
import Typography from '@material-ui/core/Typography';

// var APIUrl_get_all_topics = 'http://apollo5.cs.illinois.edu:8000/get_all_topics';
// var APIUrl_get_all_topics = 'http://apollo5.cs.illinois.edu:8000/get_all_topics';
// var APIUrl_get_daily_sample = 'http://apollo5.cs.illinois.edu:8000/get_daily_sample';
// var APIUrl_get_result = 'http://apollo5.cs.illinois.edu:8000/get_result/';
// var APIUrl_delete = 'http://apollo5.cs.illinois.edu:8000/delete/';
// var APIUrl_stop_update = 'http://apollo5.cs.illinois.edu:8000/stop_update/';
// var APIUrl_resume_update = 'http://apollo5.cs.illinois.edu:8000/resume_update/';

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
      acc_polar: 0,
      acc_positive: 0,
      acc_negative: 0,
      acc_neutral: 0,
      acc_total: 0,
      begin_date: 'Loading...',
      display_charts: false,
      number_of_days: 0,
      curr_attitude: 'positive',
      number_of_samples: 0,
      stopped: false,
      errorMsg: '',
      chartSliderVal: [1, 1],
      op_dict: {},
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
            return {text: e.split("_").join(" ")};
          })
        })
      });

    }
  
    inputChangeHandler(e, v) {
      this.setState({
        number_of_samples: v.value,
      }, () => {
        this.get_samples();
      })
      
    }

    attitudeChangeHandler(e, v) {
      this.setState({
        curr_attitude: v.value,
      }, () => {
        this.get_samples();
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

      if(this.state.number_of_samples == 0) {
          this.setState({
          samples: [],
        })
          return;
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
            var temp = this.state.op_dict;
            if (!(this.state.curr_topic in temp))
              {
                  temp[this.state.curr_topic] = {};
              }
            temp[this.state.curr_topic]['curr_attitude'] = this.state.curr_attitude; 
            temp[this.state.curr_topic]['number_of_samples'] = this.state.number_of_samples; 
            console.log(result.data, this.state.sliderVal, this.state.curr_attitude, this.state.number_of_samples)
            this.setState({
              op_dict: temp,
              samples: result.data[this.state.sliderVal - 1][this.state.curr_attitude],
            })
            // console.log(result.data[this.state.sliderVal - 1][this.state.curr_attitude]);
          
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
            var temp = this.state.op_dict;

            if (!(this.state.curr_topic in temp))
              {
                  temp[this.state.curr_topic] = {};
              }

            temp[this.state.curr_topic]['sliderVal'] = value;
            // console.log(temp);
            this.setState({
              op_dict: temp,
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
      // console.log(value);
      fetch(APIUrl_get_result + this.state.curr_topic + '/' + parseInt(value[0]) + '/' + parseInt(value[1]))
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
          // console.log(result.data.polar[result.data.polar.length - 1])
          if(value in this.state.op_dict) {
            var number_of_samples = this.state.op_dict[value]['number_of_samples'];
            var curr_attitude = this.state.op_dict[value]['curr_attitude'];
            var sliderVal = this.state.op_dict[value]['sliderVal'];
          } else {
            var number_of_samples = 0;
            var curr_attitude = 'positive';
            var sliderVal = 1;
          }
          this.setState({
            positive_list: result.data.positive,
            neutral_list: result.data.neutral,
            negative_list: result.data.negative,
            total_list: result.data.total,
            polar: result.data.polar,
            acc_polar: result.data.polar[result.data.polar.length - 1],
            acc_positive: result.data.positive[result.data.positive.length - 1],
            acc_negative: result.data.negative[result.data.negative.length - 1],
            acc_neutral: result.data.neutral[result.data.neutral.length - 1],
            acc_total: result.data.total[result.data.total.length - 1],
            begin_date: result.start_time,
            display_charts: true,
            stopped: result.pause,
            curr_topic: value,
            number_of_samples: number_of_samples,
            curr_attitude: curr_attitude,
            sliderVal: sliderVal,
          }, () => {
            this.get_samples();
          })
          
        });


    }

    

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
            return {text: e.split("_").join(" "), key: e, value: e};
          })
    const attitudeOptions = 
      [{text: 'Positive', key: 'positive', value: 'positive'}
      , {text: 'Neutral', key: 'neutral', value: 'neutral'}
      , {text: 'Negative', key: 'negative', value: 'negative'}];

    const numberOptions = [...Array(31).keys()].map(e => {
        return {text: e.toString(10), key: e, value: e};
      });
    console.log(numberOptions);

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
            <Table.Cell>{e['text']}<a href={e['url']}> [Link]</a></Table.Cell>
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

      // console.log(this.state.acc_polar)


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
              <Link to={process.env.PUBLIC_URL + "/Search"}>
                <Button>
                  Search
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

            <div className='charts'>
              <Typography gutterBottom>
                  Accumulative Sentiment
                </Typography>
              <GaugeChart id="gauge-chart1" 
                nrOfLevels={2} 
                animate={false}
                percent={this.state.acc_polar}
                hideText={true}
                colors={['#FF0000', '#00FF00']}
              />
              <br/>
              <Label color={'green'}>
                Positive:
                <Label.Detail>{this.state.acc_positive}</Label.Detail>
              </Label>
              <Label color={'red'}>
                Negative:
                <Label.Detail>{this.state.acc_negative}</Label.Detail>
              </Label>
              <Label >
                Neutral:
                <Label.Detail>{this.state.acc_neutral}</Label.Detail>
              </Label>
              <Label color={'yellow'}>
                Total:
                <Label.Detail>{this.state.acc_total}</Label.Detail>
              </Label>
              <br/>
              <br/>
              <br/>
            </div>

            <div className='sample-tweets'>
              <Typography gutterBottom>
                    Tweet Samples
                  </Typography>
              <div className='date-slider'>
                  
                  <Slider className='slider'
                  onChange={this.sliderHandler}
                  valueLabelDisplay="on"
                  max={this.state.number_of_days}
                  min={1}
                  marks={marks}
                  value={this.state.sliderVal}/>
                </div>
                <br/>

                <span>
                  Show me {' '}
                  <Dropdown  selection compact options={numberOptions} value={this.state.number_of_samples} onChange={this.inputChangeHandler.bind(this)}/>
                  {' '}sample tweets of attitude {' '}
                  <Dropdown  selection compact options={attitudeOptions} value={this.state.curr_attitude} onChange={this.attitudeChangeHandler.bind(this)}/>
                </span>  
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
