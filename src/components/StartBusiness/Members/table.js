import React from 'react';
import iconUser from '../../../assets/startBusiness/user.svg';
import { Avatar, Badge } from '../../UI/shadcn';

export const columns = (t) => [
  {
    key: 'name',
    title: t('Name'),
    dataIndex: 'name',
    className: 'members-title',
    render: (val, props) => {
      const initials = `${props.first_name?.substring(0, 1) || ''}${props.last_name?.substring(0, 1) || ''}`.toUpperCase();
      return (
        <div className="icons-set">
          <Avatar
            src={props.photo?.url}
            alt={`${props.first_name} ${props.last_name}`}
            fallback={initials || '?'}
            size="sm"
            style={{ marginRight: '10px' }}
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
      return <Badge variant={props.role === 'leader' ? 'default' : 'secondary'}>{t(val)}</Badge>
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
