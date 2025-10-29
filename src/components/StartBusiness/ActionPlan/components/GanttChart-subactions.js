import React, { Component } from 'react';
import Chart from 'react-apexcharts'
import moment from 'moment-timezone';

class Gantt extends Component {
  constructor(props) {
    super(props);

    this.state = {

      series: [{
        data: [{
          x: 'TEAM A',
          y: [1358447400000, 1358620200000]
        },
        ]
      }],
      options: {
        chart: {
          type: 'rangeBar',
          // sparkline: {
          //   enabled: true
          // },
          height: 400,

        },
        plotOptions: {
          bar: {
            horizontal: true,
            startingShape: 'flat',
            endingShape: 'flat',
            columnWidth: '70%',
            barHeight: '70%',
            distributed: false,
            rangeBarOverlap: false,
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            console.log(opts);
            var label = opts.w.globals.labels[opts.dataPointIndex]
            var a = moment(val[0])
            var b = moment(val[1])
            var diff = b.diff(a, 'days')
            return 'hello'
          },
        },
        grid: {
          show: true,
          borderColor: '#90A4AE',
          strokeDashArray: 0,
          position: 'back',
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          },
          row: {
            colors: undefined,
            opacity: 0.5
          },
          column: {
            colors: undefined,
            opacity: 0.5
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
        },

        xaxis: {
          type: 'datetime'
        },
        legend: {
          position: 'top'
        }
      },
    };
  }

  componentDidMount() {
    let monsterData = []
    const data = this.props.data.map(item => {
      const { id, name, sub_actions } = item;
      sub_actions.map(item => {
        const currentData = {
          x: name,
          y: [
            new Date(item.start_at).getTime(),
            new Date(item.end_at).getTime()
          ]
        }
        monsterData.push(currentData);
      })

    });
    console.log(monsterData);
    this.setState({ series: [{ data: monsterData }] });
  }

  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="rangeBar"
        width={'100%'}
        height={400}
      />
    )
  }
}

export default Gantt;
