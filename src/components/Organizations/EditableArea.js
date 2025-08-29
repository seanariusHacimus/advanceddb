import React, { useState, useRef, useCallback } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { updateOrganizations } from '../../graphql/organizations';
import {useLocale} from "../../utils/locale";

const EditableArea = (props) => {
  const currentRef = useRef();
  const [title, setTitle] = useState(props.title);
  const [t] = useLocale();
  const updateOrganizationTitle = useCallback(async () => {
    const data = await updateOrganizations(props.id, title.trim());
    console.error(data.data.errors);
    if (!data.data.errors) {
      props.fetchOrganizations();
      message.success({
        content: t('Title has been updated successfully'),
        duration: 10,
        style: {
          right: 30,
          bottom: 30,
          position: 'fixed',
          fontSize: 16,
        },
      });
    } else {
      message.error({
        content: t('Title must be unique'),
        duration: 10,
        style: {
          right: 30,
          bottom: 30,
          position: 'fixed',
          fontSize: 16,
        },
      });
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
        (title.trim().length > 0 && title !== props.title) &&
        <div>
          <CheckCircleOutlined className="check-icon success" onClick={updateOrganizationTitle} />
          <CloseCircleOutlined className="check-icon error" onClick={() => setTitle(props.title)} />
        </div>
      }

    </div>
  );
}

export default EditableArea;
