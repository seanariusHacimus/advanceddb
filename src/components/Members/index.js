import React, {
  Suspense, lazy, useState, useEffect, useRef, useCallback,
} from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import {
  Tooltip,
  Table, Dropdown, Menu, Popconfirm, Tag, Input,
} from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useQueryParam, BooleanParam, StringParam } from 'use-query-params';
import { useSelector } from 'react-redux';
import scrollIntoView from 'scroll-into-view';
import Axios from '../../utils/axios';
import { StyledMembersAll } from '../../styles/startBusiness';
import {
  FETCH_ALL_MEMBERS, DENY_ACCOUNT_MUTATION, APPROVE_ACCOUNT_MUTATION, UPDATE_MEMBER_ACCOUNT,
} from '../../graphql/members';
import {
  TitleH1, Flex, ButtonPrimary, Button, TitleH3, ButtonSecondary,
} from '../../styles';
// ----------------- ASSETS & STYLE -----------------
import { ReactComponent as IconEdit } from '../../assets/reform/edit.svg';
import { ReactComponent as IconChevronDown } from '../../assets/startBusiness/chevron-down.svg';
import { ReactComponent as IconChevronUp } from '../../assets/startBusiness/chevron-up.svg';
import { ReactComponent as IconFilter } from '../../assets/startBusiness/filter.svg';
import { ReactComponent as IconBlock } from '../../assets/profile/block.svg';
import { ReactComponent as IconDelete } from '../../assets/profile/delete.svg';
import { ReactComponent as IconCheck } from '../../assets/profile/check.svg';
import { ReactComponent as IconCancel } from '../../assets/invitation/cancel.svg';
import { ReactComponent as IconResend } from '../../assets/invitation/resend.svg';
import iconAdd, { ReactComponent as IconAdd } from '../../assets/startBusiness/add-primary.svg';
import iconApprove, { ReactComponent as IconApprove } from '../../assets/startBusiness/approve.svg';
import iconDeny, { ReactComponent as IconDeny } from '../../assets/startBusiness/deny.svg';
import { ReactComponent as IconSearch } from '../../assets/header/search.svg';

import iconEmail from '../../assets/startBusiness/email.svg';
import iconCard from '../../assets/profile/card.svg';
import iconHouse from '../../assets/profile/house.svg';
import iconPhone from '../../assets/startBusiness/phone.svg';

import { columns } from './table';
import { roleNames, roleWeights, uppercaseFirst, isUserAllowed } from '../../utils';
import { CANCEL_INVITE, DELETE_ACCOUNT, RESEND_INVITATION } from '../../graphql/invitation';
import { useLocale } from "../../utils/locale";

const InvitationModal = lazy(() => import('./InvitationModal'));
const UserRolesModal = lazy(() => import('./UserRoles'));

function searchMemberHandler(query, accounts) {
  if (query) {
    const searchQuery = query.toLowerCase();
    return accounts.filter((account) => account.email?.toLowerCase().includes(searchQuery)
      || account.phone?.toLowerCase().includes(searchQuery)
      || account.first_name?.toLowerCase().includes(searchQuery)
      || account.middle_name?.toLowerCase().includes(searchQuery)
      || account.last_name?.toLowerCase().includes(searchQuery)
      || account.role?.toLowerCase().includes(searchQuery)
      || account.comment?.toLowerCase().includes(searchQuery)
      || account.job_position?.toLowerCase().includes(searchQuery)
      || account.prefix?.toLowerCase().includes(searchQuery));
  }
  return accounts;
}

const useStatuses = (t) => ({
  unconfirmed: {
    text: t('Unconfirmed'),
    menu: ['edit', 'disable', 'delete'],
  },
  pending: {
    text: t('Reviewing'),
    menu: ['edit', 'disable', 'delete'],
  },
  active: {
    text: t('Active'),
    menu: ['edit', 'delete'],
  },
  denied: {
    text: t('Denied'),
    menu: ['approve', 'edit', 'delete'],
  },
  invite_sent: {
    text: t('Invited'),
    menu: ['resend', 'cancel', 'edit', 'delete'],
  },
  invite_expired: {
    text: t('Expired'),
    menu: ['resend', 'cancel', 'edit', 'delete'],
  },
  disabled: {
    text: t('Disabled'),
    menu: ['edit', 'delete'],
  },
  dummy: {
    text: t('Dummy'),
    menu: ['invite', 'delete'],
  },
});


