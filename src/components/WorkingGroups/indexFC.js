import React, {
  Component, Suspense, lazy, useState, useEffect, useCallback
} from 'react';
import { withRouter } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Dropdown, Menu, message } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Axios from '../../utils/axios';
import { StyledWorkingGroup } from '../../styles/workingGroup';
import {UPDATE_WORKING_GROUP, DELETE_WORKING_GROUP} from '../../graphql/workingGroups';
import {TitleH3} from '../../styles';
// ----------------- ASSETS & STYLE -----------------
import {ReactComponent as IconEdit} from '../../assets/reform/edit.svg';
import {ReactComponent as IconEnable} from '../../assets/indicator/enable.svg';
import {ReactComponent as IconDelete} from '../../assets/indicator/delete.svg';
import {ReactComponent as IconDisable} from '../../assets/indicator/disable.svg';
import {fetchWorkingGroupsAction} from '../../store/WorkingGroups/actions';
import DraggableList from './WorkingGroupList';

import {columns} from './table';
import {useLocale} from "../../utils/locale";

const EditWorkingGroup = lazy(() => import('./EditWorkingGroup'));

function WorkingGroupList(props) {
  const dispatch = useDispatch();
  const [t] = useLocale()
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    async function fetchWorkingGroups() {
      const groups = await dispatch(fetchWorkingGroupsAction());
      setGroups(groups.payload);
    }
    fetchWorkingGroups()
  }, [setGroups]);


  const modalHandler = useCallback(() => {
    setEdit(edit => !edit);
  }, [setEdit]);

  const updateWorkingGroupStatus = async (id, visible) => {
    const request = {
      query: UPDATE_WORKING_GROUP,
      variables: {
        group: {
          visible,
        },
        id,
      },
    };
    try {
      await Axios.post('/graphql', request);
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
    } finally {
      dispatch(fetchWorkingGroupsAction());
    }
  }


  const deleteWorkingGroup = async (id) => {
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
          setLoading(true);
          await Axios.post('/graphql',
            {
              query: DELETE_WORKING_GROUP,
              variables: { id },

            });
        } catch (err) {
          console.error('[Custom Catch Error]-->', err);
        } finally {
          dispatch(fetchWorkingGroupsAction());
          setLoading(false);
        }
      }
    });
  }

  const moreActionsBtn = {
    title: '',
    dataIndex: '',
    key: 'id',
    width: 5,
    className: 'drag-visible',
    render: (val, props) => {
      return (
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
                    onClick={() => {
                      setEdit(true);
                      setSelectedItem(props);
                    }}
                    icon={<IconEdit className="has-icon" />}
                  >
                    {t("Edit")}
                  </Menu.Item>
                  {/* <Menu.Item
                    key="3"
                    icon={props.visible ? <IconDisable className="has-icon" /> : <IconEnable className="has-icon" />}
                    onClick={() => this.updateWorkingGroupStatus(props.id, !props.visible)}
                  >
                    {props.visible ? t('Disable') : t('Enable')}
                  </Menu.Item> */}
                  {
                    props.removable
                    && (
                      <Menu.Item key="4" icon={<IconDelete className="has-icon" />} onClick={() => deleteWorkingGroup(props.id)}>
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
    },
  };

  return (
    <StyledWorkingGroup>
      <TitleH3 margin="20px 0">{t("All working groups")}</TitleH3>
      <DraggableList
        data={groups.map((item, index) => ({ ...item, index }))}
        columns={[...columns({
          updateWorkingGroupStatus,
          t
        }), moreActionsBtn]}
      />
      {
        edit
        && (
          <Suspense fallback={t("Loading...")}>
            <EditWorkingGroup
              visible={edit}
              modalHandler={modalHandler}
              selectedItem={selectedItem}
            />
          </Suspense>
        )
      }
    </StyledWorkingGroup>
  );
}


export default withRouter(WorkingGroupList);
