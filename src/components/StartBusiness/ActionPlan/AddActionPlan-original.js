import React, { Component, createRef, Suspense } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
  Row, Col, Select, Alert, DatePicker,
} from 'antd';
import Swal from 'sweetalert2';
import moment from 'moment-timezone';
import Axios from '../../../utils/axios';
import { CREATE_ACTION } from '../../../graphql/actions';
import { CREATE_ORGANIZATION, FETCH_ORGANIZATIONS } from '../../../graphql/organizations';
import {
  Button, ButtonPrimary, Flex, InputWrapper, Input,
} from '../../../styles';
import { ReactComponent as IconCheck } from '../../../assets/list-icon.svg';
import { fetchActionPlans } from '../../../store/Actions/actions';
import iconAddMember from '../../../assets/startBusiness/add-user.svg';
import { dissoc, ErrorAlerts, indexBy, InputErrors, notEmptyErrorConfig, parseErrors } from "../../../utils";
import DummyMemberModal from "./DummyMemberModal";
import {withLocale} from "../../../utils/locale";

export const errorsConfig = {
  name: {
    ...notEmptyErrorConfig,
    "should be unique": {
      alert: "Action with this name already exist",
      msg: "should be unique"
    }
  },
  start_at: {
    "should not be after any sub action start_at": {
      alert: "Action should not conflict with subaction deadlines",
      msg: "should not be after subaction start"
    },
    "should be valid": {
      msg: "invalid",
      alert: false
    },
    "should not be before parent-action start_at": {
      alert: "Action should not exceed parent action deadlines",
      msg: "should be after parent start"
    },
    "should not be after end_at": {
      alert: "Action cannot end before start",
      msg: "should be before end"
    }
  },
  end_at: {
    "should be valid": {
      msg: "invalid",
      alert: false
    },
    "should not be after parent-action end_at": {
      alert: "Action should not exceed parent action deadlines",
      msg: "should be before parent end"
    },
    "should not be before any sub action end_at": {
      alert: "Action should not conflict with subaction deadlines",
      msg: "should not be before subaction end"
    },
    "should not be before start_at": {
      alert: "Action cannot end before start",
      msg: "should be after start"
    }
  },
  action_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false
    }
  },
  sub_action_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false
    }
  },
  description: {},
  number: {},
  group_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false
    }
  },
  responsive_account_ids: {
    "should be active": {
      msg: "Responsive account should be invited or activated",
      alert: "should be invited or activated"
    },
    "should be related to responsive account": {
      msg: "is not related to this group",
      alert: "Responsible account is not allowed to be responsible in this working group"
    }
  },
  responsive_organization_ids: {
    "should be active": {
      msg: "Responsive account should be invited or activated",
      alert: "should be invited or activated"
    },
    "should be related to responsive account": {
      msg: "is not related to this group",
      alert: "Responsible account is not allowed to be responsible in this working group"
    }
  }
};

export const initialState = {
  end_at: '',
  name: '',
  number: 0,
  responsive_account_ids: [],
  responsive_organization_ids: [],
  allAccounts: [],
  allOrganizations: [],
  start_at: '',
  entitiesByValue: {},
  errors: {},
  alerts: [],
  accountSearch: '',
  organizationSearch: '',
  showDummyModal: false,
  isStartAtFocused: false,
  isEndAtFocused: false,
};

export const getAllOrganizations = async () => {
  const res = await Axios.post('/graphql', {
    query: FETCH_ORGANIZATIONS,
  });
  if (res?.data) {
    const allOrganizations = res.data.data.organizations?.nodes;
    return indexBy(allOrganizations, 'id')
  }
}

export const getAllGroupAccounts = (selectedWorkingGroup) => {
  const allAccounts = [...selectedWorkingGroup.members, ...selectedWorkingGroup.leaders]
    .filter(account => account.status === 'active');
  return indexBy(allAccounts, 'id');
}

