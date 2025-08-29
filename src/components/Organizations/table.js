import React from 'react';
import EditableArea from './EditableArea';

export const columns = props => [
  {
    key: 'title',
    title: t('Organization name'),
    dataIndex: 'title',
    className: 'drag-visible title',
    render: (val, data) => {
      const { id } = data;
      const isAuthorized = ['superuser', 'coordinator'].includes(props.role);
      return (
        <div className="icons-set">
          <div className="item-title">
            {
              isAuthorized ?
                <EditableArea title={val} id={id} fetchOrganizations={props.fetchData} />
                :
                <div>{val}</div>
            }
          </div>
        </div >
      )
    }
  },
];
