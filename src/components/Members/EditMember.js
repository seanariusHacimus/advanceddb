import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Select, Alert, Row, Col, AutoComplete,
} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import camelcaseKeys from 'camelcase-keys';
import snakecase_keys from 'snakecase-keys/index';
import { FETCH_ACCOUNT_BY_ID, UPDATE_MEMBER_ACCOUNT } from '../../graphql/members';
import Axios from '../../utils/axios';
import iconError from '../../assets/auth/error.svg'
// -------------- STYLES -----------
import {
  ButtonPrimary,
  ButtonSecondary,
  Input,
  InputWrapper,
  Title,
  Flex,
  TitleH3,
} from '../../styles';
// -------------- ASSETS -----------
import { colors } from '../../constants';
import {
  FETCH_ORGANIZATIONS_AND_GROUP_INFOS,
} from '../../graphql/auth';
import {
  verboseErrors, pick, filterVals, roleWeights, indexBy,
} from '../../utils';
import { ReactComponent as IconCheck } from '../../assets/list-icon.svg';
import { roleNames } from '../../utils'
import {useLocale} from "../../utils/locale";

function EditMember(props) {
  const { id } = useParams();
  const [account, setAccount] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    middleName: '',
    organization: '',
    comment: '',
    prefix: '',
    jobPosition: '',
    password: null,
    confirmPassword: '',
    role: '',
    primaryRole: null,
    secondaryRole: null,
    leader_groups: [],
    member_groups: [],
  });

  const myAccount = useSelector((state) => state.auth.account);
  const roleSelectAllowed = (role) => {
    return myAccount.role === 'superuser' || roleWeights[myAccount.role] > roleWeights[role]
  }

  const [organizations, setOrganizations] = useState([]);
  const [allGroups, setAllGroups] = useState({});
  const [errors, setErrors] = useState([]);
  const {
    confirmPassword,
    email,
    firstName,
    role,
    lastName,
    jobPosition,
    middleName,
    organization,
    password,
    phone,
    prefix,
    leader_groups,
    member_groups,
  } = account;
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.post('/graphql', { query: FETCH_ORGANIZATIONS_AND_GROUP_INFOS });
        if (res?.data?.data) {
          const { organizations: orgs, indicator_group_infos } = res.data.data;
          setOrganizations(orgs.nodes);
          setAllGroups(indexBy(indicator_group_infos.nodes, 'id'));
        }
      } catch (err) {
        console.error('[Custom Catch Error]-->', err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.post('/graphql', { query: FETCH_ACCOUNT_BY_ID, variables: { id } });
        if (res?.data?.data) {
          const accountInfo = res.data.data.accounts.nodes[0];
          setAccount({
            ...account,
            ...filterVals((v) => v,
              {
                ...camelcaseKeys(accountInfo),
                organization: accountInfo.organization?.title,
                leader_groups: accountInfo.leader_groups?.map((group) => group.id),
                member_groups: accountInfo.member_groups?.map((group) => group.id),
              }),
          });
        }
      } catch (err) {
        console.error('[Custom Catch Error]-->', err);
      }
    })();
  }, [id]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, ...camelcaseKeys({ [name]: value }) });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const filteredAccount = Object.keys(
      pick(account, [
        'email',
        'phone',
        'firstName',
        'lastName',
        'middleName',
        'organization',
        'comment',
        'prefix',
        'jobPosition',
        'password',
        'leader_groups',
        'member_groups',
        'role'
      ]),
    ).reduce((acc, name) => (account[name] ? {
      ...acc,
      [name]: account[name],
    } : acc), {});
    try {
      const res = await Axios.post('/graphql', {
        query: UPDATE_MEMBER_ACCOUNT,
        variables: {
          account:
            snakecase_keys(filteredAccount),
          id,
        },
      });
      if (res.status === 200) {
        history.push('/dashboard/members');
      }
    } catch (err) {
      if (err.message.includes('422')) {
        setErrors(verboseErrors(err.response.data.errors[0].extensions.validation.account));
      }
    }
  };
  const [t] = useLocale()
  const firstNameRef = useRef(null);
  const middleNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const prefixRef = useRef(null);
  const jobPositionRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const organizationRef = useRef(null);
  const leader_groupsRef = useRef(null);
  const member_groupsRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  return (
    <div>
      <Row align="center">
        <Col xs={24} sm={24} md={24} xl={24} xxl={12}>
          <Title margin="0 0 40px">{t("Edit account")}</Title>
          <form action="" onSubmit={submitForm} autoComplete="off">
            {errors.map((error) => (
              <Alert
                style={{ marginTop: 8 }}
                key={error}
                message={error}
                type="error"
                showIcon
              />
            ))}
            <Row gutter={[0, 0]}>
              <Col xs={24} sm={12}>
                <InputWrapper style={{ margin: '10px' }}>
                  <Input
                    required

                    type="text"
                    name="first_name"
                    value={firstName}
                    ref={firstNameRef}
                    className={`dynamic-input ${firstName ? 'has-value' : ''}`}
                    onChange={handleInput}
                  />
                  <label htmlFor="" onClick={() => firstNameRef.current.focus()}>{t("First name")}</label>
                </InputWrapper>
              </Col>
              <Col xs={24} sm={12}>
                <InputWrapper style={{ margin: '10px' }}>
                  <Input
                    required
                    type="text"

                    name="last_name"
                    value={lastName}
                    ref={lastNameRef}
                    className={`dynamic-input ${lastName ? 'has-value' : ''}`}
                    onChange={handleInput}
                  />
                  <label htmlFor="" onClick={() => lastNameRef.current.focus()}>{t("Last name")}</label>
                </InputWrapper>
              </Col>
              <Col xs={24} sm={12}>
                <InputWrapper style={{ margin: '10px' }}>
                  <Input
                    // required
                    type="text"
                    name="middle_name"

                    value={middleName}
                    ref={middleNameRef}
                    className={`dynamic-input ${middleName ? 'has-value' : ''}`}
                    onChange={handleInput}
                  />
                  <label htmlFor="" onClick={() => middleNameRef.current.focus()}>{t("Middle name(optional)")}</label>
                </InputWrapper>
              </Col>
              <Col xs={24} sm={12}>
                <InputWrapper style={{ margin: '10px' }}>
                  <Input
                    type="text"
                    name="prefix"
                    value={prefix}
                    ref={prefixRef}
                    className={`dynamic-input ${prefix ? 'has-value' : ''}`}
                    onChange={handleInput}
                  />
                  <label htmlFor="" onClick={() => prefixRef.current.focus()}>{t("prefix(optional)")}</label>
                </InputWrapper>
              </Col>

              <Col xs={24} sm={12}>
                <InputWrapper margin="10px">
                  <AutoComplete
                    options={organizations.map((item) => ({
                      value: item.title,
                    }))}

                    className="custom-select"
                    style={{ width: '100%' }}
                    filterOption={(inputValue, option) => option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1}
                    onSelect={(value) => {
                      setAccount({ ...account, organization: value });
                    }}
                  >
                    <InputWrapper margin="0">
                      <Input
                        type="text"
                        name="organization"
                        ref={organizationRef}
                        className={`dynamic-input ${organization ? 'has-value' : ''}`}
                        value={organization || ''}
                        onChange={handleInput}
                      />
                      <label
                        htmlFor={organizationRef.current}
                        onClick={() => organizationRef.current.focus()}
                      >
                        {t("Organization name")}
                      </label>
                    </InputWrapper>
                  </AutoComplete>
                </InputWrapper>
              </Col>
              <Col xs={24} sm={12}>
                <InputWrapper style={{ margin: '10px' }}>
                  <Input
                    type="text"
                    name="job_position"
                    value={jobPosition}
                    ref={jobPositionRef}
                    className={`dynamic-input ${jobPosition ? 'has-value' : ''
                      }`}
                    onChange={handleInput}
                  />
                  <label
                    htmlFor=""
                    onClick={() => jobPositionRef.current.focus()}
                  >
                    {t("Your position")}
                  </label>
                </InputWrapper>
              </Col>
              <Col xs={24} sm={12}>
                <InputWrapper style={{ margin: '10px' }}>
                  <Input
                    type="tel"
                    name="phone"
                    value={phone}
                    ref={phoneRef}
                    className={`dynamic-input ${phone ? 'has-value' : ''}`}
                    onChange={handleInput}
                  />
                  <label htmlFor="" onClick={() => phoneRef.current.focus()}>
                    {t("Phone number")}
                  </label>
                </InputWrapper>
              </Col>
              <Col xs={24} sm={12}>
                <InputWrapper style={{ margin: '10px' }}>
                  <Input
                    required
                    type="email"
                    name="email"
                    value={email}
                    ref={emailRef}
                    autoComplete="new-email"
                    className={`dynamic-input ${email ? 'has-value' : ''}`}
                    onChange={handleInput}
                  />
                  <label htmlFor="" onClick={() => emailRef.current.focus()}>{t("Email address")}</label>
                </InputWrapper>
              </Col>

              <Col xs={24} style={{ marginTop: 15, marginBottom: 5, paddingLeft: 8 }}>
                <TitleH3>{t('Role')}</TitleH3>
              </Col>
              <Col span={24}>
                <InputWrapper className="has-messages" margin="10px">
                  <Select
                    multiple={false}
                    value={account.role}
                    onChange={(val) => setAccount({ ...account, role: val })}
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
              {
                account.role === 'participant' &&
                (
                  <>
                    <Col span={24} lg={12}>
                      <Col xs={24} style={{ marginTop: 15, marginBottom: 5, paddingLeft: 8 }}>
                        <TitleH3>{t('Leader groups')}</TitleH3>
                      </Col>
                      <InputWrapper style={{ margin: 10 }} className="has-messages working-group">
                        <Select
                          mode="multiple"
                          showSearch
                          required
                          size="large"
                          placeholder={t("Select a Working Group")}
                          onChange={(val) => setAccount({ ...account, leader_groups: val })}
                          value={leader_groups}
                          ref={leader_groupsRef}
                          style={{ width: '100%' }}
                          className={`custom-select members ${account.leader_groups.length > 0 ? 'has-value' : ''}`}
                          optionFilterProp="children"
                          allowClear
                          getPopupContainer={(node) => node.parentNode}
                          dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
                        >
                          {Object.keys(allGroups).filter(acc => !member_groups.includes(acc)).map((key) => (
                            <Select.Option
                              key={key}
                              className="select-item"
                              value={key}
                            >
                              {allGroups[key].title}
                            </Select.Option>
                          ))}
                        </Select>
                        <label htmlFor="" className="custom-select-label">{t("Working group")}</label>
                        <span className="input-msg" />
                      </InputWrapper>
                    </Col>

                    <Col span={24} lg={12}>
                      <Col xs={24} style={{ marginTop: 15, marginBottom: 5, paddingLeft: 8 }}>
                        <TitleH3>{t('Member groups')}</TitleH3>
                      </Col>
                      <InputWrapper style={{ margin: 10 }} className="has-messages working-group">
                        <Select
                          mode="multiple"
                          showSearch
                          required
                          size="large"
                          placeholder={t("Select a Working Group")}
                          onChange={(val) => setAccount({ ...account, member_groups: val })}
                          value={member_groups}
                          ref={member_groupsRef}
                          style={{ width: '100%' }}
                          className={`custom-select members ${account.member_groups?.length > 0 ? 'has-value' : ''}`}
                          optionFilterProp="children"
                          allowClear
                          getPopupContainer={(node) => node.parentNode}
                          dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
                        >
                          {Object.keys(allGroups).filter(acc => !leader_groups.includes(acc)).map((key) => (
                            <Select.Option
                              key={key}
                              className="select-item"
                              value={key}
                            >
                              {allGroups[key].title}
                            </Select.Option>
                          ))}
                        </Select>
                        <label htmlFor="" className="custom-select-label">{t("Working group")}</label>
                        <span className="input-msg" />
                      </InputWrapper>
                    </Col>

                  </>
                )
              }

              <Col xs={24} style={{ marginTop: 15, marginBottom: 5, paddingLeft: 8 }}>
                <TitleH3>{t("New Password")}</TitleH3>
              </Col>

              <Col xs={24} sm={12}>
                <InputWrapper className="has-input-icon" style={{ margin: '10px' }}>
                  <Input
                    type="password"
                    name="password"
                    value={password}
                    ref={passwordRef}
                    autoComplete="new-password"
                    className={`dynamic-input ${password ? 'has-value' : ''}`}
                    onChange={handleInput}
                  />
                  <label htmlFor="" onClick={() => passwordRef.current.focus()}>Password</label>
                  {
                    password && password.length < 8
                    && (
                      <>
                        <img src={iconError} alt="tick" className="input-icon error" />
                        <span className="input-msg">At least 8 characters</span>
                      </>
                    )
                  }
                </InputWrapper>
              </Col>
              <Col xs={24} sm={12}>
                <InputWrapper className="has-input-icon" style={{ margin: '10px' }}>
                  <Input
                    type="password"
                    name="confirm_password"
                    value={confirmPassword}
                    ref={confirmPasswordRef}
                    autoComplete="new-password"
                    className={`dynamic-input ${confirmPassword ? 'has-value' : ''}`}
                    onChange={handleInput}
                  />
                  <label htmlFor="" onClick={() => confirmPasswordRef.current.focus()}>Confirm Password</label>
                  {
                    confirmPassword && password && confirmPassword !== password
                    && (
                      <>
                        <img src={iconError} alt="tick" className="input-icon error" />
                        <span className="input-msg">Password does not match</span>
                      </>
                    )
                  }
                </InputWrapper>
              </Col>

              {' '}
              <Col span={24}>
                <Flex margin="10px">
                  <ButtonSecondary
                    className="transparent"
                    width="calc(50%)"
                    margin="10px 10px 10px 0"
                    type="button"
                    onClick={() => props.history.push('/dashboard/members')}
                  >
                    {t("Back")}
                  </ButtonSecondary>
                  <ButtonPrimary width="calc(50%)" margin="10px 0px 10px 10px">{t("Save")}</ButtonPrimary>
                </Flex>
                {/* <div style={{ margin: 10 }}>
                      <ButtonPrimary>Submit</ButtonPrimary>
                    </div> */}
              </Col>
            </Row>
          </form>
        </Col>
      </Row>

    </div>
  );
}
const styles = {
  backgroundImage: {
    background: colors.primary,
    backgroundSize: 'cover',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
  },
  textWrapper: {
    width: '100%',
    maxWidth: 420,
    padding: '80px 20px',
    color: '#fff',
    margin: 'auto',
    zIndex: 2,
  },
  title: {
    fontSize: 43,
    lineHeight: 1.1,
    color: '#fff',
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: '500',
    marginTop: 21,
    textAlign: 'left',
  },
  cubic: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  ellipse: {
    position: 'absolute',
    right: 0,
    bottom: '10%',
  },
  ellipse2: {
    position: 'absolute',
    left: 0,
    transform: 'translateX(-50%)',
  },
  rectangle: {
    position: 'absolute',
    top: -7,
    left: '10%',
  },
  rectangle2: {
    position: 'absolute',
    bottom: -40,
    left: 0,
  },

};

export default EditMember;
