import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
  Row, Col, Select, Modal, DatePicker, Tag,
} from 'antd';
import moment from 'moment-timezone';
import Axios from '../../../utils/axios';
import { CREATE_SUB_ACTION } from '../../../graphql/actions';
import { UPDATE_ACTION } from '../../../graphql/actions';
import {
  Button, ButtonPrimary, Flex, InputWrapper, Input, TitleH3,
} from '../../../styles';
import { ReactComponent as IconCheck } from '../../../assets/list-icon.svg';
import { fetchActionPlans } from '../../../store/Actions/actions';
import { ErrorAlerts, InputErrors, parseErrors } from "../../../utils";
import { ActionPlanBase, errorsConfig, initialState } from "./AddActionPlan";
import Swal from 'sweetalert2';
import { withLocale } from "../../../utils/locale";
import FileUpload from './FileUpload';

export class SubActionBase extends ActionPlanBase {
  dateHandler = (date, name) => {
    const { t } = this.props;
    const { parentAction } = this.props;
    const isGreater = moment(date).isAfter(parentAction.end_at);
    if (isGreater) {
      Swal.fire({
        icon: 'warning',
        title: t('Are you sure?'),
        className: 'date-confirm-alert',
        text: t('You are about to select the date greater than parent action which it will change the date of parent action too.'),
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: t('Yes'),
        cancelButtonText: t('Cancel')
      }).then((result) => {
        console.log(date);
        if (result.value) {
          this.setState({
            [name]: date,
            [name + '_isGreater']: true,
          });
        } else {
          this.setState({ [name]: moment(parentAction.end_at), [name + '_isGreater']: false });
        }
      })
    } else {
      this.setState({ [name]: date, [name + '_isGreater']: false });
    }
  }

  updateParentActionDate = async () => {
    const { parentAction } = this.props;
    const { end_at } = this.state;
    const request = {
      query: UPDATE_ACTION,
      variables: {
        action: {
          end_at: moment(end_at).isAfter(parentAction.end_at) ? moment(end_at).toISOString() : parentAction.end_at,
          start_at: parentAction.start_at,
        },
        action_id: parentAction.id,
      }
    }

    try {
      const res = await Axios.post('/graphql', request);
      if (res?.data.data) {
        return { success: true }
      }
    } catch (err) {
      console.log(err);
      return { success: false }
    }
  }

  render() {
    throw "Function not implemented"
    return null;
  }
}

class EditActionPlan extends SubActionBase {
  parentRef = createRef();

  submitAction = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { t } = this.props;

    this.setState({ alerts: [], errors: {} });
    const { selectedWorkingGroup, parentAction } = this.props;
    const {
      end_at,
      name,
      start_at,
      responsive_account_ids,
      end_at_isGreater,
      responsive_tags,
      allAccounts,
      attachments,
    } = this.state;
    const { id } = parentAction;

    const sortedTags = responsive_account_ids.reduce((acc, i) => {
      if (!allAccounts[i]) {
        acc.responsive_tags.push(i)
      } else {
        acc.responsive_account_ids.push(i);
      }
      return acc;
    }, { responsive_tags: [], responsive_account_ids: [] });

    const allResponsiveTags = [... new Set(sortedTags.responsive_tags.concat(responsive_tags))];

    const sub_action = {
      end_at: moment(end_at).endOf('day').toISOString(),
      start_at: moment(start_at).startOf('day').toISOString(),
      group_id: selectedWorkingGroup.id,
      name,
      number: parentAction.sub_actions.length,
      responsive_account_ids: sortedTags.responsive_account_ids.length ? sortedTags.responsive_account_ids : null,
      responsive_tags: allResponsiveTags.length ? allResponsiveTags : null
    };

