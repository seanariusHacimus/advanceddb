import React, { useState, useRef, useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../UI/shadcn/toast';
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
  const { toast } = useToast();
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
        toast.success({
          title: t('Success'),
          description: t('Title has been updated successfully'),
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
        toast.error({
          title: t('Error'),
          description: title,
        })
      } else {
        toast.error({
          title: t('Error'),
          description: t('Something went wrong'),
        });
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
          <CheckCircle className="check-icon success" onClick={updateWorkingGroupTitle} style={{ cursor: 'pointer' }} />
          <XCircle className="check-icon error" onClick={() => setTitle(props.title)} style={{ cursor: 'pointer' }} />
        </div>
      }

    </div>
  );
}

export default EditableArea;
