import React, { Component } from 'react';
import Chart from 'react-apexcharts'

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
          events: {
            legendClick: function (chartContext, seriesIndex, config) {
              console.log(seriesIndex);
            }
          }

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

            var label = opts.w.globals.labels[opts.dataPointIndex]
            console.log(label);
            return label.slice(0, 15) + '...'
          },

          style: {
            fontSize: '10px',
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontWeight: 'bold',
            colors: ['#252A32'],
          },
        },
        tooltip: {
          x: {
            show: true
          }
        },
        grid: {
          show: true,
          borderColor: '#E2E4ED',
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
            opacity: 1
          },
          column: {
            colors: undefined,
            opacity: 0.5
          },
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          show: false,
        },
        legend: {
          position: 'top',
        }
      },
    };
  }

  componentDidMount() {
    let monsterData = []
    const data = this.props.data.map(item => {
      const { id, name, sub_actions, status, start_at, end_at } = item;
      const colors = {
        not_started: '#ECEEF4',
        ongoing_past_deadline: '#FFC6CC',
        ongoing_within_deadline: '#F8DD96',
        completed: '#0C8A6B',
      }
      return {
        id,
        name,
        x: name,
        y: [
          new Date(start_at).getTime(),
          new Date(end_at).getTime()
        ],
        fillColor: colors[status],
      }

    });
    console.log(monsterData);
    this.setState({ series: [{ data, name: 'Actions' }] });
  }

  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="rangeBar"
        width={'100%'}
        height={700}
        style={{ overflow: 'scroll' }}
      />
    )
  }
}

export default Gantt;