    if (start_at && end_at && name) {
      const formData = new FormData();
      const request = {
        query: CREATE_SUB_ACTION,
        variables: {
          sub_action,
          attachments: attachments.length ? Array(attachments.length).fill(null) : null,
          action_id: id,
        },
      };
      // ------ Create map for FormData -------
      const map = {};
      Array(attachments.length).fill('').forEach((item, index) => {
        map[index] = [`variables.attachments.${index}`];
      });

      // ------ APPEND data to FormDate -------
      formData.append('operations', JSON.stringify(request));
      formData.append('map', JSON.stringify(map));

      Array(attachments.length).fill('').forEach((item, index) => {
        formData.append([index], attachments[index]);
      });

      try {
        if (end_at_isGreater) {
          await this.updateParentActionDate();
        }
        const res = await Axios.post('/graphql', formData);
        if (res?.data.data) {
          this.setState(initialState);
          this.props.fetchCurrentWorkingGroup()
          this.props.modalHandler();
        }
      } catch (err) {
        if (err.message.includes('422')) {
          const { alerts, errors } = parseErrors(errorsConfig, err.response.data.errors[0].extensions?.validation?.sub_action);
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
    const { t } = this.props;
    const {
      name,
      start_at,
      end_at,
      responsive_account_ids,
      responsive_tags,
      allAccounts,
      alerts,
      errors,
      showDummyModal,
      tagSearch,
      isStartAtFocused,
      isEndAtFocused,
      allTags,
    } = this.state;
    const { parentAction } = this.props;
    const min_date = moment(parentAction.start_at);
    const max_date = moment(parentAction.end_at);

    function tagRender(props) {
      const { label, value, closable, onClose } = props;

      return (
        <Tag
          closable={closable}
          onClose={onClose}
          style={{ marginRight: 3, fontSize: 16, padding: 5 }}
          color={responsive_tags.includes(value) ? "blue" : "default"}
        >
          {label}
        </Tag>
      );
    }

    return (
      <>
        <Modal
          title={null}
          visible={this.props.visible && !showDummyModal}
          onOk={this.props.modalHandler}
          onCancel={this.props.modalHandler}
          footer={null}
          zIndex={1080}
        >

          <TitleH3>{t("Add subaction")}</TitleH3>
          <form id="header" onSubmit={this.submitAction}>
            <ErrorAlerts alerts={alerts} />
            <Row gutter={[22]}>
              <Col xs={24}>
                <InputWrapper className='has-messages' align='flex-end'>
                  <Input
                    type="text"
                    name="name"
                    value={name}
                    tabIndex="1"
                    autoFocus
                    autoComplete="off"
                    id="new-subaction-title"
                    ref={(el) => this.nameRef = el}
                    className={`dynamic-input grey ${name ? 'has-value' : ''}`}
                    onChange={this.handleInput}
                    hasErrors={errors.name}
                  />
                  <label htmlFor="" onClick={() => this.nameRef.focus()}>{t("Subaction name *")}</label>
                  <InputErrors name={'name'} errors={errors} />
                </InputWrapper>
              </Col>
              <Col xs={24}>
                <Row gutter={[22]}>
                  <Col span={12}>
                    <label htmlFor="" onClick={() => this.start_atRef.click()}>{t("Start Date *")}</label>
                    <InputWrapper className='has-messages' align='flex-end'>
                      <DatePicker
                        required
                        type="date"
                        name="start_at"
                        tabIndex="2"
                        getPopupContainer={(el) => el.parentNode}
                        value={start_at ? start_at : null}
                        placeholder={t("Start Date *")}
                        ref={(el) => this.start_atRef = el}
                        open={isStartAtFocused}
                        onFocus={() => this.setState({ isStartAtFocused: true })}
                        onBlur={() => this.setState({ isStartAtFocused: false })}
                        onSelect={() => this.setState({ isStartAtFocused: false })}
                        disabledDate={(current) => current < min_date || current > max_date}
                        className={`custom-datepicker large grey ${errors.start_at && 'input-error'} ${start_at ? 'has-value' : ''}`}
                        onChange={(val) => this.dateHandler(val ? val.startOf('day') : null, 'start_at')}
                      />
                      <InputErrors name={'start_at'} errors={errors} />
                    </InputWrapper>
                  </Col>
                  <Col span={12}>
                    <label htmlFor="" onClick={() => this.end_atRef.click()}>{t("End Date *")}</label>
                    <InputWrapper className='has-messages' align='flex-end'>
                      <DatePicker
                        required
                        type="date"
                        name="end_at"
                        tabIndex="3"
                        getPopupContainer={(el) => el.parentNode}
                        value={end_at ? end_at : null}
                        placeholder={t("End Date *")}
                        disabledDate={(current) => current < moment(start_at).add(1, 'day') || current < min_date}
                        ref={(el) => this.end_atRef = el}
                        open={isEndAtFocused}
                        onFocus={() => this.setState({ isEndAtFocused: true })}
                        onBlur={() => this.setState({ isEndAtFocused: false })}
                        onSelect={() => this.setState({ isEndAtFocused: false })}
                        dateRender={(currentDate, today) => {
                          if (max_date.format('YYYY-MM-DD') === currentDate.format('YYYY-MM-DD')) {
                            return <td title={currentDate.format('YYYY-MM-DD')} className="ant-picker-cell ant-picker-cell-in-view"><div className="ant-picker-cell-inner max-date">{currentDate.format('D')}</div></td>
                          }
                          return <td title={currentDate.format('YYYY-MM-DD')} className="ant-picker-cell ant-picker-cell-in-view"><div className="ant-picker-cell-inner">{currentDate.format('D')}</div></td>
                        }}
                        className={`custom-datepicker large grey ${errors.end_at && 'input-error'} ${end_at ? 'has-value' : ''}`}
                        onChange={(val) => this.dateHandler(val ? val.endOf('day') : null, 'end_at')}
                      />
                      <InputErrors name={'end_at'} errors={errors} />
                    </InputWrapper>
                  </Col>
                </Row>
              </Col>
              <Col span={24} key='responsive_accounts'>
                <InputWrapper className='has-messages' align='flex-end'>
                  <Select
                    mode="multiple"
                    required
                    size="large"
                    tabIndex="5"
                    placeholder={t("Responsible Entity *")}
                    value={[... new Set(responsive_account_ids.concat(responsive_tags))]}
                    onSearch={(tagSearch) => this.setState({ tagSearch })}
                    style={{ width: '100%', backgroundColor: '#fafbfc' }}
                    optionFilterProp="children"
                    allowClear
                    showSearch
                    onChange={arr => this.setState({ responsive_account_ids: arr })}
                    className={`${responsive_account_ids?.length > 0 ? 'has-value' : ''} ${errors.responsive_account_ids && 'input-error'}`}
                    getPopupContainer={(node) => node.parentNode}
                    menuItemSelectedIcon={<IconCheck className="check-icon" />}
                    dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
                    // showAction={['click', 'focus']}
                    notFoundContent={null}
                    defaultActiveFirstOption={false}
                    tagRender={tagRender}
                    ref={el => this.entityRef = el}
                    onDeselect={tag => this.handleRemoveTag(tag)}
                    onInputKeyDown={e => {
                      if (e.key === 'Enter' && tagSearch.trim().length) {
                        this.setState(prevState => ({
                          responsive_tags: [... new Set([...prevState.responsive_tags, tagSearch])],
                          tagSearch: '',
                        }));
                        // This is for removing typed value from input
                        this.entityRef.blur();
                        this.entityRef.focus();
                      }
                    }}
                  >
                    {
                      Object.values({ ...allAccounts, ...allTags }).map((acc) => {
                        return (
                          <Select.Option
                            key={acc.id}
                            className="select-item"
                            value={acc.id}
                          >
                            {acc.isTag ? '#' : ''}
                            {`${acc.first_name || ''} ${acc.last_name || ''}`}
                          </Select.Option>
                        );
                      })
                    }
                  </Select>
                  <InputErrors name={'responsive_account_ids'} errors={errors} />
                </InputWrapper>
              </Col>
              <Col span={24}>
                <FileUpload attachments={[]} setAttachments={attachments => this.setState({ attachments })} />
              </Col>
            </Row>
            <Flex className="btn-group" margin="30px 0 20px">
              <Button className="transparent cancel" type="reset"
                onClick={this.props.modalHandler}>{t("Cancel")}</Button>
              <ButtonPrimary className="" tabIndex="6" margin="0px 0 0 10px" type="submit">{t("Create a subaction")}</ButtonPrimary>
            </Flex>
          </form>

        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedWorkingGroup: state.selectedWorkingGroup,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchActionPlans }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocale(EditActionPlan)));
