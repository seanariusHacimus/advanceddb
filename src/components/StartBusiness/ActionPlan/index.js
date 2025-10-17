import React, { createRef, Component, Suspense, lazy } from "react";
import {
  Row,
  Col,
  List,
  Progress,
  Button,
  Collapse,
  Popover,
  Typography,
} from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import DonutChart from "./DonutChart";
import { ChartTitle } from "../../../styles/graph";
import { Flex, TitleH3, ButtonPrimary, ButtonSecondary } from "../../../styles";
import ActionList from "./ActionList";
import ActionPlanEmpty from "./ActionPlanEmpty";
import Axios from "../../../utils/axios";
import { fetchActionPlans } from "../../../store/Actions/actions";
import statisticsCalculator from "../../../utils/statisticsCalculator";
import iconAddSubaction from "../../../assets/startBusiness/add-primary.svg";
import iconList2 from "../../../assets/startBusiness/list-2.svg";
import iconGantt from "../../../assets/startBusiness/gantt.svg";
import Spinner from "../../UI/Spinner";
import Frappe from "./Frappe";
import { ActionPlanPage } from "../../../styles/startBusiness";
import Print from "../../../components/UI/Printer";
import { fetchCurrentIndicatorGroupAction } from "../../../store/SelectedIndicator/actions";
import OverdueTasks from "./OverdueActions";
import UserRoles from "../../Members/UserRoles";
import { OVERDUE_ACTIONS } from "../../../graphql/actions";
import { withLocale } from "../../../utils/locale";
import PrintToFile from "../../UI/PrintToFile";

const AddActionPlan = lazy(() => import("./AddActionPlan"));
const Panel = Collapse.Panel;

class ActionPlan extends Component {
  state = {
    isGanttActive: false,
    newAction: false,
    modalVisible: false,
    showAllActions: false,
    collapseActive: false,
    printActive: false,
    overDueTasks: 0,
    printSortedData: [],
  };

  actionListRef = createRef();
  ganttRef = createRef();
  parentRef = createRef();

  componentDidMount() {
    const { id } = this.props.currentIndicator;
    if (id) {
      this.props.fetchActionPlans(id);
      this.fetchOverdueActions();
    }
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props.currentIndicator;
    if (
      prevProps.selectedWorkingGroup.id !== this.props.selectedWorkingGroup.id
    ) {
      this.props.fetchActionPlans(id);
      this.fetchOverdueActions();
    }
  }

  fetchOverdueActions = async () => {
    const { id } = this.props.currentIndicator;
    try {
      const { data } = await Axios.post("/graphql", {
        query: OVERDUE_ACTIONS,
        variables: {
          filter: {
            status: "ongoing_past_deadline",
            group_id: id,
          },
          order: {
            key: "end_at",
            direction: "asc",
          },
        },
      });

      const overDueTasks = [];

      data.data.actions.nodes.forEach((item) => {
        const { sub_actions, ...data } = item;
        const overDueSubActions = sub_actions.filter(
          (i) => i.status === "ongoing_past_deadline"
        );
        overDueTasks.push({ ...data, isParent: true }, ...overDueSubActions);
      });

      this.setState({ overDueTasks });
    } catch (err) {
      console.log(err);
    }
  };

  ganttChartHandler = (status) => {
    this.setState({ isGanttActive: status });
  };

  formModalHandler = () => {
    this.props.fetchActionPlans(this.props.selectedWorkingGroup.id);
    this.setState((prevState) => ({ newAction: !prevState.newAction }));
  };

  beforePrint = () => {
    this.setState({ printActive: true });
  };

  afterPrint = () => {
    this.setState({ printActive: false });
  };