const useAccountActions = (t) => (
  {
    edit: {
      action: async (account, history) => history && history.push(`/members/${account.id}`),
      icon: <IconEdit />,
      description: t('Edit this account'),
      showInStatus: false,
      admin: true,
    },
    deny: {
      action: async (account) => {
        try {
          await Axios.post('/graphql',
            {
              query: DENY_ACCOUNT_MUTATION,
              variables: { id: account.id },
            });
          Swal.fire({
            title: 'Denied',
            icon: 'warning',
            confirmButtonText: 'Close',
            html: `You have denied the access for <b>${account.email}</b>'`,
          })
        } catch (err) {
          console.log(err);
        }
      },
      icon: <IconDeny />,
      description: t("Deny request. The request will remain in a system, but requester won't be able to sign in"),
      showInStatus: false,
    },
    approve: {
      action: async (account) => {
        try {
          await Axios.post('/graphql',
            {
              query: APPROVE_ACCOUNT_MUTATION,
              variables: { id: account.id },
            });
          Swal.fire({
            title: 'Approved',
            icon: 'success',
            confirmButtonText: 'Close',
            html: `${t('You have successfully granted access to')} <b>${account.email}</b>`,
          })
        } catch (err) {
          console.log(err);
        }
      },
      icon: <IconApprove />,
      description: t("Approve request will allow account to signin and work in it's corresponding working groups"),
      showInStatus: false,
    },
    resend: {
      action: async (account) => {
        try {
          await Axios.post('/graphql',
            {
              query: RESEND_INVITATION,
              variables: { id: account.id },
            });
        } catch (err) {
          console.log(err);
        }
      },
      icon: <IconResend />,
      description: '',
      showInStatus: false,
    },
    cancel: {
      action: async (account) => {
        try {
          await Axios.post('/graphql',
            {
              query: CANCEL_INVITE,
              variables: { id: account.id },
            });
        } catch (err) {
          console.log(err);
        }
      },
      icon: <IconCancel />,
      description: '',
      showInStatus: false,
    },
    enable: {
      action: async (account) => {
        const result = await Swal.fire({
          // title: 'Are you sure?',
          text: t('Are you sure you want to enable the member? Once the account is enabled he/she wil be able to use the system.'),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: t('Yes, enable him!'),
          cancelButtonText: t('Cancel')
        });
        if (result.value) {
          try {
            await Axios.post('/graphql',
              {
                query: UPDATE_MEMBER_ACCOUNT,
                variables: { account: { disabled: false }, id: account.id },
              });
            return result;
          } catch (err) {
            console.log(err);
          }
        }
        return result;
      },
      icon: <IconCheck />,
      description: t('Enable account'),
      showInStatus: false,
    },

    disable: {
      action: async (account) => {
        const result = await Swal.fire({
          // title: 'Are you sure?',
          text: t('Are you sure you want to disable the member? Once the member is disabled he/she can not create another account.'),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: t('Yes, disable him'),
          cancelButtonText: t('Cancel')
        });
        if (result.value) {
          try {
            await Axios.post('/graphql',
              {
                query: UPDATE_MEMBER_ACCOUNT,
                variables: { account: { disabled: true }, id: account.id },
              });
            return result;
          } catch (err) {
            console.log(err);
          }
        }
        return result;
      },
      icon: <IconBlock />,
      description: t('Disable account'),
      showInStatus: false,
    },
    delete: {
      action: async (account) => {
        const result = await Swal.fire({
          // title: 'Are you sure?',
          text: t('Are you sure you want to delete this account?'),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: t('Yes, delete'),
          cancelButtonText: t('Cancel')
        });
        if (result.value) {
          try {
            await Axios.post('/graphql',
              {
                query: DELETE_ACCOUNT,
                variables: { id: account.id },
              });
          } catch (err) {
            console.log(err);
          }
        }
      },
      icon: <IconDelete />,
      description: t('Delete account'),
      showInStatus: false,
    },
    invite: {
      action: async (account, history) => {
        history.push('?show_invite_modal=1');
      },
      icon: <IconAdd />,
      description: t('Invite a user to use this dummy account'),
      showInStatus: false,
    },
  }
);

export { searchMemberHandler };

