import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import iconActions from '../../assets/startBusiness/actions.svg';
import { Flex, Avatar } from '../../styles';
import { Link } from 'react-router-dom';
import { Tooltip } from "../UI/shadcn"; // Using shadcn Tooltip

export const columns = (t) => [
  {
    key: 'name',
    title: t('Name'),
    dataIndex: 'name',
    width: 'auto',
    render: (val, account) => {
      return (
        <Flex className="icons-set" id={account.id}>
          {
            account.status !== 'pending'
              ? (
                <>
                  <Avatar
                    img={account.photo?.url}
                    margin="0px 10px 0px 0px"
                  />
                  <div className="item-title">
                    <div>{`${account.first_name || ''} ${account.last_name || ''}`}</div>
                    <div className="email thin">{account.email}</div>
                  </div>
                </>
              )
              : (
                <div className="item-title" style={{ paddingLeft: 15 }}>
                  <div className="pending-subtitle">{`${account.first_name || ''} ${account.last_name || ''}`}</div>
                  <div className="thin">{account.email}</div>
                </div>
              )
          }
        </Flex>
      );
    },
  },
  {
    key: 'organization',
    title: t('Organization'),
    dataIndex: 'organization',
    align: 'center',
    render: (organization) => (organization?.title || '-------------------'),
  },
  {
    key: 'job_position',
    title: t('Position'),
    dataIndex: 'job_position',
    align: 'center',
    render: (job_position) => (job_position || '-------------------'),
  },
  {
    key: 'groups',
    title: t('Working group'),
    dataIndex: 'groups',
    align: 'center',
    render: (val, data) => {
      const groups = [...data.leader_groups, ...data.member_groups];
      return (
        <div>
          {
            groups.length ? groups.map(i => {
              return (
                <span className="wg-list" key={i.id}>
                  <Link to={`/working-group/${i.title.toLowerCase().replace(/\s/g, '-')}`}>{i.title}</Link>,
                </span>
              )
            })
              :
              null
          }
        </div>
      )
    },
  },
];

const roleRender = (val) => {
  if (typeof (val) === 'boolean') {
    return val ? <CheckCircle style={{ color: "hsl(var(--chart-2))", fill: "hsl(var(--chart-2))" }} size={18} /> : <XCircle style={{ color: "hsl(var(--destructive))", fill: "hsl(var(--destructive))" }} size={18} />
  } else if (typeof (val) === 'object') {
    return (
      <Tooltip title={val.tooltip}
        overlayClassName="custom-tooltip"
        getPopupContainer={() => document.querySelector('.ant-modal-body')}
        color="#535263">
        <div>{val.text}</div>
      </Tooltip>)
  } else
    return val
}

export const roleColumns = (t) => [
  {
    key: 'title',
    dataIndex: 'title',
    title: <img src={iconActions} alt="actions" />,
  },
  {
    key: 'superUser',
    dataIndex: 'superUser',
    title: t('Site Admin'),
    className: 'text-center',
    render: roleRender
  },
  {
    key: 'coordinator',
    dataIndex: 'coordinator',
    title: t('Coordinator'),
    className: 'text-center',
    render: roleRender
  },
  {
    key: 'leader',
    dataIndex: 'leader',
    title: t('Leader'),
    className: 'text-center',
    render: roleRender
  },
  {
    key: 'member',
    dataIndex: 'member',
    title: t('Member'),
    className: 'text-center',
    render: roleRender
  },
]
