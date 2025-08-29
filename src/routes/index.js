import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import Dashboard from '../components/Dashboard/Dashboard';
import Simulator from '../components/Simulator/Simulator';
import Reform from '../components/Reform';
import Members from '../components/Members';
import WorkingGroups from '../components/WorkingGroups';
import EditMember from '../components/Members/EditMember';
import Profile from '../components/Profile/Profile';
import ProfileEdit from '../components/Profile/ProfileEdit';
import StartBusiness from '../components/StartBusiness/StartBusiness';
import Methodology from '../components/StartBusiness/Methodology';
import CompareCountries from '../components/CompareCountries';
import HistoricalData from '../components/HistoricalData';
import WhatToReform from '../components/StartBusiness/WhatToReform';
import NotificationSettings from "../components/Profile/ProfileNotificationSettings";
import ProfileSecurity from "../components/Profile/ProfileSecurity";
import Organizations from '../components/Organizations';
import Messaging from '../components/Messaging';
import Audit from '../components/Audit';
import Approvals from '../components/Approvals';

export default [
  <Route key="Dashboard" path='/dashboard/home' exact component={Dashboard} />,
  <Route key="WorkingGroups" path='/dashboard/working-groups' secret={true} exact component={WorkingGroups} />,
  <Route key="Simulator" path='/dashboard/db-ranking-simulator' exact component={Simulator} />,
  <Route key="Audit" path='/dashboard/audit' exact admin secret={true} component={Audit} />,
  <Route key="Audit" path='/dashboard/approvals' exact admin component={Approvals} />,
  <Route key="Reform" path='/dashboard/reform-update-for-db-team' exact component={Reform} />,
  <Route key="Organizations" path='/dashboard/organizations' exact component={Organizations} />,
  <Route key="Members" path='/dashboard/members' exact component={Members} />,
  <Route key="MembersEdit" path='/members/:id' exact admin secret={true} component={EditMember} />,
  <Route key="Profile" path='/profile' exact component={Profile} />,
  <Route key="ProfileNotificationsEdit" path='/profile/notification-settings' exact component={NotificationSettings} />,
  <Route key="ProfileEdit" path='/profile/edit' exact component={ProfileEdit} />,
  <Route key="ProfileSecurity" path='/profile/security' exact component={ProfileSecurity} />,
  <Route key="Messaging" path='/dashboard/messaging' exact component={Messaging} />,
  <Route
    exact
    key="StartBuisness"
    path='/working-group/:title'
    render={props => <StartBusiness {...props} key={props.match.params.title} />}
  />,
  <Route
    exact
    key="Methodology"
    path='/working-group/:title/methodology'
    render={props => <Methodology {...props} key={props.match.params.title} />}
  />,
  <Route
    exact
    key="CompareCountries"
    path='/working-group/:title/business-comparison'
    render={props => <CompareCountries {...props} key={props.match.params.title} />}
  />,
  <Route
    exact
    key="HistoricalData"
    path='/working-group/:title/historical-data'
    render={props => <HistoricalData {...props} key={props.match.params.title} />}
  />,
  <Route
    exact
    key="WhatToReform"
    path='/working-group/:title/what-to-reform'
    render={props => <WhatToReform {...props} key={props.match.params.title} />}
  />,

  <Redirect key="defaultRedirect" to='/dashboard/home' />
]
