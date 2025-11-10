import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StartBusinessPage from '../../styles/startBusiness';
import ActionPlan from './ActionPlan/index';
import MeetingMinutes from './MeetingsMinutes';
import Members from './Members';
import { fetchCurrentIndicatorGroupAction, selectWorkingGroupAction } from '../../store/SelectedIndicator/actions';
import { withLocale } from "../../utils/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../UI/shadcn';
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
  }

  componentDidMount() {
    const { selectedWorkingGroup } = this.props;
    this.setState({ ...this.props.selectedWorkingGroup });
  }

  handleActiveKey = key => {
    this.props.history.push({ search: 'active_tab=' + key });
  }

  render() {
    const { selectedWorkingGroup, fetchCurrentIndicatorGroupAction, location: { search }, user } = this.props;
    const getKeyFromUrl = new URLSearchParams(search).get('active_tab');
    const activeKey = ['actions', 'meetings', 'members'].includes(getKeyFromUrl) ? getKeyFromUrl : 'actions';
    const { t } = this.props;

    return (
      <StartBusinessPage className="graph-with-box" ref={this.printRef}>
        {user.role === 'participant' && (
          <div style={{ marginBottom: '16px', fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
            {t('Your role')}: <strong style={{ color: 'hsl(var(--foreground))' }}>{t(selectedWorkingGroup.my_role)}</strong>
          </div>
        )}
        <Tabs 
          defaultValue={activeKey}
          value={activeKey}
          onValueChange={(key) => this.handleActiveKey(key)}
        >
          <TabsList>
            <TabsTrigger 
              value="actions" 
              data-state={activeKey === 'actions' ? 'active' : 'inactive'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleActiveKey('actions');
              }}
            >
              {t("Action Plan")}
            </TabsTrigger>
            <TabsTrigger 
              value="meetings" 
              data-state={activeKey === 'meetings' ? 'active' : 'inactive'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleActiveKey('meetings');
              }}
            >
              {t("Meeting Minutes")}
            </TabsTrigger>
            <TabsTrigger 
              value="members" 
              data-state={activeKey === 'members' ? 'active' : 'inactive'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleActiveKey('members');
              }}
            >
              {t("Working Group Members")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="actions" data-state={activeKey === 'actions' ? 'active' : 'inactive'}>
            <ActionPlan
              actionPermissions={selectedWorkingGroup.permissions.action}
              chartData={chartData}
              currentIndicator={selectedWorkingGroup}
              fetchCurrentWorkingGroup={fetchCurrentIndicatorGroupAction}
            />
          </TabsContent>
          
          <TabsContent value="meetings" data-state={activeKey === 'meetings' ? 'active' : 'inactive'}>
            <MeetingMinutes
              meetingMinutesPermissions={selectedWorkingGroup.permissions.meeting_minute}
              members={selectedWorkingGroup.members}
            />
          </TabsContent>
          
          <TabsContent value="members" data-state={activeKey === 'members' ? 'active' : 'inactive'}>
            <Members
              membersPermissions={selectedWorkingGroup.permissions.member}
            />
          </TabsContent>
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
