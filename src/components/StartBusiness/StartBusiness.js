import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import StartBusinessPage from '../../styles/startBusiness';
import ActionPlan from './ActionPlan/index';
import MeetingMinutes from './MeetingsMinutes';
import Members from './Members';
import { fetchCurrentIndicatorGroupAction, selectWorkingGroupAction } from '../../store/SelectedIndicator/actions';
import { withLocale } from "../../utils/locale";

const { TabPane } = Tabs;
const chartData = [
  {
    name: 'completed', title: 'Completed tasks', value: 40, color: '#527BDD',
  },
  {
    name: 'ongoing', title: 'Ongoing within deadline', value: 23, color: '#F4D581',
  },
  {
    name: 'ongoingPast', title: 'Ongoing past deadline', value: 10, color: '#F4C9D9',
  },
  {
    name: 'notStarted', title: 'Not started', value: 27, color: '#E5E7EF',
  },
];

class StartBusiness extends Component {
  state = {
    id: '',
    printActive: false,
    activeKey: 'actions',
  }

  componentDidMount() {
    const { selectedWorkingGroup } = this.props;
    this.setState({ ...this.props.selectedWorkingGroup });
  }

  handleActiveKey = key => {
    this.setState({ activeKey: key });
    this.props.history.push({ search: 'active_tab=' + key });
  }

  render() {
    const { selectedWorkingGroup, fetchCurrentIndicatorGroupAction, location: { search }, user } = this.props;
    const getKeyFromUrl = new URLSearchParams(search).get('active_tab');
    const activeKey = ['actions', 'meetings', 'members'].includes(getKeyFromUrl) ? getKeyFromUrl : 'actions';
    const { t } = this.props;

    return (
      <StartBusinessPage className="graph-with-box" ref={this.printRef}>
        <Tabs
          defaultActiveKey="1"
          destroyInactiveTabPane
          onChange={(key) => this.handleActiveKey(key)}
          activeKey={activeKey}
          tabBarExtraContent={{ right: user.role === 'participant' ? <div className="role-label">{t('Your role')}: <b>{t(selectedWorkingGroup.my_role)}</b></div> : <></> }}
        >
          <TabPane tab={t("Action Plan")} key="actions">
            <ActionPlan
              actionPermissions={selectedWorkingGroup.permissions.action}
              chartData={chartData}
              currentIndicator={selectedWorkingGroup}
              fetchCurrentWorkingGroup={fetchCurrentIndicatorGroupAction}
            />
          </TabPane>
          <TabPane tab={t("Meeting Minutes")} key="meetings">
            <MeetingMinutes
              meetingMinutesPermissions={selectedWorkingGroup.permissions.meeting_minute}
              members={selectedWorkingGroup.members}
            />
          </TabPane>
          <TabPane tab={t("Working Group Members")} key="members">
            <Members
              membersPermissions={selectedWorkingGroup.permissions.member}
            />
          </TabPane>
        </Tabs>
      </StartBusinessPage>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.account,
  selectedWorkingGroup: state.selectedWorkingGroup,
  indicators: state.workingGroups.data,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectWorkingGroupAction,
  fetchCurrentIndicatorGroupAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withLocale(StartBusiness));