function RowMenu(props) {
  const { account, onSuccess } = props;
  const history = useHistory();
  const myAccount = useSelector(state => state.auth?.account || {});
  const [t] = useLocale()
  const statuses = useStatuses(t);
  const accountActions = useAccountActions(t);
  const statusObject = statuses[account.status];

  return (
    <Dropdown.Button
      className="users more-action-btn"
      trigger={['click']}
      onClick={(e) => e.stopPropagation()}
      getPopupContainer={(el) => el.parentElement}
      overlay={(
        <Menu className="more-action-btn-table">
          {statusObject.menu.map((key) => {
            const menuItem = accountActions[key];
            // If not superuser hide EDIT button
            if (myAccount.role !== 'superuser') {
              return !menuItem.admin ?
                (
                  <Menu.Item
                    key={key}
                    onClick={() => menuItem.action(account, history)?.then(onSuccess)}
                    icon={menuItem.icon}
                  >
                    <Tooltip title={menuItem.description}>
                      {t(uppercaseFirst(key))}
                    </Tooltip>
                  </Menu.Item>
                )
                :
                null
            }
            return (
              <Menu.Item
                key={key}
                onClick={() => menuItem.action(account, history)?.then(onSuccess)}
                icon={menuItem.icon}
              >
                <Tooltip title={menuItem.description}>
                  {t(uppercaseFirst(key))}
                </Tooltip>
              </Menu.Item>
            );
          })}
        </Menu>
      )}
      icon={<MoreOutlined />}
    />
  );
}

const isAuthorizedToEdit = (account, myAccount) =>
  account.id !== myAccount.id
  && roleWeights[account.role] < roleWeights[myAccount.role]
  && (['superuser', 'coordinator'].includes(myAccount.role))

