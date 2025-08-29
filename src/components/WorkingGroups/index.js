import React, { Component, Suspense, lazy } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, Menu, message } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Axios from '../../utils/axios';
import { StyledWorkingGroup } from '../../styles/workingGroup';
import { UPDATE_WORKING_GROUP, DELETE_WORKING_GROUP } from '../../graphql/workingGroups';
import { TitleH1, Flex, ButtonPrimary } from '../../styles';
// ----------------- ASSETS & STYLE -----------------
import { ReactComponent as IconEdit } from '../../assets/reform/edit.svg';
import { ReactComponent as IconDelete } from '../../assets/indicator/delete.svg';
import { fetchWorkingGroupsAction } from '../../store/WorkingGroups/actions';
import { ReactComponent as IconWGadd } from '../../assets/indicator/add.svg';
import DraggableList from './WorkingGroupList';
import NewWorkingGroup from './NewWorkingGroup';

import { columns } from './table';
import {withLocale} from "../../utils/locale";

const EditWorkingGroup = lazy(() => import('./EditWorkingGroup'));


class WorkingGroupList extends Component {
  state = {
    groups: [],
    loading: true,
    selectedItem: {},
    edit: false,
    newGroup: false,
  }

  async componentDidMount() {
    this.props.fetchWorkingGroupsAction();
  }

  modalHandler = () => {
    this.setState((prevState) => ({ edit: !prevState.edit }));
  }

  handleNewGroupModal = () => {
    this.setState((prevState) => ({ newGroup: !prevState.newGroup }));
  }

  updateWorkingGroupStatus = async (id, sidebar_visible) => {
    const request = {
      query: UPDATE_WORKING_GROUP,
      variables: {
        group: {
          sidebar_visible,
        },
        id,
      },
    };
    try {
      await Axios.post('/graphql', request);
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
    } finally {
      this.props.fetchWorkingGroupsAction();
    }
  }

  updateWorkingGroupTitle = async (id, title) => {
    const {t} = this.props;
    const query = {
      query: UPDATE_WORKING_GROUP,
      variables: {
        group: {
          title,
        },
        id
      },
    };

    try {
      const res = await Axios.post('/graphql', query);
      console.log(res);
      if (res?.data) {
        if (res?.data) {
          return message.success({
            content: t('Title has been updated successfully'),
            duration: 10,
            style: {
              right: 30,
              bottom: 30,
              position: 'fixed',
              fontSize: 16,
            },
          })
        }
      }

    } catch (err) {
      // TODO parse errors
      const { extensions = '' } = err.response?.data?.errors[0];
      if (extensions.validation) {
        const title = extensions.validation.group.title.includes('should not conflict') ? t('Group with this title is already exist') : extensions.validation.group.title
        console.log(title);
        message.error({
          content: title,
          duration: 10,
          style: {
            right: 30,
            bottom: 30,
            position: 'fixed',
            fontSize: 16,
          },
        })
      } else {
        message.error('Something went wrong');
      }
    }
  }

  deleteWorkingGroup = async (id) => {
    const {t} = this.props;
    Swal.fire({
      text: t('This will disable the working group'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Yes, delete it'),
      cancelButtonText: t('Cancel')
    }).then(async (result) => {
      if (result.value) {
        try {
          this.setState({ loading: true });
          await Axios.post('/graphql',
            {
              query: DELETE_WORKING_GROUP,
              variables: { id },
            });
        } catch (err) {
          console.error('[Custom Catch Error]-->', err);
        } finally {
          this.props.fetchWorkingGroupsAction();
        }
      }
    });
  }

  render() {
    const { selectedItem, edit, newGroup } = this.state;
    const { role } = this.props.user;
    const {t} = this.props;
    const moreActionsBtn = {
      title: '',
      dataIndex: '',
      key: 'id',
      width: 5,
      className: 'drag-visible',
      render: (val, props) => {
        return ['superuser', 'coordinator'].includes(role) ?
          (
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown.Button
                className="users more-action-btn"
                trigger={['click']}
                getPopupContainer={(el) => el.parentNode}
                overlay={(
                  <>
                    <Menu className="more-action-btn-table">
                      <Menu.Item
                        key="1"
                        onClick={() => this.setState({ edit: true, selectedItem: props })}
                        icon={<IconEdit className="has-icon" />}
                      >
                        {t("Edit")}
                      </Menu.Item>
                      {
                        props.removable
                        && (
                          <Menu.Item key="4" icon={<IconDelete className="has-icon" />} onClick={() => this.deleteWorkingGroup(props.id)}>
                            {t("Delete")}
                          </Menu.Item>
                        )
                      }
                    </Menu>
                  </>
                )}
                icon={<MoreOutlined />}
              />
            </div>
          )
          :
          null
      },
    };

    return (
      <StyledWorkingGroup>
        <Flex jc="space-between">
          <TitleH1 margin="20px 0">{t("All working groups")}</TitleH1>
          {
            ['superuser', 'coordinator'].includes(role) &&
            <ButtonPrimary
              className="small ml-auto"
              onClick={this.handleNewGroupModal}
            >
              <IconWGadd />
              {t("Create Working Group")}
            </ButtonPrimary>
          }

        </Flex>
        <DraggableList
          data={this.props.workingGroups.map((item, index) => ({ ...item, index }))}
          columns={[...columns({
            updateWorkingGroupStatus: this.updateWorkingGroupStatus,
            updateWorkingGroupTitle: this.updateWorkingGroupTitle,
            t
          }), moreActionsBtn]}
        />
        {
          edit
          && (
            <Suspense fallback={t("Loading...")}>
              <EditWorkingGroup
                visible={edit}
                modalHandler={this.modalHandler}
                selectedItem={selectedItem}
              />
            </Suspense>
          )
        }
        {
          newGroup
          && (
            <Suspense fallback={t("Loading...")}>
              <NewWorkingGroup
                visible={newGroup}
                modalHandler={this.handleNewGroupModal}
              />
            </Suspense>
          )
        }
      </StyledWorkingGroup>
    );
  }
}

const mapStateToProps = (state) => ({
  workingGroups: state.workingGroups.data,
  user: state.auth.account,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchWorkingGroupsAction }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocale(WorkingGroupList)));
