import React from 'react';
import moment from 'moment-timezone';
import iconAttachment from '../../../assets/startBusiness/attachment.svg';

export const columns = ({ currentPage, t }) => [
  {
    title: '',
    key: 'count',
    render: (val, name, index) => <span>{currentPage > 1 ? ((currentPage - 1) * 10 + index + 1) : index + 1}</span>,
  },
  {
    key: 'name',
    title: t('Meeting name'),
    dataIndex: 'name',
  },
  {
    key: 'date',
    title: t('Date'),
    dataIndex: 'date',
    render: (val) => moment(val).format(t('DD MMM YYYY')),
  },
  {
    key: 'creator',
    title: t('Created by'),
    dataIndex: 'creator',
    render: (val) => `${val.first_name} ${val.last_name}`,
  },
  {
    key: 'attachments',
    title: t('Files'),
    dataIndex: 'attachments',
    render: (val) => (val.length
      ? (
        <div className="icons-set">
          <img src={iconAttachment} alt={t("has attachment")} className="attachment-icon" />
          <span className="item-title">{`${val[0]?.filename.slice(0, 8)}...${val[0]?.filename.slice(-5)}`}</span>
        </div>
      )
      : null),
  },
];
