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
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'


var APIUrl_get_curr_topics = 'http://apollo5.cs.illinois.edu:8000/get_all_topics';
var APIUrl_get_daily_sample = 'http://apollo5.cs.illinois.edu:8000/get_daily_sample';
var APIUrl_get_result = 'http://apollo5.cs.illinois.edu:8000/get_result/';
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
      curr_topic: '',
      sliderVal: 1,
      neutral_sample: [],
      pro_sample: [],
      anti_sample: [],
      neutral_list: [],
      positive_list: [],
      negative_list: [],
      total_list: [],
      polar: 0,
      begin_date: 'Loading...'
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
          })
          
        });


    }

  

  // dateParser(date) {
  // 	return date.slice(0, 2) + '-' + date.slice(2, 4) + '-' + date.slice(4,8);
  // }

  valuetext(value) {
  return `${value}°C`;
}


    

  render() {

    const activityOptions = {

        title: {
          text: 'Activity by hours'
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
            text: 'Number of Hours from ' + this.state.begin_date
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
          data: this.state.positive_list,
        },{
          name: 'Negative',
          data: this.state.negative_list,
        },{
          name: 'Neutral',
          data: this.state.neutral_list,
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
            text: 'Sentiment Distribution by hours'
        },
        subtitle: {
            text: 'Source: Twitter'
        },
        xAxis: {
             title: {
                text: 'Number of Hours from ' + this.state.begin_date
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


    const marks = [
      {
        value: 1,
        label: '1st Day (' + this.state.begin_date + ')',
      },
      {
        value: 15,
        label: '15th Day',
      },
    ];


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
              <br/>

              {TableExampleDefinition}

              <br/>
              <br/>

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
	    );
	  }
	}
}

export default App;
