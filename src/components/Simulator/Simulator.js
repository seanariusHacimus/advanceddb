import React, { Component, createRef } from 'react';
import { Row, Col, Progress, Divider, Input, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import BarChart from './BarChart';
import simulatorDataWithDefinitions from '../../constants/simulators_with_definition';
import simulatorRank from '../../constants/simulators_rank';
import simulatorData from '../../constants/simulators_data';
import Axios from '../../utils/axios';
import { GET_RESULT } from '../../graphql/simulate';
import debounce from 'lodash/debounce';
import { rankDiff } from '../../utils';

// ----------- ASSETS AND STYLES ------------------
import StyledSimulator from '../../styles/simulator';
import { TitleH1, Text, TitleH3, Button, Flex } from '../../styles';
import iconReset from '../../assets/simulation/reset.svg';
import { withLocale } from "../../utils/locale";

const SimulatorData = () => ({ ...JSON.parse(JSON.stringify(simulatorDataWithDefinitions)) });
const SimulatorRank = () => ({ ...JSON.parse(JSON.stringify(simulatorRank)) });
const resetData = () => ({ ...JSON.parse(JSON.stringify(simulatorData)) });

const initialState = () => {
  return {
    data: [],
    simulatorData: SimulatorData(),
    ease_of_doing_business: SimulatorData().ease_of_doing_business,
    reset: false,
    effectedSimulator: [],
  }
}

class Simulator extends Component {
  state = initialState();

  printRef = createRef()

  componentDidMount() {
    this.dataFormater()
  }

  dataFormater = (updatedValue = {}) => {
    const currentData = Object.keys(updatedValue).length ? updatedValue : this.state.simulatorData;
    const data = Object.keys(currentData).map((key) => {
      // Sort KPI fields by order number and store main KPI name by mapping and storing in name field
      return Object.values(currentData[key])
        .map((item, index) => ({
          ...item,
          parent: key,
          name: Object.keys(currentData[key])[index],
        }))
        .sort((a, b) => a.order - b.order);
    });

    this.setState({
      data: data,
      simulatorData: currentData,
      ease_of_doing_business: currentData.ease_of_doing_business,
    });
  }

  resetHandler = () => {
    const data = Object.keys(resetData()).map((key) => {
      // Sort KPI fields by order number and store main KPI name by mapping and storing in name field
      return Object.values(resetData()[key])
        .map((item, index) => ({
          ...item,
          parent: key,
          name: Object.keys(resetData()[key])[index],
        }))
        .sort((a, b) => a.order - b.order);
    });

    this.setState({
      ...initialState(),
      data: data,
      simulatorData: resetData(),
      ease_of_doing_business: {
        rank_as_of_current_data: {
          ...SimulatorData().ease_of_doing_business,
          value: 177,
        },
        overall_ease_of_doing_business_score_as_of_current_data: {
          ...SimulatorData().overall_ease_of_doing_business_score_as_of_current_data,
          value: 41.3
        },
      },
    });
  }

  onChange = e => {
    const { value, dataset: { parent, id }, keyName } = e.target;
    console.log(keyName, value);
    const updatedValue = {
      ...this.state.simulatorData,
      [parent]: {
        ...this.state.simulatorData[parent],
        [id]: {
          ...this.state.simulatorData[parent][id], value: !value && value !== 0 ? '' : +value,
        }
      }
    };
    this.setState(prevState => ({ effectedSimulator: [...new Set([...prevState.effectedSimulator, parent])] }));
    this.resultHandler(updatedValue);
    this.dataFormater(updatedValue)
  }

  resultHandler = debounce(async (simulatorData) => {
    let input = {};
    for (let x in simulatorData) {
      if (this.state.effectedSimulator.includes(x)) {
        let parent = { [x]: {} }
        for (let y in simulatorData[x]) {
          const currentData = simulatorData[x][y]
          console.log(currentData);
          if (!currentData.static && !currentData.notNumber && currentData.value !== '') {
            parent[x][y] = +currentData.value.toFixed(1);
          }
        }
        input = { ...input, ...parent }
      }
    }

    try {
      const { data } = await Axios.post('/graphql', {
        query: GET_RESULT,
        variables: {
          input
        }
      });

      let result = { ...simulatorData };
      const response = data.data.simulate;
      for (let x in response) {
        for (let y in response[x]) {
          if (response[x][y]) {
            result[x][y].value = response[x][y];
          }
        }
      }
      this.dataFormater(result)
    }
    catch (err) {
      console.log(err);
    }
  }, 2000)

  render() {
    const { t } = this.props;
    const { data, ease_of_doing_business: { rank_as_of_current_data, overall_ease_of_doing_business_score_as_of_current_data } } = this.state;
    const chartData = [];
    data.forEach(item => {
      for (let x in item) {
        if (item[x].order === 1 && item[x].parent !== 'ease_of_doing_business') {
          return chartData.push({ ...item[x], current: SimulatorRank()[item[x].parent] });
        }
      }
    });
    const rank = rankDiff(SimulatorRank().rank_as_of_current_data, rank_as_of_current_data.value, 'rank');
    const score = rankDiff(SimulatorRank().overall_ease_of_doing_business_score_as_of_current_data, overall_ease_of_doing_business_score_as_of_current_data.value, 'score');

    return (
      <StyledSimulator ref={this.printRef}>
        <TitleH1 className="text-capitalize">{t('DB Ranking simulator')}</TitleH1>
        <Row style={{ marginTop: 35 }}>
          <Col span={24} lg={20} id="bar-chart-wrapper">
            <BarChart data={chartData} />
          </Col>
          <Col span={24} lg={4}>
            <Row className="text-center" gutter={[{ xs: 0, md: 0 }, { xs: 0, md: 20 }]}>
              <Col span={12} lg={24}>
                <div>
                  <h1 style={{ color: score.color }}>
                    {score.value}{' '}{score.icon}
                  </h1>
                  <Progress
                    type="circle"
                    format={(percent) => percent}
                    percent={overall_ease_of_doing_business_score_as_of_current_data.value}
                    size="small"
                    width={85}
                    strokeWidth={18}
                    strokeColor="#4A5187"
                    strokeLinecap="square"
                  />
                  <Text color="#4A5187" className="progress-sub-title text-capitalize" fontSize="21px">{t('Overall score')}</Text>
                </div>
              </Col>
              <Col xs={0} lg={24}>
                <Divider type="horizontal" style={{ margin: 0 }} />
              </Col>
              <Col span={12} lg={24}>
                <div>
                  <h1 style={{ color: rank.color }}>
                    {rank.value}{' '}{rank.icon}
                  </h1>
                  <Progress
                    type="circle"
                    format={(percent) => `${rank_as_of_current_data.value}`}
                    percent={rank_as_of_current_data.value / 230 * 100}
                    size="small"
                    width={85}
                    strokeWidth={18}
                    strokeColor="#EFA5C1"
                    strokeLinecap="square"
                  />
                  <Text color="#EFA5C1" className="progress-sub-title text-capitalize">{t('Overall ranking')}</Text>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />

        <Flex margin="0 0 16px">
          <TitleH3>{t('Please enter your simulation data in the table below')}</TitleH3>
          <Flex className="action-group">
            <Button type="reset" className="small" onClick={this.resetHandler}><img src={iconReset} alt="reset" /> {t("Reset")}</Button>
          </Flex>
        </Flex>

        <Row gutter={[20, 20]}>
          {
            this.state.data.map((kpi, index) => {
              // Sort KPI fields by order number and store main KPI name by mapping and storing in name field
              if (kpi[0].parent !== 'ease_of_doing_business') {
                return (
                  <Col xs={24} md={12} xl={8} className="rank" key={index}>
                    {
                      kpi.map((item, index) => {
                        if (item.static && index === 0) {
                          return (
                            <Flex jc="space-between" className={`rank-item checked`} key={index}>
                              <div className="rank-item-title">
                                {item.title}
                                {/* <Tooltip
                                  overlayClassName="custom-tooltip"
                                  placement="topRight"
                                  color="#535263"
                                  title={item.description}
                                >
                                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                                </Tooltip> */}
                              </div>
                              <span>{parseInt(item.value)}</span>
                            </Flex>
                          )
                        } else if (item.static) {
                          return (
                            <Flex jc="space-between" className={`rank-item score`} key={index}>
                              <div className="rank-item-title score">
                                {item.title}
                                {/* <Tooltip
                                  overlayClassName="custom-tooltip"
                                  placement="topRight"
                                  color="#535263"
                                  title={item.description}
                                >
                                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                                </Tooltip> */}
                              </div>
                              <span>{parseFloat(item.value).toFixed(1)}</span>
                            </Flex>
                          )
                        } else {
                          return (
                            <Flex jc="space-between" className={`rank-item form`} key={index}>
                              <div className="rank-item-subtitle">
                                {item.title}
                                <Tooltip
                                  overlayClassName="custom-tooltip"
                                  placement="topRight"
                                  color="#535263"
                                  title={item.description}
                                >
                                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                                </Tooltip>
                              </div>
                              <span>
                                <Input
                                  // type={item.notNumber ? 'text' : 'number'}
                                  size="small"
                                  name={item.name}
                                  className="form-input"
                                  data-id={item.name}
                                  data-parent={item.parent}
                                  readOnly={item.notNumber}
                                  disabled={item.notNumber}
                                  value={item.value}
                                  onChange={this.onChange}

                                />
                              </span>

                            </Flex>
                          )
                        }
                      })
                    }
                  </Col>
                )
              }
              return null

            })
          }
        </Row>
      </StyledSimulator>
    );
  }
}

export default withLocale(Simulator);
