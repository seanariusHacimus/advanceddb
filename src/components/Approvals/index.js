import React, { useEffect, useMemo, useState } from "react";
import { Table, Button } from "antd";
import { useLocale } from "../../utils/locale";
import Axios from "../../utils/axios";
import {
  APPROVE_ACTION,
  FETCH_APPROVAL_ACTIONS,
  REJECT_ACTION,
} from "../../graphql/approvals";
import { groupTitleToUrl } from "../../utils";
import { Link } from "react-router-dom";
import store from "../../store";
import { indicatorStatus } from "../../constants";
import { useSelector } from "react-redux";
import { USER_ROLES } from "../../constants/userRoles";

const Approvals = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, size: 10 });
  const [t] = useLocale();
  const myAccount = useSelector((state) => state.auth.account || {});
  const leaderGroups = useMemo(
    () => myAccount.leader_groups.map((i) => i.id),
    [myAccount.leader_groups]
  );
  const handlePage = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      let filter = { status: "on_review" };
      if (myAccount.role === USER_ROLES.PARTICIPANT) {
        filter = {
          status: "on_review",
          group_id: leaderGroups,
        };
      }
      const res = await Axios.post("/graphql", {
        query: FETCH_APPROVAL_ACTIONS,
        variables: {
          filter,
          filterSubAction: filter,
        },
      });
      console.log(res);

      if (res?.data) {
        const {
          actions: { nodes },
          sub_actions,
        } = res.data.data;
        setData([...nodes, ...sub_actions.nodes]);
        setPagination((state) => ({ ...state, page, size }));
      }
      setLoading(false);
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      setLoading(true);
      const query = status ? APPROVE_ACTION : REJECT_ACTION;
      const res = await Axios.post("/graphql", {
        query,
        variables: {
          id,
        },
      });

      setLoading(false);
      if (res) {
        handlePage();
      }
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
    }
  };

  useEffect(() => {
    handlePage();
  }, []);

  const columns = useMemo(() => [
    {
      dataIndex: "name",
      title: t("Action name"),
      ellipsis: {
        showTitle: true,
      },
      render: (val, record, index) => {
        const pageIndex =
          pagination.page > 1
            ? (pagination.page - 1) * pagination.size + index + 1
            : index + 1;
        return (
          <Link
            to={`/working-group/${groupTitleToUrl(
              record.group.title
            )}?scroll_to_action=${record.id}`}
          >
            {pageIndex}. {record.name}
          </Link>
        );
      },
    },
    {
      dataIndex: "group",
      title: t("Working Group"),
      render: (val, record) => (
        <Link to={`/working-group/${groupTitleToUrl(record.group.title)}`}>
          {record.group.title}
        </Link>
      ),
      sorter: (a, b) => {
        if (a.group.title > b.group.title) {
          return -1;
        } else if (a.group.title < b.group.title) {
          return 1;
        } else {
          return 0;
        }
      },
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      dataIndex: "status",
      title: t("Status"),
      render: (val, record) => {
        return (
          <Button
            className={`${val} status-button`}
            type="button"
            shape="round"
            disabled={record.is_pending}
          >
            {t(indicatorStatus[val])}
          </Button>
        );
      },
    },
    {
      dataIndex: "review_requester",
      title: t("Requested by"),
      render: (val, record) => {
        if (val?.id) {
          return (
            <Link
              to={`/members/${val?.id}`}
            >{`${val?.first_name} ${val?.last_name}`}</Link>
          );
        }
        return null;
      },
    },
    {
      dataIndex: "review_requested_at",
      title: t("Requested date"),
      render: (val, record) =>
        val ? <div>{new Date(val).toLocaleString()}</div> : null,
      sorter: (a, b) => {
        if (a.review_requested_at > b.review_requested_at) {
          return -1;
        } else if (a.review_requested_at < b.review_requested_at) {
          return 1;
        } else {
          return 0;
        }
      },
      sortDirections: ["ascend", "descend", "ascend"],
    },
  ]);

  const sortedData = useMemo(
    () =>
      data.sort((a, b) => {
        if (a.review_requested_at > b.review_requested_at) {
          return -1;
        } else if (a.review_requested_at < b.review_requested_at) {
          return 1;
        } else {
          return 0;
        }
      }),
    [data]
  );

  return (
    <div>
      <h2>{t("Approval inbox")}</h2>
      <Table
        columns={columns}
        dataSource={sortedData}
        rowKey="id"
        loading={loading}
        rowClassName=""
        pagination={{
          hideOnSinglePage: false,
          showSizeChanger: true,
          current: pagination.page,
          pageSize: parseInt(pagination.size),
          onChange: (page, size) => handlePage(page, size),
          pageSizeOptions: [10, 20, 30, 50],
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
      />
    </div>
  );
};

export default Approvals;