const AccountsList = () => {
  // TODO add groups filter
  const parentRef = useRef(null);
  const myAccount = useSelector((state) => state.auth.account);
  const [t] = useLocale()
  const statuses = useStatuses(t);
  const accountActions = useAccountActions(t);
  const [showModal, setShowModal] = useQueryParam('show_invite_modal', BooleanParam);
  const [scrollTo, setScrollTo] = useQueryParam('scroll_to_member', StringParam);

  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStatuses, setFilteredStatuses] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [statusOrder, setStatusOrder] = useState('descend');
  const [showUserRoles, setShowUserRoles] = useState(false);

  const pageSize = 30;

  const calculatePageOfMember = (memberId) => {
    const actualList = filteredMembers.filter((member) => (filteredStatuses.length === 0 || filteredStatuses.indexOf(member.status) !== -1)
      && (filteredRoles.length === 0 || filteredRoles.indexOf(member.role) !== -1));
    const indexOfMember = actualList
      .map((member) => member.id).indexOf(memberId);
    return Math.floor(((indexOfMember !== -1 ? indexOfMember : 0)) / pageSize) + 1;
  };

  const onTableChange = (_, filters, sorter) => {
    setStatusOrder(sorter.order === 'descend' ? 'descend' : 'ascend');
    setFilteredStatuses(filters.status);
    setFilteredRoles(filters.role);
  };

  const fetchMembers = () => {
    Axios.post('/graphql', {
      query: FETCH_ALL_MEMBERS,
      variables: {
        filter: {
          // disabled: false
        },
        order: {
          key: 'status',
          direction: statusOrder === 'descend' ? 'desc' : 'asc',
        },
        pagination: {
          size: -1
        }
      },
    }).then((res) => {
      if (res?.data) {
        const newAccounts = res.data.data.accounts.nodes.map((account) => (account.type === 'dummy' ? {
          ...account,
          status: 'dummy',
        } : account));
        setMembers(newAccounts);
        setFilteredMembers(newAccounts);
      }
    });
  };
  useEffect(() => {
    if (scrollTo && filteredMembers.length !== 0) {
      const page = calculatePageOfMember(scrollTo);
      if (page !== currentPage) {
        setCurrentPage(page);
      } else {
        setScrollTo(null);
        scrollIntoView(document.getElementById(scrollTo), {});
      }
    }
  }, [filteredMembers, scrollTo, currentPage]);

  useEffect(() => {
    fetchMembers();
  }, [statusOrder]);

  const statusColumns = [
    {
      title: ({ sortOrder }) => (
        <Flex jc="end" className="has-sorter-icon">
          {t("Status")}
          {
            sortOrder === 'ascend' ? <IconChevronUp /> : <IconChevronDown />
          }
        </Flex>
      ),
      key: 'status',
      align: 'right',
      dataIndex: 'status',
      render: (val, account) => {
        const hasRights = isAuthorizedToEdit(account, myAccount);
        const leaderOfTheGroup = myAccount.role === 'participant' ?
          account.member_groups.find(i => myAccount.leader_groups.map(groups => groups.id).includes(i.id)) : {};

        if (val === 'pending' && (hasRights || leaderOfTheGroup)) return { props: { colSpan: 0 } };
        const isActive = val === 'active'


        return (
          <Flex jc="end" onClick={e => e.stopPropagation()}>
            {
              ((hasRights || leaderOfTheGroup) && ['active', 'disabled'].includes(val)) ?
                isActive ?
                  <Tag className={val} onClick={() => accountActions.disable.action(account).then((data) => {
                    if (data.isConfirmed) {
                      fetchMembers();
                    }
                  })} style={{ marginLeft: 'auto' }}>
                    {statuses[val].text}
                  </Tag>
                  :
                  <Tag className={val} onClick={() => accountActions.enable.action(account).then((data) => {
                    if (data.isConfirmed) {
                      fetchMembers();
                    }
                  })} style={{ marginLeft: 'auto', pointerEvents: 'all' }}>
                    {statuses[val].text}
                  </Tag>
                :
                <Tag className={val} style={{ marginLeft: 'auto' }}>
                  {statuses[val].text}
                </Tag>
            }

            {/* {hasRights && <RowMenu account={account} onSuccess={fetchMembers} />} */}
          </Flex>
        );
      },

      sortOrder: statusOrder,
      sorter: true,
      filterMultiple: true,
      filterIcon: <IconFilter />,
      filters:
        Object.keys(statuses).map((status) => (
          {
            text: statuses[status].text,
            value: status,
          }
        )),
      filteredValue: filteredStatuses,
      onFilter:
        ((status, account) => (Array.isArray(status)
          ? status.includes(account.status.id)
          : account.status === status)),
    },
    {
      key: 'more-actions',
      align: 'right',
      dataIndex: 'more-actions',
      render: (val, account) => {
        const hasRights = isAuthorizedToEdit(account, myAccount);
        return hasRights && <RowMenu account={account} onSuccess={fetchMembers} />
      }
    }
  ];

  const roleColumn = {
    key: 'role',
    title: ({ sortOrder, sortColumn, filters }) => (
      <Flex className="has-sorter-icon" jc="flex-end" textAlign="right">
        {t("Role")}
      </Flex>
    ),
    align: 'right',
    dataIndex: 'role',
    sorter: false,
    render: (val, account) => {
      const hasRights = isAuthorizedToEdit(account, myAccount);
      const leaderOfTheGroup = myAccount.role === 'participant' ?
        account.member_groups.find(i => myAccount.leader_groups.map(groups => groups.id).includes(i.id)) : {};

      if (account.status === 'pending' && (hasRights || leaderOfTheGroup)) {
        return {
          props: { colSpan: 2 },
          children: (
            <Flex jc="flex-end" onClick={(e) => e.stopPropagation()}>
              <ButtonPrimary
                onClick={() => accountActions.approve.action(account)
                  .then(() => fetchMembers())}
                className="small"
                disabled={!hasRights && !leaderOfTheGroup}
              >
                <img src={iconApprove} alt="approve" />
                <span>{t("Approve")}</span>
              </ButtonPrimary>
              <Popconfirm
                icon={null}
                title={t("Are you sure you want to deny this member?")}
                onConfirm={() => accountActions.deny.action(account)
                  .then(() => fetchMembers())}
                okText={t("Yes")}
                cancelText={t("Cancel")}
              >
                <Button className="small deny" disabled={!hasRights && !leaderOfTheGroup}>
                  <img src={iconDeny} alt="deny" />
                  <span>{t("Deny")}</span>
                </Button>
              </Popconfirm>
            </Flex>
          ),
        };
      }
      return <span className={account.role}>{roleNames[account.role]}</span>;
    },
    filterMultiple: true,
    filterIcon: <IconFilter />,
    filters: [
      {
        text: roleNames.participant,
        value: 'participant',
      },
      {
        text: roleNames.coordinator,
        value: 'coordinator',
      },
      {
        text: roleNames.superuser,
        value: 'superuser',
      },
    ],
    filteredValue: filteredRoles,
    onFilter:
      ((role, account) => (Array.isArray(role)
        ? role.includes(account.status.id)
        : account.role === role)),
  };

  const searchHandler = useCallback(() => {
    const foundMembers = searchMemberHandler(query, members);
    setFilteredMembers(foundMembers);
  }, [members, setFilteredMembers, query]);

  useEffect(() => {
    if (!query) {
      setFilteredMembers(members)
    }
  }, [query, members]);

  return (
    <StyledMembersAll className="all-members">
      <Flex>
        <TitleH1 margin="20px auto 20px 0">{t("All members")}</TitleH1>
        <Flex id="inner-search" style={{ marginLeft: 'auto' }}>
          <div id="inner-search-wrapper">
            <Input
              type="search"
              value={query}
              id="search-title"
              autoComplete="off"
              style={{ maxWidth: 300, marginRight: 10 }}
              placeholder={t('Search member')}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.which === 13) {
                  return searchHandler();
                };
              }}
            />
            {query && <span onClick={() => { setQuery(''); setFilteredMembers(members) }}>x</span>}
          </div>
          <IconSearch
            style={{ minWidth: 19, minHeight: 19 }}
            onClick={searchHandler}
            id="inner-search-btn"
          />
        </Flex>
        <ButtonSecondary
          className="small transparent"
          onClick={() => setShowUserRoles(state => !state)}
          style={{ width: 'auto', margin: '0 0 0 10px' }}
        >{t('User roles')}</ButtonSecondary>
        {isUserAllowed(myAccount) && (
          <ButtonPrimary className="small" style={{ marginLeft: 12 }} onClick={() => setShowModal(!showModal)}>
            <img src={iconAdd} alt={t("Add subaction")} />
            {t("Invite")}
          </ButtonPrimary>
        )}
      </Flex>
      <Table
        onChange={onTableChange}
        // size="middle"
        dataSource={filteredMembers}
        scroll={{ x: true }}
        columns={[...columns(t), roleColumn, ...statusColumns]}
        rowClassName={(record) => (record.status === 'pending' && 'bg-dark')}
        pagination={{
          defaultPageSize: pageSize,
          current: currentPage,
          hideOnSinglePage: true,
          position: ['bottomCenter'],
          showLessItems: true,
          size: 'small',
          onChange: setCurrentPage,
        }}
        rowKey="id"
        expandable={{
          expandRowByClick: (record) => record.status === 'pending',
          expandIcon: null,
          expandIconColumnIndex: -1,
          indentSize: 0,
          rowExpandable: (record) => record.status === 'pending',
          expandedRowClassName: (record) => (record.status === 'pending' ? 'bg-dark' : ''),
          expandedRowRender(account) {
            return (
              <div className="expanded-content">
                <TitleH3 className="expanded-title">
                  <img src={iconEmail} alt={t("user")} />
                  {t("Email")}:
                  <a href={`mailto:${account.email}`}>{account.email}</a>
                </TitleH3>
                {account.phone && (
                  <TitleH3 className="expanded-title">
                    <img src={iconPhone} alt={t("phone")} />
                    {t("Phone")}:
                    <a href={`tel:${account.phone}`}>{account.phone}</a>
                  </TitleH3>
                )}
                {account.job_position && (
                  <TitleH3 className="expanded-title">
                    <img src={iconCard} alt={t("job position")} />
                    {t("Job position")}:
                    <a href="#job-position">{account.job_position}</a>
                  </TitleH3>
                )}
                {account.organization && (
                  <TitleH3 className="expanded-title">
                    <img src={iconHouse} alt={t("organization")} />
                    {t("Organization")}:
                    <a href="#organization-title">{account.organization.title}</a>
                  </TitleH3>
                )}
                {account.comment && account.status === 'pending'
                  && (
                    <>
                      <TitleH3 className="expanded-title">{t("Comment")}:</TitleH3>
                      <p>{account.comment}</p>
                    </>
                  )}
                {account.leader_groups.concat(account.member_groups).length > 0
                  && (
                    <>
                      <TitleH3 className="expanded-title">
                        {t("Groups")}:
                        {account.leader_groups.concat(account.member_groups).map((group) => (
                          <a href="#" key={group.id}>
                            {group.title}
                            {', '}
                          </a>
                        ))}
                      </TitleH3>
                    </>
                  )}

              </div>
            );
          },
        }}
      />
      <div ref={parentRef}>
        {
          showModal && isUserAllowed(myAccount)
          && (
            <Suspense fallback={t("Loading...")}>
              <InvitationModal
                members={members}
                parentRef={parentRef}
                visible={showModal}
                handleCancel={() => setShowModal(false)}
                handleSuccess={(email) => {
                  Swal.fire({
                    title: t('Success'),
                    text: t(`Your invitation was successfully sent to ${email}`),
                    icon: 'success',
                  })
                  setShowModal(false);
                  fetchMembers();
                }}
              />
            </Suspense>
          )
        }
      </div>
      {
        showUserRoles
        && (
          <Suspense fallback={t("Loading...")}>
            <UserRolesModal
              visible={showUserRoles}
              hideModal={() => setShowUserRoles(false)}
            />
          </Suspense>
        )
      }
    </StyledMembersAll>
  );
};

export default withRouter(AccountsList);
