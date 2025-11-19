import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Modal, Menu, Select, Alert
} from 'antd'; // Using Ant components for forms
import { WorkingGroup } from '../../styles/workingGroup';
import {
  Input, InputWrapper, Flex, Button, ButtonPrimary,
} from '../../styles';
import { ReactComponent as IconCheck } from '../../assets/list-icon.svg';
import { CREATE_WORKING_GROUP } from '../../graphql/workingGroups';
import { FETCH_ALL_MEMBERS } from '../../graphql/members';
import Axios from '../../utils/axios';
import { fetchWorkingGroupsAction } from '../../store/WorkingGroups/actions';
import {withLocale} from "../../utils/locale";

const initialState = {
  visible: false,
  group: {
    title: '',
    members: [],
    leaders: [],
  },
  allAccounts: [],
  errorMsg: '',
  titleError: '',
}

class NewWorkingGroup extends Component {
  state = initialState

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
      console.log(res);
      if (res?.data) {
        const { accounts } = res.data.data;
        this.setState({ allAccounts: accounts.nodes, visible: true });
      }
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.fetchMembers();
  }

  handleOk = (e) => {
    this.setState(initialState);
    this.props.modalHandler();
  };

  handleCancel = (e) => {
    this.setState(initialState);
    this.props.modalHandler();
  };

  inputHandler = (e) => {
    this.setState({ group: { ...this.state.group, [e.target.name]: e.target.value }, });
  }

  createWorkingGroup = async () => {
    const {t} = this.props;
    const orderNumber = this.props.indicators.length;
    const {
      group
    } = this.state;
    const { title, leaders, members } = group
    const query = {
      query: CREATE_WORKING_GROUP,
      variables: {
        group: {
          title,
          number: orderNumber,
        },
        members,
        leaders
      },
    };

    try {
      const res = await Axios.post('/graphql', query);
      if (res?.data) {
        this.setState(initialState);
        this.props.fetchWorkingGroupsAction();
        this.props.modalHandler();
      }
    } catch (err) {
      const { extensions, message } = err.response.data.errors[0];
      if (extensions.validation) {
        this.setState({
          titleError: extensions.validation.group.title,
          membersError: extensions.validation.members && t('Selected users can not be assigned'),
          leadersError: extensions.validation.leaders && t('Selected users can not be assigned'),
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
    const { title, leaders, members } = group;
    const {t} = this.props;
    return (
      <WorkingGroup>
        <Modal
          title={null}
          footer={null}
          zIndex={1080}
          onOk={this.handleOk}
          destroyOnClose={true}
          onCancel={this.handleCancel}
          visible={this.props.visible}
        >
          <h2 style={styles.title}>{t("New working group")}</h2>
          {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
          <InputWrapper className="has-messages">
            <Input
              required
              type="text"
              name="title"
              value={title}
              ref={(el) => this.titleRef = el}
              id="wg-title"
              autoComplete="new-email"
              className={`dynamic-input ${title ? 'has-value' : ''}`}
              onChange={this.inputHandler}
            />
            <label htmlFor="" onClick={() => this.titleRef.focus()}>{t("Working Group Name")}</label>
            <span className="input-msg">{this.state.titleError}</span>
          </InputWrapper>
          <InputWrapper className="has-messages working-group">
            <Select
              required
              allowClear
              showSearch
              size="large"
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
                    <Select.Option key={item.id} className="select-item"
                      disabled={["disabled", "denied", "pending", "unconfirmed", "invite_expired"].includes(item.status)}
                      value={item.id}>
                      {`${item.first_name} ${item.last_name}`}
                    </Select.Option>)
              }
            </Select>
            <label htmlFor="" className="custom-select-label">{t("Group leaders")}</label>
            <span className="input-msg">{this.state.membersError}</span>
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
                    <Select.Option key={item.id} className="select-item"
                      disabled={["disabled", "denied", "pending", "unconfirmed", "invite_expired"].includes(item.status)}
                      value={item.id}>
                      {`${item.first_name} ${item.last_name}`}
                    </Select.Option>)
              }
            </Select>
            <label htmlFor="" className="custom-select-label">{t("Group members")}</label>
            <span className="input-msg">{this.state.leadersError}</span>
          </InputWrapper>
          <Flex>
            <Button type="reset" onClick={this.handleCancel}
              style={{ height: 51, marginRight: 12 }}>{t("Cancel")}</Button>
            <ButtonPrimary onClick={this.createWorkingGroup}>{t("Apply")}</ButtonPrimary>
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
