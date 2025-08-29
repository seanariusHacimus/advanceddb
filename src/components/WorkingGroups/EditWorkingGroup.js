import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Modal, Select, Alert,
} from 'antd';
import { WorkingGroup } from '../../styles/workingGroup';
import {
  Input, InputWrapper, Flex, Button, ButtonPrimary,
} from '../../styles';
import { UPDATE_WORKING_GROUP } from '../../graphql/workingGroups';
import { FETCH_ALL_MEMBERS } from '../../graphql/members';
import { ReactComponent as IconCheck } from '../../assets/list-icon.svg';
import Axios from '../../utils/axios';
import { fetchWorkingGroupsAction } from '../../store/WorkingGroups/actions';
import {withLocale} from "../../utils/locale";

class NewWorkingGroup extends Component {
  state = {
    visible: false,
    group: {
      title: '',
      members: [],
      leaders: [],
    },
    allAccounts: [],
    errorMsg: '',
    titleError: '',
  };

  componentDidMount() {
    const { selectedItem } = this.props;
    this.setState({
      group: {
        ...selectedItem,
        leaders: selectedItem.leaders.map(l => l.id),
        members: selectedItem.members.map(l => l.id)
      }
    });
    this.fetchMembers();
  }

  fetchMembers = async () => {
    try {
      const res = await Axios.post('/graphql', {
        query: FETCH_ALL_MEMBERS,
        variables: {
          pagination: {
            size: -1
          },
          filter: {
            role: 'participant',
            // status: 'active',
          }
        },
      });
      if (res?.data) {
        const { accounts } = res.data.data;
        this.setState({ allAccounts: accounts.nodes });
      }
    } catch (err) {
      console.log(err);
    }
  }

  inputHandler = (e) => {
    this.setState({ group: { ...this.state.group, [e.target.name]: e.target.value }, });
  }

  updateWorkingGroup = async () => {
    const {
      group
    } = this.state;
    const {t} = this.props;
    const { title, id, leaders, members, } = group;
    const query = {
      query: UPDATE_WORKING_GROUP,
      variables: {
        group: {
          title,
          // number,
        },
        leaders,
        members,
        id,
      },
    };

    try {
      const res = await Axios.post('/graphql', query);
      if (res?.data) {
        this.setState({ visible: false });
        this.props.fetchWorkingGroupsAction();
        this.props.modalHandler();
      }
    } catch (err) {
      // TODO parse errors
      const { extensions = '', message = '' } = err.response?.data?.errors[0];
      console.log(err.response);
      if (extensions.validation) {
        this.setState({
          titleError: extensions.validation.group.title.includes('should not conflict') ? t('Group with this title is already exist') : extensions.validation.group.title,
          membersError: this.state.members?.length && t('Selected users can not be assigned'),
          leadersError: this.state.leaders?.length && t('Selected users can not be assigned'),
        });
      } else {
        this.setState({ errorMsg: message });
      }
    }
  }

  render() {
    const {
      errorMsg, allAccounts, group
    } = this.state;
    const { title, leaders, members } = group
    const {t} = this.props;
    return (
      <WorkingGroup>
        <Modal
          title={null}
          visible={this.props.visible}
          onOk={this.props.modalHandler}
          onCancel={this.props.modalHandler}
          footer={null}
          zIndex={1080}
        >
          <h2 style={styles.title}>{t("Edit working group")}</h2>
          {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
          <InputWrapper className="has-messages">
            <Input
              required
              type="text"
              name="title"
              value={title}
              ref={(el) => this.titleRef = el}
              autoComplete="new-email"
              id="WG-title"
              className={`dynamic-input ${title ? 'has-value' : ''}`}
              onChange={this.inputHandler}
              disabled={!this.state.group.removable}
              readOnly={!this.state.group.removable}
            />
            <label htmlFor="" onClick={() => this.titleRef.focus()}>{t("Working group name")}</label>
            <span className="input-msg">{this.state.titleError}</span>
          </InputWrapper>
          <InputWrapper className="has-messages working-group">
            <Select
              required
              allowClear
              showSearch
              size={'large'}
              mode="multiple"
              value={leaders}
              style={{ width: '100%' }}
              optionFilterProp="children"
              placeholder={t("Group leaders")}
              ref={(el) => this.leadersRef = el}
              className={`custom-select members ${leaders.length > 0 ? 'has-value' : ''}`}
              onChange={(leaders) => this.inputHandler({ target: { name: 'leaders', value: leaders } })}
              getPopupContainer={(node) => node.parentNode}
              menuItemSelectedIcon={<IconCheck className="check-icon" />}
              dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
            >
              {
                allAccounts.filter(acc => !members.includes(acc.id))
                  .map((item) =>
                    <Select.Option key={item.id} className="select-item" value={item.id}
                      disabled={["disabled", "denied", "pending", "unconfirmed", "invite_expired"].includes(item.status) && !leaders.includes(item.id)}>
                      {`${item.first_name} ${item.last_name}`}
                    </Select.Option>)
              }
            </Select>
            <label htmlFor="" className="custom-select-label">{t("Group leaders")}</label>
            <span className="input-msg">{this.state.leadersError}</span>
          </InputWrapper>

          <InputWrapper className="has-messages working-group">
            <Select
              required
              allowClear
              showSearch
              size="large"
              mode="multiple"
              value={members}
              style={{ width: '100%' }}
              optionFilterProp="children"
              placeholder={t("Group members")}
              ref={(el) => this.membersRef = el}
              className={`custom-select members ${members.length > 0 ? 'has-value' : ''}`}
              onChange={(members) => this.inputHandler({ target: { name: 'members', value: members } })}
              getPopupContainer={(node) => node.parentNode}
              menuItemSelectedIcon={<IconCheck className="check-icon" />}
              dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
            >
              {
                allAccounts.filter(acc => !leaders.includes(acc.id))
                  .map((item) =>
                    <Select.Option key={item.id} className="select-item" value={item.id}
                      disabled={["disabled", "denied", "pending", "unconfirmed", "invite_expired"].includes(item.status) && !members.includes(item.id)}>
                      {`${item.first_name} ${item.last_name}`}
                    </Select.Option>)
              }
            </Select>
            <label htmlFor="" className="custom-select-label">{t("Group members")}</label>
            <span className="input-msg">{this.state.leadersError}</span>
          </InputWrapper>
          <Flex>
            <Button type="reset" onClick={this.props.modalHandler}
              style={{ height: 51, marginRight: 12 }}>{t("Cancel")}</Button>
            <ButtonPrimary onClick={this.updateWorkingGroup}>{t("Apply")}</ButtonPrimary>
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
  user: state.auth,
  indicators: state.workingGroups.data,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchWorkingGroupsAction }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withLocale(NewWorkingGroup));
