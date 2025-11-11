import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Alert, Button, PageHeader, PageHeaderTitle, PageHeaderActions } from '../../UI/shadcn';
import { Select } from 'antd';
import { WorkingGroup } from '../../../styles/workingGroup';
import {
  InputWrapper,
  Flex,
} from '../../../styles';
import { Plus } from 'lucide-react';
import { ReactComponent as IconCheck } from '../../../assets/list-icon.svg';
import { ADD_MEMBERS_MUTATION } from '../../../graphql/workingGroups';
import { FETCH_ALL_MEMBERS } from '../../../graphql/members';
import Axios from '../../../utils/axios';
import { fetchCurrentIndicatorGroupAction } from '../../../store/SelectedIndicator/actions';
import { dissoc, ErrorAlerts, groupTitleToUrl, InputErrors, parseErrors } from '../../../utils';
import {withLocale} from "../../../utils/locale";

export const errorsConfig = {
  members: {
    "should be active": {
      alert: "Selected accounts should be active",
      msg: "should be active"
    },
    "should be existing": {
      alert: "Some selected account are not found",
      msg: "should contain existing accounts"
    },
    "cannot be empty": {
      alert: false,
      msg: "cannot be empty"
    }
  },
  group_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false
    }
  }
};


class AddMember extends Component {
  state = {
    visible: false,
    title: '',
    allAccounts: [],
    members: [],
    alerts: [],
    errors: {}
  };

  showModal = async () => {
    try {
      const res = await Axios.post('/graphql', {
        query: FETCH_ALL_MEMBERS,
        variables: {
          filter: {
            status: 'active',
            role: 'participant'
          },
          pagination: {
            size: -1
          }
        },
      });
      if (res?.data) {
        console.log(res.data);
        const { nodes } = res.data?.data?.accounts;
        this.setState({ allAccounts: nodes, visible: true, members: [] });
      }
    } catch (err) {
      console.log(err.response);
    }
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
      alerts: [],
      errors: {}
    });
  };

  selectHandler = (value) => {
    this.setState({
      members: value, errors: dissoc(this.state.errors, 'members')
    });
  }

  addMembers = async () => {
    const { members } = this.state;
    const { groupId, selectedWorkingGroup: { title } } = this.props;
    this.setState({ alerts: [], errors: {} })
    try {
      const res = await Axios.post('/graphql', {
        query: ADD_MEMBERS_MUTATION,
        variables: {
          group_id: groupId,
          members,
        },
      });
      if (res?.data) {
        this.setState({ visible: false, members: [], errors: {}, alerts: [] });
        this.props.fetchMembers();
        this.props.fetchCurrentIndicatorGroupAction(groupTitleToUrl(title));
      }
    } catch (err) {
      if (err.message.includes('422')) {
        const errorsRaw = err.response.data.errors[0].extensions?.validation;
        const { alerts, errors } = parseErrors(errorsConfig, errorsRaw);
        this.setState({ alerts, errors, members: [] })
      }
    }
  }

  render() {
    const { members, allAccounts, visible, alerts, errors } = this.state;
    const { membersPermissions, user: { role }, groupId, alerts: externalAlerts, selectedWorkingGroup } = this.props;
    const {t} = this.props;
    return (
      <WorkingGroup>
        {!visible && <ErrorAlerts style={{ marginBottom: 20 }} alerts={[...alerts, ...externalAlerts]} />}
        <PageHeader>
          <PageHeaderTitle>{t("All members")}</PageHeaderTitle>
          <PageHeaderActions>
            {this.props.children}
            {
              membersPermissions.create
              && (
                <Button size="sm" onClick={this.showModal}>
                  <Plus size={16} />
                  {t("Add member")}
                </Button>
              )
            }
          </PageHeaderActions>
        </PageHeader>
        <Modal
          title={null}
          visible={visible && membersPermissions.create}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          zIndex={1080}
        >
          <h2 style={styles.title}>{t("Add member")}</h2>
          <ErrorAlerts alerts={[...alerts]} />
          <InputWrapper className='has-messages' align='flex-end'>
            <Select
              mode="multiple"
              size="large"
              placeholder={t("Working Group Members")}
              value={members}
              onChange={this.selectHandler}
              style={{ width: '100%' }}
              optionFilterProp="children"
              allowClear
              getPopupContainer={(node) => node.parentNode}
              className={errors.members && 'input-error'}
              menuItemSelectedIcon={<IconCheck className="check-icon" />}
              dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
              ref={(select) => this.memberSelect = select}
              onSelect={() => {
                this.memberSelect.blur();
              }}
            >
              {
                allAccounts
                  .filter((member) => ![...member.leader_groups, ...member.member_groups].map(gr => gr.id).includes(groupId))
                  .map((item) => <Select.Option key={item.id} className="select-item"
                    value={item.id}>{`${item.first_name} ${item.last_name}`}</Select.Option>)
              }
            </Select>
            <InputErrors name={'members'} errors={errors} />
          </InputWrapper>
          <Flex>
            <Button variant="outline" onClick={this.handleCancel} style={{ marginRight: 12 }}>{t("Cancel")}</Button>
            <Button onClick={this.addMembers}>{t("Apply")}</Button>
          </Flex>
        </Modal>
      </WorkingGroup>
    );
  }
}

const styles = {
  title: {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: '30px',
    color: '#252A32',
  },
};

const mapStateToProps = (state) => ({
  user: state.auth.account,
  selectedWorkingGroup: state.selectedWorkingGroup,
});

const mapDispatchToProps = dispatch => bindActionCreators({ fetchCurrentIndicatorGroupAction }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withLocale(AddMember));