  handleUserRoles = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }));

  render() {
    const { t } = this.props;
    const {
      isGanttActive,
      showAllActions,
      collapseActive,
      newAction,
      printActive,
      modalVisible,
      overDueTasks,
    } = this.state;
    const { actions, selectedWorkingGroup, actionPermissions } = this.props;
    const isEmpty = actions.length === 0;
    let chartData = [{}];
    if (selectedWorkingGroup.sub_action_stats) {
      chartData = statisticsCalculator(selectedWorkingGroup.action_stats);
    }

    const controlSection = (
      <ActionPlanPage>
        <Flex margin="30px 0 20px" className="action-btn-group">
          <TitleH3>{t("Action plan")}</TitleH3>
          {!isEmpty && (
            <>
              <Button
                style={{ marginLeft: "auto" }}
                onClick={() => this.setState({ isGanttActive: true })}
                title={t("Gantt Chart")}
                className={`small list-btn transparent ${
                  isGanttActive && "active"
                }`}
              >
                <img src={iconGantt} alt={t("show ganttchart")} />
              </Button>
              <Button
                onClick={() => this.setState({ isGanttActive: false })}
                className={`small list-btn transparent ${
                  !isGanttActive && "active"
                }`}
              >
                <img src={iconList2} alt={t("add subaction")} />
              </Button>
            </>
          )}
          {actionPermissions.create ? (
            <ButtonPrimary
              style={{ marginLeft: isEmpty ? "auto" : "initial" }}
              className="small add-new-action"
              onClick={this.formModalHandler}
            >
              <img src={iconAddSubaction} alt={t("add subaction")} />
              {t("New Action")}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              style={{ marginLeft: isEmpty ? "auto" : "initial" }}
              className="small add-new-action"
            >
              <img src={iconAddSubaction} alt={t("add subaction")} />
              <Popover
                title={null}
                trigger="click"
                overlayClassName="actions-popover"
                content={
                  <div>
                    <h3>{t("You are not allowed")}</h3>
                    <div className="content">
                      {t(`You are not authorized to complete this action`)}
                    </div>
                    <Typography.Text
                      underline
                      onClick={this.handleUserRoles}
                      className="clickable"
                    >
                      {t("Learn more about roles")}
                    </Typography.Text>
                    {modalVisible && (
                      <UserRoles hideModal={this.handleUserRoles} />
                    )}
                  </div>
                }
              >
                {t("New Action")}
              </Popover>
            </ButtonPrimary>
          )}
          {!isEmpty && (
            <>
              <Print
                ref={
                  isGanttActive
                    ? this.ganttRef.current
                    : this.actionListRef.current
                }
                beforePrint={this.beforePrint}
                afterPrint={this.afterPrint}
                style={{ marginLeft: 10 }}
                buttonStyle={{ padding: 10, height: 34 }}
              />

              <PrintToFile
                id={this.props.currentIndicator.id}
                title={this.props.currentIndicator.title}
                printSortedData={this.state.printSortedData}
              />
            </>
          )}
        </Flex>
        {newAction && actionPermissions.create && (
          <Suspense fallback={<Spinner />}>
            <AddActionPlan
              indicatorGroup={this.props.currentIndicator}
              modalHandler={this.formModalHandler}
              fetchCurrentWorkingGroup={
                this.props.fetchCurrentIndicatorGroupAction
              }
            />
          </Suspense>
        )}
      </ActionPlanPage>
    );

    if (actions.length) {
      return (
        <div>
          <Row className="action-statistics">
            <Col
              xs={24}
              md={overDueTasks.length ? 8 : 10}
              xl={overDueTasks.length ? 6 : 10}
              className="col-1"
            >
              <div className="inner-block">
                <TitleH3 className="sub-title">
                  {t("Overall progress of tasks")}
                </TitleH3>
                <div className="pb-30">
                  <DonutChart data={chartData} />
                  <Row
                    style={{ marginTop: 12, justifyContent: "space-between" }}
                  >
                    {chartData.map((item, index) => (
                      <Col key={index}>
                        <ChartTitle>
                          <h3>
                            <span
                              className="label"
                              style={{ backgroundColor: item.color }}
                            />
                            {t(item.title)}
                          </h3>
                        </ChartTitle>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
            <Col
              xs={24}
              md={overDueTasks.length ? 8 : 14}
              xl={overDueTasks.length ? 9 : 14}
              className="col-middle"
            >
              <div className="inner-block">
                <TitleH3 className="sub-title">{t("Task progress")}</TitleH3>
                <List
                  itemLayout="horizontal"
                  dataSource={actions.slice(
                    0,
                    showAllActions ? actions.length : 4
                  )}
                  className={`progress-toggle ${
                    showAllActions ? "show" : "hide"
                  }`}
                  renderItem={(item) => {
                    const { total, completed } = item.sub_action_stats;
                    let percent = parseInt((completed / total) * 100, 10);
                    if (!total && item.status === "completed") {
                      percent = 100;
                    }
                    return (
                      <List.Item>
                        <Row style={{ width: "100%" }} gutter={[20]}>
                          <Col span={12}>
                            <h5 className="progress-title">{item.name}</h5>
                          </Col>
                          <Col span={12}>
                            <Progress
                              trailColor="#ECEEF4"
                              strokeColor="#6B91EC"
                              strokeWidth={13}
                              percent={percent}
                              format={(percent) => percent + "%"}
                            />
                          </Col>
                        </Row>
                      </List.Item>
                    );
                  }}
                />
                <Collapse
                  activeKey={[collapseActive ? "statistics" : null]}
                  bordered={false}
                  className="custom-collapse"
                >
                  <Panel key={"statistics"} showArrow={false}>
                    <List
                      itemLayout="horizontal"
                      dataSource={actions.slice(4, actions.length)}
                      className={`progress-toggle`}
                      renderItem={(item) => {
                        const { total, completed } = item.sub_action_stats;
                        let percent = parseInt((completed / total) * 100, 10);
                        if (!total && item.status === "completed") {
                          percent = 100;
                        }
                        return (
                          <List.Item>
                            <Row style={{ width: "100%" }} gutter={[20]}>
                              <Col span={12}>
                                <h5 className="progress-title">{item.name}</h5>
                              </Col>
                              <Col span={12}>
                                <Progress
                                  trailColor="#ECEEF4"
                                  strokeColor="#6B91EC"
                                  strokeWidth={13}
                                  percent={percent}
                                  format={(percent) => percent + "%"}
                                />
                              </Col>
                            </Row>
                          </List.Item>
                        );
                      }}
                    />
                  </Panel>
                </Collapse>
                {actions.length > 4 && (
                  <div className="text-center">
                    <ButtonSecondary
                      type="text"
                      className="transparent small"
                      style={{
                        width: "auto",
                        margin: "auto",
                        fontWeight: "400",
                        marginBottom: 15,
                      }}
                      onClick={() =>
                        this.setState((prevState) => ({
                          collapseActive: !prevState.collapseActive,
                        }))
                      }
                    >
                      {collapseActive ? t("Show Less") : t("Show all")}
                    </ButtonSecondary>
                  </div>
                )}
              </div>
            </Col>
            {overDueTasks.length ? (
              <Col xs={24} md={8} xl={9} className="col-3">
                <div className="inner-block">
                  <OverdueTasks actions={overDueTasks} />
                </div>
              </Col>
            ) : null}
          </Row>
          {controlSection}
          {actions.length ? (
            isGanttActive ? (
              <Frappe data={actions} printRef={this.ganttRef} />
            ) : (
              <ActionList
                printRef={this.actionListRef}
                setPrintSortedData={(data) =>
                  this.setState({ printSortedData: data })
                }
                actionPermissions={actionPermissions}
                data={this.props.actions}
                members={selectedWorkingGroup.members}
                fetchActions={this.props.fetchActionPlans}
                fetchOverdueActions={this.fetchOverdueActions}
                fetchCurrentWorkingGroup={this.props.fetchCurrentWorkingGroup}
                printActive={printActive}
              />
            )
          ) : (
            <ActionPlanEmpty
              actionPermissions={actionPermissions}
              members={selectedWorkingGroup.members}
              organizations={this.state.organizations}
              groupId={selectedWorkingGroup.id}
              fetchActions={this.props.fetchActionPlans}
            />
          )}
        </div>
      );
    }

    return (
      <ActionPlanEmpty
        actionPermissions={actionPermissions}
        members={selectedWorkingGroup.members}
        organizations={this.state.organizations}
        groupId={selectedWorkingGroup.id}
        fetchActions={this.props.fetchActionPlans}
      >
        {controlSection}
      </ActionPlanEmpty>
    );
  }
}

const mapStateToProps = (state) => ({
  actions: state.actions.data,
  selectedWorkingGroup: state.selectedWorkingGroup,
  user: state.auth.account,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchActionPlans,
      fetchCurrentIndicatorGroupAction,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocale(ActionPlan));
