import React, { useState, useRef, useCallback } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { message } from 'antd';
import Axios from '../../utils/axios';
import { UPDATE_WORKING_GROUP } from '../../graphql/workingGroups';
import { fetchWorkingGroupsAction } from '../../store/WorkingGroups/actions';
import { useDispatch } from 'react-redux';
import {useLocale} from "../../utils/locale";

const EditableArea = (props) => {
  const { id } = props;
  const currentRef = useRef();
  const dispatch = useDispatch();
  const [t] = useLocale();
  const [title, setTitle] = useState(props.title);

  const updateWorkingGroupTitle = useCallback(async () => {
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
        message.success({
          content: 'Title has been updated successfully',
          duration: 10,
          style: {
            right: 30,
            bottom: 30,
            position: 'fixed',
            fontSize: 16,
          },
        });
        dispatch(fetchWorkingGroupsAction())
      }

    } catch (err) {
      // TODO parse errors
      const { extensions = '' } = err.response?.data?.errors[0];
      console.log(extensions);
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
  }, [title]);

  return (
    <div className="editable-block">
      <input
        className="editable-input clickable"
        ref={currentRef}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      {
        title !== props.title &&
        <div>
          <CheckCircleOutlined className="check-icon success" onClick={updateWorkingGroupTitle} />
          <CloseCircleOutlined className="check-icon error" onClick={() => setTitle(props.title)} />
        </div>
      }

    </div>
  );
}

export default EditableArea;
