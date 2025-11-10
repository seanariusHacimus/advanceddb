import React from "react";
import { Tooltip, Dropdown, Menu, Typography } from "antd";
import { Popconfirm, Avatar, Badge } from "../../UI/shadcn";
import moment from "moment-timezone";
import iconHashTag from "../../../assets/startBusiness/user-grey.svg";
import iconAttachment from "../../../assets/startBusiness/attachment.svg";
import PieChart from "./components/PieIndicator";
import { indicatorStatus } from "../../../constants";
import store from "../../../store";
import { AiOutlinePaperClip } from "react-icons/ai";

// Helper function to get badge variant based on status
const getStatusVariant = (status) => {
  switch (status) {
    case 'completed':
      return 'default'; // Blue
    case 'ongoing_within_deadline':
      return 'warning'; // Yellow
    case 'ongoing_past_deadline':
      return 'destructive'; // Red
    case 'not_started':
      return 'secondary'; // Gray
    case 'on_review':
      return 'outline'; // Outlined
    default:
      return 'secondary';
  }
};

const displayAttachments = (data) => {
  const menu = (
    <Menu>
      {data.map((item, index) => {
        return (
          <Menu.Item key={item.id} className="action-attachment-item">
            <a href={item.file.download_url} target="_blank">
              {index + 1}. {item.filename}
            </a>
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <Dropdown
      overlay={menu}
      className="action-attachments"
      getPopupContainer={(el) => el.parentNode}
    >
      <div style={{ fontSize: 22 }}>
        <AiOutlinePaperClip
          size={20}
          color="#527BDD"
          style={{ marginRight: -5, marginTop: 5 }}
        />
      </div>
    </Dropdown>
  );
};

export const columns = ({
  completeAction,
  uncompleteAction,
  actionPermissions,
  t,
  onViewAction,
}) => [
  {
    title: t("Action name"),
    dataIndex: "name",
    key: "name",
    width: 200,
    className: "action-title",
    render: (val, action, index) => {
      return (
        <div className="icons-set">
          {action.status === "completed" ? (
            <a type="button" className="trigger-btn">
              <PieChart
                data={
                  action.sub_action_stats.total
                    ? action.sub_action_stats
                    : { total: 1, completed: 1 }
                }
              />
            </a>
          ) : (
            <a type="button" className="trigger-btn">
              <PieChart data={action.sub_action_stats} />
            </a>
          )}
          {action.attachments.length
            ? displayAttachments(action.attachments)
            : null}
          <Typography.Text
            className="item-title"
            ellipsis={{ tooltip: true }}
            style={{ cursor: onViewAction ? "pointer" : "default" }}
            onClick={() => onViewAction && onViewAction(action)}
          >
            {index + 1}. {val}
          </Typography.Text>
        </div>
      );
    },
  },
  {
    title: t("Start date"),
    className: "table-date",
    dataIndex: "start_at",
    key: "start_at",
    id: "start_at",
    render: (val) => moment(val).format(t("DD MMM YYYY")),
    sorter: (a, b) => {
      if (a.start_at > b.start_at) {
        return -1;
      } else if (a.start_at < b.start_at) {
        return 1;
      } else {
        return 0;
      }
    },
    sortDirections: ["ascend", "descend", "ascend"],
  },
  {
    title: t("End date"),
    className: "table-date",
    dataIndex: "end_at",
    key: "end_at",
    render: (val) => moment(val).format(t("DD MMM YYYY")),
    sorter: (a, b) => {
      if (a.end_at > b.end_at) {
        return -1;
      } else if (a.end_at < b.end_at) {
        return 1;
      } else {
        return 0;
      }
    },
    sortDirections: ["ascend", "descend", "ascend"],
  },
  {
    title: t("Assigned"),
    dataIndex: "responsive_organizations",
    key: "responsive_organizations",
    className: "table-responsible",
    ellipsis: {
      showTitle: false,
    },
    render: (val, data) => {
      const { responsive_accounts, responsive_tags } = data;
      return (
        <div>
          {responsive_tags.map((tag) => (
            <Tooltip title={tag.title} key={tag.title}>
              <Avatar
                fallback={tag.title?.substring(0, 1).toUpperCase() || '#'}
                size="sm"
                style={{ 
                  marginRight: '4px', 
                  border: "2px solid hsl(var(--muted))",
                  background: 'hsl(var(--muted))'
                }}
              />
            </Tooltip>
          ))}
          {responsive_accounts.map((acc) => (
            <Tooltip title={acc.first_name} key={acc.id}>
              <Avatar 
                src={acc?.photo?.url} 
                alt={acc.first_name}
                fallback={acc.first_name?.substring(0, 2).toUpperCase()}
                size="sm"
                style={{ 
                  marginRight: '4px',
                  border: "2px solid hsl(var(--primary) / 0.2)"
                }}
              />
            </Tooltip>
          ))}
          {!responsive_tags.length && !responsive_accounts.length && "N/A"}
        </div>
      );
    },
  },
  {
    title: t("Status"),
    dataIndex: "status",
    key: "status",
    width: "15%",
    filters: [
      {
        text: t("Not Started"),
        value: "not_started",
      },
      {
        text: t("In Progress"),
        value: "ongoing_within_deadline",
      },
      {
        text: t("Completed"),
        value: "completed",
      },
      {
        text: t("Past Due"),
        value: "ongoing_past_deadline",
      },
      {
        text: t("Under Review"),
        value: "on_review",
      },
    ],
    onFilter: (value, record) => record.status.indexOf(value) === 0,
    sorter: (a, b) => {
      if (a.status > b.status) {
        return -1;
      } else if (a.status < b.status) {
        return 1;
      } else {
        return 0;
      }
    },
    sortDirections: ["ascend", "descend", "ascend"],
    render: (val, record) => {
      const myAccount = store.getState().auth.account;
      const currentWorkingGroupId = store.getState().selectedWorkingGroup.id;
      const isLeader = myAccount.leader_groups.find(
        (i) => i.id === currentWorkingGroupId
      );

      const actionApproval = (
        <Popconfirm
          overlayClassName="custom-popconfirm"
          // title={(
          //   <div>
          //     <h3>{t("Can you confirm this?")}</h3>
          //   </div>
          // )}
          onConfirm={(e) => {
            e.stopPropagation();
            completeAction(record.id);
          }}
          onCancel={(e) => {
            e.stopPropagation();
            uncompleteAction(record.id);
          }}
          okText={t("Approve")}
          cancelButtonProps={{
            style: {
              color: "#fff",
              backgroundColor: "var(--danger)",
              borderColor: "var(--danger)",
            },
          }}
          cancelText={t("Reject")}
          icon={null}
        >
          <Badge 
            variant={getStatusVariant(val)}
            style={{ cursor: 'pointer', textTransform: 'capitalize' }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {t(indicatorStatus[val])}
          </Badge>
        </Popconfirm>
      );

      return record.status === "on_review" &&
        (myAccount.role !== "participant" || isLeader) ? (
        actionApproval
      ) : record.status === "completed" ? (
        <Popconfirm
          disabled={!actionPermissions.complete}
          overlayClassName="custom-popconfirm"
          // getPopupContainer={(el) => el.parentNode}
          onClick={(e) => e.stopPropagation()}
          title={
            <div>
              <h3>{t("This action will no longer be marked as Completed")}</h3>
              {!isLeader && myAccount.role === "participant" ? (
                <p>
                  {t(
                    "The action status will be under review and needs to be approved or rejected by an authorized person"
                  )}
                </p>
              ) : null}
            </div>
          }
          onConfirm={(e) => {
            e.stopPropagation();
            uncompleteAction(record.id);
          }}
          onCancel={(e) => e.stopPropagation()}
          okText={t("Confirm")}
          cancelText={t("Cancel")}
          icon={null}
        >
          <Badge 
            variant={getStatusVariant(val)}
            style={{ cursor: 'pointer', textTransform: 'capitalize' }}
          >
            {t(indicatorStatus[val])}
          </Badge>
        </Popconfirm>
      ) : record.status === "on_review" ? (
        //   <Popconfirm
        //     disabled={!actionPermissions.complete}
        //     overlayClassName="custom-popconfirm"
        //     onClick={(e) => e.stopPropagation()}
        //     title={(
        //       <div>
        //         <h3>{t("Do you want to cancel it?")}</h3>
        //       </div>
        //     )}
        //     onConfirm={(e) => {
        //       e.stopPropagation();
        //       uncompleteAction(record.id);
        //     }}
        //     onCancel={(e) => e.stopPropagation()}
        //     okText={t("Yes")}
        //     cancelText={t("Cancel")}
        //     icon={null}
        //   >
        <Badge 
          variant={getStatusVariant(val)}
          style={{ 
            cursor: record.is_pending ? 'not-allowed' : 'pointer',
            opacity: record.is_pending ? 0.5 : 1,
            textTransform: 'capitalize'
          }}
        >
          {t(indicatorStatus[val])}
        </Badge>
      ) : (
        //   </Popconfirm>
        <Popconfirm
          disabled={!actionPermissions.complete}
          overlayClassName="custom-popconfirm"
          // getPopupContainer={(el) => el.parentNode}
          onClick={(e) => e.stopPropagation()}
          title={
            <div>
              <h3>{t("Complete the action")}</h3>
              {!isLeader && myAccount.role === "participant" ? (
                <p>
                  {t(
                    "The action status will be under review and needs to be approved or rejected by an authorized person"
                  )}
                </p>
              ) : (
                <p>
                  {t("This will also mark related Subactions as Complete.")}
                </p>
              )}
            </div>
          }
          onConfirm={(e) => {
            e.stopPropagation();
            completeAction(record.id);
          }}
          onCancel={(e) => e.stopPropagation()}
          okText={t("Confirm")}
          cancelText={t("Cancel")}
          icon={null}
        >
          <Badge 
            variant={getStatusVariant(val)}
            style={{ cursor: 'pointer', textTransform: 'capitalize' }}
          >
            {t(indicatorStatus[val])}
          </Badge>
        </Popconfirm>
      );
    },
  },
];

export const subActionColumn = ({
  parentIndex,
  updateStatus,
  actionPermissions,
  t,
  onViewAction,
}) => [
  {
    title: t("Action name"),
    dataIndex: "name",
    key: "name",
    className: "action-title icons-set",
    render: (val, data, index) => (
      <>
        {data.attachments.length ? displayAttachments(data.attachments) : null}
        <span
          className="item-title"
          style={{ cursor: onViewAction ? "pointer" : "default" }}
          onClick={() => onViewAction && onViewAction(data)}
        >
          {parentIndex + 1}.{index + 1}. {val}
        </span>
      </>
    ),
  },
  {
    title: t("Start date"),
    className: "table-date",
    dataIndex: "start_at",
    key: "start_at",
    render: (val) => moment(val).format(t("DD MMM YYYY")),
  },
  {
    title: t("End date"),
    className: "table-date",
    dataIndex: "end_at",
    key: "end_at",
    render: (val) => moment(val).format(t("DD MMM YYYY")),
  },
  {
    title: t("Assigned"),
    dataIndex: "responsive_organizations",
    key: "responsive_organizations",
    className: "table-responsible",
    ellipsis: {
      showTitle: false,
    },
    render: (val, data) => {
      const { responsive_accounts, responsive_tags } = data;
      return (
        <div>
          {responsive_tags.map((tag) => (
            <Tooltip title={tag.title} key={tag.title}>
              <Avatar
                fallback={tag.title?.substring(0, 1).toUpperCase() || '#'}
                size="sm"
                style={{ 
                  marginRight: '4px',
                  border: "2px solid hsl(var(--muted))",
                  background: 'hsl(var(--muted))'
                }}
              />
            </Tooltip>
          ))}
          {responsive_accounts.map((acc) => (
            <Tooltip title={acc.first_name} key={acc.id}>
              <Avatar 
                src={acc?.photo?.url} 
                alt={acc.first_name}
                fallback={acc.first_name?.substring(0, 2).toUpperCase()}
                size="sm"
                style={{ 
                  marginRight: '4px',
                  border: "2px solid hsl(var(--primary) / 0.2)"
                }}
              />
            </Tooltip>
          ))}
          {!responsive_tags.length && !responsive_accounts.length && "N/A"}
        </div>
      );
    },
  },
  {
    title: t("Status"),
    dataIndex: "status",
    key: "status",
    width: "15%",
    render: (val, record, index) => {
      const myAccount = store.getState().auth.account;
      const currentWorkingGroupId = store.getState().selectedWorkingGroup.id;
      const isLeader = myAccount.leader_groups.find(
        (i) => i.id === currentWorkingGroupId
      );

      const actionApproval = (
        <Popconfirm
          overlayClassName="custom-popconfirm"
          // title={(
          //   <div>
          //     <h3>{t("Can you confirm this?")}</h3>
          //   </div>
          // )}
          onConfirm={(e) => {
            e.stopPropagation();
            updateStatus(e, record.id, record.status);
          }}
          onCancel={(e) => {
            e.stopPropagation();
            updateStatus(e, record.id, record.status);
          }}
          okText={t("Approve")}
          cancelButtonProps={{
            style: {
              color: "#fff",
              backgroundColor: "var(--danger)",
              borderColor: "var(--danger)",
            },
          }}
          cancelText={t("Reject")}
          icon={null}
        >
          <Badge 
            variant={getStatusVariant(val)}
            style={{ cursor: 'pointer', textTransform: 'capitalize' }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {t(indicatorStatus[val])}
          </Badge>
        </Popconfirm>
      );

      return record.status === "on_review" &&
        (myAccount.role !== "participant" || isLeader) ? (
        actionApproval
      ) : record.status === "completed" ? (
        <Popconfirm
          disabled={!actionPermissions.complete}
          overlayClassName="custom-popconfirm"
          onClick={(e) => e.stopPropagation()}
          title={
            <div>
              <h3>{t("This action will no longer be marked as Completed")}</h3>
              {/* {
                  !isLeader && myAccount.role === 'participant' ?
                    <p>{t("The action status will be under review and needs to be approved or rejected by an authorized person")}</p>
                    :
                    null
                } */}
            </div>
          }
          onConfirm={(e) => {
            e.stopPropagation();
            updateStatus(e, record.id, record.status);
          }}
          onCancel={(e) => e.stopPropagation()}
          okText={t("Confirm")}
          cancelText={t("Cancel")}
          icon={null}
        >
          <Badge 
            variant={getStatusVariant(val)}
            style={{ 
              cursor: record.is_pending ? 'not-allowed' : 'pointer',
              opacity: record.is_pending ? 0.5 : 1,
              textTransform: 'capitalize'
            }}
          >
            {t(indicatorStatus[val])}
          </Badge>
        </Popconfirm>
      ) : record.status === "on_review" ? (
        // <Popconfirm
        //   disabled={!actionPermissions.complete}
        //   overlayClassName="custom-popconfirm"
        //   onClick={(e) => e.stopPropagation()}
        //   title={(
        //     <div>
        //       <h3>{t("Do you want to cancel it?")}</h3>
        //     </div>
        //   )}
        //   onConfirm={(e) => {
        //     e.stopPropagation();
        //     updateStatus(e, record.id, 'completed')
        //   }}
        //   onCancel={(e) => e.stopPropagation()}
        //   okText={t("Yes")}
        //   cancelText={t("Cancel")}
        //   icon={null}
        // >
        <Badge 
          variant={getStatusVariant(val)}
          style={{ 
            cursor: record.is_pending ? 'not-allowed' : 'pointer',
            opacity: record.is_pending ? 0.5 : 1,
            textTransform: 'capitalize'
          }}
        >
          {t(indicatorStatus[val])}
        </Badge>
      ) : (
        // </Popconfirm>
        <Popconfirm
          disabled={!actionPermissions.complete}
          overlayClassName="custom-popconfirm"
          onClick={(e) => e.stopPropagation()}
          title={
            <div>
              <h3>{t("Subaction completed?")}</h3>
              {/* {
                    !isLeader && myAccount.role === 'participant' ?
                      <p>{t("The action status will be under review and needs to be approved or rejected by an authorized person")}</p>
                      :
                      null
                  } */}
            </div>
          }
          onConfirm={(e) => {
            e.stopPropagation();
            updateStatus(e, record.id, record.status);
          }}
          onCancel={(e) => e.stopPropagation()}
          okText={t("Confirm")}
          cancelText={t("Cancel")}
          icon={null}
        >
          <Badge 
            variant={getStatusVariant(val)}
            style={{ 
              cursor: record.is_pending ? 'not-allowed' : 'pointer',
              opacity: record.is_pending ? 0.5 : 1,
              textTransform: 'capitalize'
            }}
          >
            {t(indicatorStatus[val])}
          </Badge>
        </Popconfirm>
      );
    },
  },
];
