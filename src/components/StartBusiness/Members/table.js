import React from 'react';
import iconUser from '../../../assets/startBusiness/user.svg';
import { Avatar } from '../../../styles';

export const columns = (t) => [
  {
    key: 'name',
    title: t('Name'),
    dataIndex: 'name',
    className: 'members-title',
    render: (val, props) => {
      return (
        <div className="icons-set">
          <Avatar
            img={props.photo?.url || iconUser}
            margin="0px 10px 0px 0px"
          />
          <span className="item-title">{`${props.first_name || ''} ${props.last_name || ''}`}</span>
        </div>
      )
    }
  },
  {
    key: 'organization',
    title: t('Organization'),
    dataIndex: 'organization',
    render: (val, props) => val?.title,
  },
  {
    key: 'job_position',
    title: t('Position'),
    dataIndex: 'job_position',
  },
  {
    key: 'role',
    title: t('Role'),
    align: 'center',
    dataIndex: 'role',
    render: (val, props) => {
      return <span className={props.role}>{val}</span>
    },
    sorter: (a, b) => {
      const x = a.role; const y = b.role;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    },
    filterMultiple: false,
    onFilter: (value, record) => record.role.indexOf(value) === 0,
    filters: [
      {
        text: t('Member'),
        value: 'member',
      },
      {
        text: t('Leader'),
        value: 'leader',
      },
    ],
  },
];
