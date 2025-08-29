import React from 'react';
import moment from 'moment-timezone';

export default ({ currentPage, t }) => [
  {
    title: '#',
    key: 'id',
    dataIndex: 'id',
    render: (val, action, index) => (index + 1)
  },
  {
    title: t('Type of data update'),
    dataIndex: 'type_of_update',
    key: 'type_of_update',
  },
  {
    title: t('Indicator impacted'),
    dataIndex: 'group',
    key: 'group',
    render: (val) => val.title,
  },
  {
    title: t('Created by'),
    dataIndex: 'creator',
    key: 'creator',
    render: (val) => `${val.first_name}  ${val.last_name}`,
  },
  {
    title: t('Date of Entry'),
    dataIndex: 'date_of_entry',
    key: 'date_of_entry',
    render: (val) => val && moment(val).format(t('DD MMM YYYY')),
  },
];