export const createOrganization = async ({title, t}) => {
  const result = await Swal.fire({
    text: t('Create new organization with title "%s" ?', title),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('Ok'),
    cancelButtonText: t('Cancel')
  });
  if (result.value) {
    try {
      await Axios.post('/graphql', {
        query: CREATE_ORGANIZATION,
        variables: {
          organization: {
            title,
          }
        }
      })
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

}

export class ActionPlanBase extends Component {
  state = { ...initialState, end_at_isGreater: false }
  membersRef = createRef();
  parentRef = createRef();

  componentDidMount() {
    getAllOrganizations().then((allOrganizations => {
      this.setState({
        allOrganizations,
        allAccounts: getAllGroupAccounts(this.props.selectedWorkingGroup),
      })
    }));
  }

  refreshEntities = () => {
    const { responsive_accounts, responsive_organizations } = this.props.selectedAction
    const allAccounts = getAllGroupAccounts(this.props.selectedWorkingGroup);
    getAllOrganizations().then((allOrganizations => {
      const externalOrganizations = indexBy(responsive_organizations.filter(({ id }) => !allOrganizations[id]),
        'id')
      const externalAccounts = indexBy(responsive_accounts
        .filter(({ id }) => !allAccounts[id]), 'id');
      this.setState({
        allOrganizations: {
          ...externalOrganizations,
          ...allOrganizations,
        },
        allAccounts: {
          ...externalAccounts,
          ...allAccounts,
        },
      })
    }));
  }

  createAndSelectOrganization = (title) => {
    const {t} = this.props;
    createOrganization({title, t}).then((success) => {
      if (success) {
        getAllOrganizations().then((allOrganizations => {
          this.setState(state => ({
            allOrganizations,
            allAccounts: getAllGroupAccounts(this.props.selectedWorkingGroup),
            responsive_organization_ids: [
              Object.values(allOrganizations).find(org => org.title === title).id,
              ...state.responsive_organization_ids
            ]
          }))
        }))
      }
    })
  }


  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errors: dissoc(this.state.errors, name) });
  }

  render() {
    throw "Function not implemented"
    return null;
  }
}

class ActionPlanForm extends ActionPlanBase {
  state = initialState

  submitAction = async (e) => {
    e.preventDefault();
    const {t} = this.props;
    this.setState({ alerts: [], errors: {} })
    const {
      end_at,
      name,
      number,
      start_at,
      responsive_account_ids,
      responsive_organization_ids,
    } = this.state;

    const action = {
      start_at: moment(start_at).startOf('day').toISOString(),
      end_at: moment(end_at).endOf('day').toISOString(),
      group_id: this.props.selectedWorkingGroup.id,
      name,
      number,
      responsive_account_ids,
      responsive_organization_ids,
    };

    if (start_at && end_at && name) {
      try {
        const res = await Axios.post('/graphql', {
          query: CREATE_ACTION,
          variables: {
            action,
          },
        });

        if (res?.data.data) {
          Swal.fire({
            title: t('Created'),
            text: t('Success! You have created an action'),
            icon: 'success',
          }).then(() => {
            this.setState(initialState);
            this.props.fetchCurrentWorkingGroup()
            this.props.modalHandler();
          });
        }
      } catch (err) {
        if (err.message.includes('422')) {
          const { alerts, errors } = parseErrors(errorsConfig, err.response.data.errors[0].extensions?.validation?.action);
          this.setState({ alerts, errors })
        }
      }
    } else {
      let errors = {};
      ['start_at', 'end_at', 'name'].forEach(item => {
        if (!this.state[item]) {
          errors = { ...errors, [item]: [t('Required field')] }
        }
      });

      this.setState({
        alerts: [t('Fill all required fields')],
        errors,
      });
    }
  }

