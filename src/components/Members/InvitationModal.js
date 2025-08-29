import React, { useEffect, useRef, useState, } from 'react';
import {
  Input as AntInput, Result, Row, Col, Modal, Alert, Select,
} from 'antd';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { ButtonPrimary, InputWrapper, Input, Button, TitleH3 } from '../../styles';
import { INVITE_ACCOUNT } from '../../graphql/invitation';
import { ReactComponent as IconInvitation } from '../../assets/invitation/invite.svg';
import Axios from '../../utils/axios';
import { FETCH_ORGANIZATIONS_AND_GROUPS } from '../../graphql/auth';
import { ReactComponent as IconCheck } from '../../assets/list-icon.svg';
import { filterVals, roleNames, roleWeights, verboseErrors, isUserAllowed } from '../../utils';
import { useLocale } from "../../utils/locale";


export default function InviteModal(props) {
  const {
    visible, handleSuccess, handleCancel, parentRef, members
  } = props;
  const myAccount = useSelector((state) => state.auth.account);
  const [t] = useLocale()
  const [email, setEmail] = useState('');
  const history = useHistory();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [comment, setComment] = useState('');
  const [leader_groups, setLeaderGroups] = useState([]);
  const [member_groups, setMemberGroups] = useState([]);
  const [groups, setGroups] = useState(null);
  const [role, setRole] = useState('participant');
  // TODO add organizations
  const [errors, setErrors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const roleSelectAllowed = (role) => {
    return myAccount.role === 'superuser'
      || roleWeights[myAccount.role] > roleWeights[role]
      || (myAccount.role === 'participant' && role === 'participant' && myAccount.leader_groups.length)
  }
  const groupFilter = (group) =>
    (['superuser', 'coordinator'].includes(myAccount.role)
      || myAccount.leader_groups.map(group => group.id).includes(group.id));
  const accountExist = members.filter(member => member.email === email)[0];

  useEffect(() => {
    if (accountExist) {
      setErrors([t("A user already exists, click a button to navigate")])
    } else {
      setErrors([])
    }
  }, [accountExist]);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.post('/graphql', { query: FETCH_ORGANIZATIONS_AND_GROUPS });
        if (res?.data?.data) {
          const { organizations: orgs, indicator_groups: indicatorGroups } = res.data.data;
          setOrganizations(orgs.nodes);
          setAllGroups(indicatorGroups.nodes.filter((group) => {
            if (myAccount.role === 'participant') {
              return group.leaders.map(l => l.id).includes(myAccount.id);
            }
            if (['superuser', 'coordinator'].includes(myAccount.role)) {
              return true;
            }
            return
          }));
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [myAccount]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const account = {
      first_name: firstName,
      last_name: lastName,
      comment,
      email,
      leader_groups,
      member_groups,
      role,
    };

    const filteredAccount = filterVals((v) => v, account);
    try {
      const res = await Axios.post('/graphql',
        {
          query: INVITE_ACCOUNT,
          variables: {
            account: filteredAccount,
          },
        });
      const invitedAccount = res?.data?.data.invite_account;
      if (invitedAccount) {
        handleSuccess(email);
      }
    } catch (err) {
      if (err.response.status === 422) {
        setErrors(verboseErrors(err.response.data.errors[0].extensions.validation.account));
        console.log(verboseErrors(err.response.data.errors[0].extensions.validation.account));
      }
    }
  };

  const emailRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const leader_groupsRef = useRef(null);
  const member_groupsRef = useRef(null);
  const showGroupSelect = ['participant'].includes(role);

  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      zIndex={1059}
      getContainer={() => parentRef?.current}
    >
      <Result
        icon={<IconInvitation fill="#527BDD" width="50" />}
        title={t("Invite a new user to a system")}
        className="invitation-modal"
        extra={(
          <form onSubmit={onSubmit}>
            {errors.map((error) => (
              <Alert
                style={{ marginBottom: 15 }}
                key={error}
                message={error}
                type="error"
                showIcon
              />
            ))}
            <Row gutter={[15, 15]}>
              {accountExist && (
                <Col span={24}>
                  <Button onClick={() => history.push(`?scroll_to_member=${accountExist.id}`)}
                    className="small"
                    style={{ width: '100%' }}>{t("Navigate to account")}</Button>
                </Col>
              )}
              <Col span={24}>
                <InputWrapper margin="0">
                  <Input
                    required
                    type="email"
                    value={email}
                    ref={emailRef}
                    className={`dynamic-input ${email ? 'has-value' : ''} ${errors.email && 'input-error'}`}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="" onClick={() => emailRef.current.focus()}>{t("Email")}</label>
                </InputWrapper>
              </Col>
              <Col span={12}>
                <InputWrapper margin="0">
                  <Input
                    required
                    disabled={accountExist}
                    type="text"
                    value={firstName}
                    ref={firstNameRef}
                    className={`dynamic-input ${firstName ? 'has-value' : ''} ${errors.email && 'input-error'}`}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <label htmlFor="" onClick={() => firstNameRef.current.focus()}>{t("First name")}</label>
                </InputWrapper>
              </Col>
              <Col span={12}>
                <InputWrapper margin="0">
                  <Input
                    required
                    disabled={accountExist}
                    type="lastName"
                    value={lastName}
                    ref={lastNameRef}
                    className={`dynamic-input ${lastName ? 'has-value' : ''} ${errors.lastName && 'input-error'}`}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <label htmlFor="" onClick={() => lastNameRef.current.focus()}>{t("Last name")}</label>
                </InputWrapper>
              </Col>
              {
                isUserAllowed(myAccount) &&
                <Col span={24}>
                  <InputWrapper className="has-messages" margin="0">
                    <Select
                      multiple={false}
                      value={role}
                      disabled={accountExist}
                      onChange={(val) => setRole(val)}
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      className={`custom-select ${role && 'has-value'}`}
                      getPopupContainer={(node) => node.parentNode}
                      menuItemSelectedIcon={<IconCheck className="check-icon" />}
                      dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
                    >
                      {Object.keys(roleNames).filter(roleSelectAllowed).map(role => {
                        return (
                          <Select.Option key={role} className="select-item"
                            value={role}>
                            {roleNames[role]}
                          </Select.Option>)
                      })}
                    </Select>
                    <label htmlFor="" className="custom-select-label">{t("Role")}</label>
                    <span className="input-msg" />
                  </InputWrapper>
                </Col>
              }

              {
                role === 'participant' &&
                (
                  <>
                    {
                      myAccount.role !== 'participant' &&
                      <Col span={24}>
                        <InputWrapper style={{ margin: 0 }} className="has-messages working-group">
                          <Select
                            mode="multiple"
                            showSearch
                            required
                            size="large"
                            placeholder={t("Assign as a leader in following group/s")}
                            onChange={(val) => setLeaderGroups(val)}
                            value={leader_groups}
                            ref={leader_groupsRef}
                            style={{ width: '100%' }}
                            className={`custom-select members ${leader_groups.length > 0 ? 'has-value' : ''}`}
                            optionFilterProp="children"
                            allowClear
                            getPopupContainer={(node) => node.parentNode}
                            dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
                          >
                            {allGroups.filter(groupFilter).filter(acc => !member_groups.includes(acc.id)).map((group) => (
                              <Select.Option
                                key={group.id}
                                className="select-item"
                                value={group.id}
                              >
                                {group.title}
                              </Select.Option>
                            ))}
                          </Select>
                          <label htmlFor="" className="custom-select-label">{t("Assign as a leader in following group/s")}</label>
                          <span className="input-msg" />
                        </InputWrapper>
                      </Col>
                    }

                    <Col span={24}>
                      <InputWrapper style={{ margin: 0 }} className="has-messages working-group">
                        <Select
                          mode="multiple"
                          showSearch
                          required
                          size="large"
                          placeholder={t("Assign as a member in following group/s")}
                          onChange={(val) => setMemberGroups(val)}
                          value={member_groups}
                          ref={member_groupsRef}
                          style={{ width: '100%' }}
                          className={`custom-select members ${member_groups.length > 0 ? 'has-value' : ''}`}
                          optionFilterProp="children"
                          allowClear
                          getPopupContainer={(node) => node.parentNode}
                          dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
                        >
                          {allGroups.filter(groupFilter).filter(acc => !leader_groups.includes(acc.id)).map((group) => (
                            <Select.Option
                              key={group.id}
                              className="select-item"
                              value={group.id}
                            >
                              {group.title}
                            </Select.Option>
                          ))}
                        </Select>
                        <label htmlFor="" className="custom-select-label">{t("Assign as a member in following group/s")}</label>
                        <span className="input-msg" />
                      </InputWrapper>
                    </Col>

                  </>
                )
              }

              {/* <Col span={24}>
                <AntInput.TextArea
                  rows={4}
                  disabled={accountExist}
                  placeholder={t("Comment")}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ marginRight: 12, padding: 15 }}
                />
              </Col> */}
              <Col span={24}>
                <ButtonPrimary disabled={accountExist} className="small"
                  style={{ width: '100%', height: 46, }}>{t("Invite")}</ButtonPrimary>
              </Col>
            </Row>
          </form>
        )}
      />
    </Modal>
  );
}