  render() {
    const {t} = this.props;
    const {
      name,
      start_at,
      end_at,
      responsive_account_ids,
      responsive_organization_ids,
      allAccounts,
      allOrganizations,
      alerts,
      errors,
      showDummyModal,
      accountSearch,
      organizationSearch,
      isStartAtFocused,
      isEndAtFocused,
    } = this.state;
    const { selectedWorkingGroup, fetchCurrentWorkingGroup } = this.props;

    return (
      <div onKeyPress={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.submitAction(e)
        }
        // e.stopPropagation();
      }}>
        {
          showDummyModal
          && (
            <DummyMemberModal
              visible={showDummyModal}
              group_id={selectedWorkingGroup.id}
              input={accountSearch}
              parentRef={this.parentRef.current}
              handleCancel={() => this.setState({ showDummyModal: false })}
              handleSuccess={(id) => {
                Swal.fire({
                  title: t('Success'),
                  text: t(`Dummy account has been created`),
                  icon: 'success',
                })
                fetchCurrentWorkingGroup().then(() => {
                  getAllOrganizations().then(allOrganizations => {
                    this.setState((state) => ({
                      allOrganizations,
                      allAccounts: getAllGroupAccounts(this.props.selectedWorkingGroup),
                      responsive_account_ids: [id, ...state.responsive_account_ids]
                    }))
                  })
                });
                this.setState({ showDummyModal: false });
              }}
            />
          )
        }
        <form id="header" onSubmit={this.submitAction} ref={this.parentRef}>
          <ErrorAlerts alerts={alerts} />
          <Row gutter={[22]}>
            <Col xs={24} lg={6} key='action-title'>
              <InputWrapper className='has-messages' align='flex-end'>
                <Input
                  id="action-title"
                  type="text"
                  name="name"
                  value={name}
                  tabIndex="1"
                  autoFocus
                  autoComplete="off"
                  ref={(el) => this.nameRef = el}
                  className={`dynamic-input grey ${name ? 'has-value' : ''}`}
                  onChange={this.handleInput}
                  hasErrors={errors.name}
                />
                <label htmlFor="" onClick={() => this.nameRef.focus()}>{t("Action name *")}</label>
                <InputErrors name={'name'} errors={errors} />
              </InputWrapper>
            </Col>
            <Col xs={24} lg={6} key='start_at'>
              <Row gutter={[22]}>
                <Col span={12}>
                  <InputWrapper className='has-messages' align='flex-end'>
                    <DatePicker
                      required
                      tabIndex="2"
                      type="date"
                      name="start_at"
                      value={start_at}
                      placeholder={t("Start Date *")}
                      ref={(el) => this.start_atRef = el}
                      open={isStartAtFocused}
                      onFocus={() => this.setState({ isStartAtFocused: true })}
                      onBlur={() => this.setState({ isStartAtFocused: false })}
                      disabledDate={(current) => current < moment().startOf('day')}
                      onChange={(val) => this.setState({ start_at: val.startOf('day'), isStartAtFocused: false })}
                      className={`custom-datepicker large grey ${errors.start_at && 'input-error'} ${start_at ? 'has-value' : ''}`}
                    />
                    <InputErrors name={'start_at'} errors={errors} />
                  </InputWrapper>
                </Col>
                <Col span={12} key='end_at'>
                  <InputWrapper className='has-messages' align='flex-end'>
                    <DatePicker
                      required
                      tabIndex="3"
                      type="date"
                      name="end_at"
                      placeholder={t("End Date *")}
                      value={end_at}
                      ref={(el) => this.end_atRef = el}
                      open={isEndAtFocused}
                      onFocus={() => this.setState({ isEndAtFocused: true })}
                      onBlur={() => this.setState({ isEndAtFocused: false })}
                      onChange={(val) => this.setState({ end_at: val.endOf('day'), isEndAtFocused: false })}
                      disabledDate={(current) => current < moment(start_at).add(1, 'day')}
                      className={`custom-datepicker large grey ${errors.end_at && 'input-error'} ${end_at ? 'has-value' : ''}`}
                    />
                    <InputErrors name={'end_at'} errors={errors} />
                  </InputWrapper>
                </Col>
              </Row>
            </Col>
            <Col xs={24} lg={6} key='responsive_organizations'>
              <InputWrapper className='has-messages' align='flex-end'>
                <Select
                  mode="multiple"
                  required
                  size="large"
                  tabIndex="4"
                  allowClear
                  showSearch
                  ref={this.membersRef}
                  optionFilterProp="children"
                  showAction={['click', 'focus']}
                  placeholder={t("Assign organization")}
                  value={responsive_organization_ids}
                  style={{ width: '100%', backgroundColor: '#fafbfc' }}
                  onChange={arr => this.setState({ responsive_organization_ids: arr })}
                  onSearch={(organizationSearch) => this.setState({ organizationSearch: organizationSearch.trim() })}
                  className={`${responsive_organization_ids?.length > 0 ? 'has-value' : ''} ${errors.responsive_organization_ids && 'input-error'}`}
                  getPopupContainer={(node) => node.parentNode}
                  onFocus={() => this.membersRef.current.focus()}
                  menuItemSelectedIcon={<IconCheck className="check-icon" />}
                  dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
                  onInputKeyDown={e => {
                    if (e.key === 'Enter' && organizationSearch) {
                      this.createAndSelectOrganization(organizationSearch);
                    }
                  }}
                  notFoundContent={!!organizationSearch && (
                    <div className="new-member" onClick={() => this.createAndSelectOrganization(organizationSearch)}>
                      <span className="new-member-icon">
                        <img src={iconAddMember} alt="new organization" />
                        {t("Add")}
                      </span>
                      {organizationSearch}
                    </div>
                  )}
                >
                  {
                    Object.values(allOrganizations).map((org) => {
                      return (
                        <Select.Option
                          key={org.id}
                          className="select-item"
                          value={org.id}
                        >
                          {org.title?.toUpperCase()}
                        </Select.Option>
                      );
                    })
                  }
                </Select>
                <label htmlFor="" className="custom-select-label">{t("Assigned to")}</label>
                <InputErrors name={'responsive_organization_ids'} errors={errors} />
              </InputWrapper>
            </Col>
            <Col xs={24} lg={6} key='responsive_accounts'>
              <InputWrapper className='has-messages' align='flex-end'>
                <Select
                  mode="multiple"
                  required
                  size="large"
                  tabIndex="5"
                  placeholder={t("Responsible Entity *")}
                  value={responsive_account_ids}
                  onSearch={(accountSearch) => this.setState({ accountSearch })}
                  style={{ width: '100%', backgroundColor: '#fafbfc' }}
                  optionFilterProp="children"
                  allowClear
                  showSearch
                  onChange={arr => this.setState({ responsive_account_ids: arr })}
                  className={`${responsive_account_ids?.length > 0 ? 'has-value' : ''} ${errors.responsive_account_ids && 'input-error'}`}
                  getPopupContainer={(node) => node.parentNode}
                  menuItemSelectedIcon={<IconCheck className="check-icon" />}
                  dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
                  showAction={['click', 'focus']}
                  onInputKeyDown={e => {
                    if (e.key === 'Enter') {
                      this.setState({ showDummyModal: true });
                    }
                  }}
                  notFoundContent={!!accountSearch && (
                    <div className="new-member" onClick={() => this.setState({ showDummyModal: true })}>
                      <span className="new-member-icon">
                        <img src={iconAddMember} alt="new memeber" />
                        {t("Add")}
                      </span>
                      {accountSearch}
                    </div>
                  )}
                >
                  {
                    Object.values(allAccounts).map((acc) => {
                      return (
                        <Select.Option
                          key={acc.id}
                          className="select-item"
                          value={acc.id}
                        >
                          {`${acc.first_name || ''} ${acc.last_name || ''}`}
                        </Select.Option>
                      );
                    })
                  }
                </Select>
                <label htmlFor="" className="custom-select-label">{t("Assigned accounts")}</label>
                <InputErrors name={'responsive_account_ids'} errors={errors} />
              </InputWrapper>
            </Col>
          </Row>

          <Flex className="btn-group">
            <Button className="transparent small cancel" type="reset"
              onClick={this.props.modalHandler}>{t("Cancel")}</Button>
            <ButtonPrimary tabIndex="6" className="small">{t("Create a new action")}</ButtonPrimary>
          </Flex>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedWorkingGroup: state.selectedWorkingGroup,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchActionPlans }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocale(ActionPlanForm)));
