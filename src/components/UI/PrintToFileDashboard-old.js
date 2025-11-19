import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dropdown, Menu, Table, Tooltip } from "antd";
import { Button } from "../UI/shadcn";
import { message } from "../../utils/message";
import Axios from "../../utils/axios";
import {
  FETCH_ACTIONS_FOR_PRINT,
  FETCH_VISIBLE_INDICATOR_GROUPS,
} from "../../graphql/print";
import {
  exportToExel,
  exportToPdf,
  printAllActionsExcel,
  printAllActionsPdf,
} from "../../utils/printer";
import { useLocale } from "../../utils/locale";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";
import { columns } from "../StartBusiness/ActionPlan/table";
import { indicatorStatus } from "../../constants";
import StyledPrint from "../../styles/print";

const PrintToFile = ({ id, title, style, printSortedData = [], page }) => {
  const [t] = useLocale();
  const parentRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState([]);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, size: 10 });

  const handlePrintAll = async (isPdf) => {
    try {
      const { data: groups } = await Axios.post("/graphql", {
        query: FETCH_VISIBLE_INDICATOR_GROUPS,
        pagination: {
          size: -1,
        },
      });
      console.log(groups);
      const activeIndicatorGroups = groups?.data?.indicator_groups?.nodes;
      let allGroups = "";
      activeIndicatorGroups.forEach((item, index) => {
        allGroups += `
         d${[index]}: actions(filter: {group_id: "${item.id}"}) {
            nodes {
              name
              start_at
              end_at
              sub_actions {
                name
                start_at
                end_at
                status
                responsive_tags {
                  title
                }
                responsive_accounts {
                  first_name
                  last_name
                }
              }
              responsive_tags {
                title
              }
              responsive_accounts {
                first_name
                last_name
              }
              status
            }
          }
        `;
      });

      let query = `
      query actions{
        ${allGroups}
      }
      `;

      const {
        data: { data },
      } = await Axios.post("/graphql", {
        query,
      });

      let printData = {};
      for (let x in data) {
        const title = activeIndicatorGroups[x.slice(1)].title;
        printData = { ...printData, [title]: data[x].nodes };
      }

      isPdf
        ? printAllActionsPdf({ dataObject: printData })
        : printAllActionsExcel({ dataObject: printData });
    } catch (err) {
      console.log(err);
      message.error(t("Something went wrong while printing"));
    }
  };

  const handlePrint = async (isPdf) => {
    try {
      let data = [];
      if (printSortedData?.length) {
        data = printSortedData;
      } else {
        const { data: comingData } = await Axios.post("/graphql", {
          query: FETCH_ACTIONS_FOR_PRINT,
          variables: {
            filter: {
              group_id: id,
            },
            order: {
              key: "end_at",
              direction: "asc",
            },
            pagination: {
              size: -1,
            },
          },
        });
        data = comingData.data.actions.nodes;
      }

      isPdf ? exportToPdf({ data, title }) : exportToExel({ data, title });
    } catch (err) {
      console.log(err);
      message.error(t("Something went wrong while printing"));
    }
  };

  const fetchWorkingGroupActions = async (page) => {
    try {
      const { data } = await Axios.post("/graphql", {
        query: FETCH_ACTIONS_FOR_PRINT,
        variables: {
          filter: {
            group_id: id,
          },
          order: {
            key: "end_at",
            direction: "asc",
          },
          pagination: {
            size: -1,
          },
        },
      });
      const result = data.data.actions.nodes;
      setData(result);
      console.log(result);
    } catch (err) {
      console.log(err);
      message.error(t("Something went wrong"));
    }
  };

  const handleModal = () => setVisible((state) => !state);
  useEffect(() => {
    if (visible) {
      fetchWorkingGroupActions();
    }
  }, [visible]);

  const columns = useMemo(() => [
    {
      title: t("Action name"),
      dataIndex: "name",
      key: "name",
      className: "action-title",
      render: (val, action, index) => {
        return (
          <div className="icons-set">
            <span className="item-title">
              {index + 1}. {val.slice(0, 50)}
            </span>
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
      sorter: {
        compare: (a, b) => {
          if (a.start_at > b.start_at) {
            return -1;
          } else if (a.start_at < b.start_at) {
            return 1;
          } else {
            return 0;
          }
        },
        multiple: 1,
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: t("End date"),
      className: "table-date",
      dataIndex: "end_at",
      key: "end_at",
      render: (val) => moment(val).format(t("DD MMM YYYY")),
      sorter: {
        compare: (a, b) => {
          if (a.end_at > b.end_at) {
            return -1;
          } else if (a.end_at < b.end_at) {
            return 1;
          } else {
            return 0;
          }
        },
        multiple: 1,
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: t("Responsible"),
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
            {responsive_tags.map((item) => item.title).join(", ")}
            {responsive_accounts.map(
              (acc) => `${acc.first_name} ${acc.last_name}`
            )}
          </div>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: 200,
      filters: [
        {
          text: "Not Started",
          value: "not_started",
        },
        {
          text: "In Progress",
          value: "ongoing_within_deadline",
        },
        {
          text: "Completed",
          value: "completed",
        },
        {
          text: "Past Due",
          value: "ongoing_past_deadline",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      sorter: {
        compare: (a, b) => {
          if (a.status > b.status) {
            return -1;
          } else if (a.status < b.status) {
            return 1;
          } else {
            return 0;
          }
        },
        multiple: 1,
      },
      sortDirections: ["ascend", "descend"],
      render: (val, action) => {
        return (
          <Button
            className={`${val} status-button`}
            type="button"
            shape="round"
          >
            {t(indicatorStatus[val])}
          </Button>
        );
      },
    },
  ]);

  const handleSortAndFilter = async (data) => {
    console.log(filters);
    let filter = {};
    for (let x in filters) {
      if (filters[x] !== null) {
        filter = { ...filter, [x]: filters[x] };
      }
    }
    let sort = {};
    if (Array.isArray(sorts)) {
      sorts.forEach((item) => {
        sort = { ...sort, [item.field]: item.order === "ascend" ? 1 : -1 };
      });
    } else {
      sort = { ...sort, [sorts.field]: sorts.order === "ascend" ? 1 : -1 };
    }

    console.log(filter, sort);
  };

  useEffect(() => {
    handleSortAndFilter();
  }, [sorts, filters]);

  const menu = useMemo(() => (
    <Menu>
      <Menu.Item>
        <Button
          type="dashed"
          onClick={() =>
            page ? handlePrintAll({ isPdf: true }) : handlePrint(true)
          }
        >
          <FileText size={16} /> {t("Download PDF")}
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          type="dashed"
          onClick={() => (page ? handlePrintAll() : handlePrint())}
        >
          <FileSpreadsheet size={16} /> {t("Download Excel")}
        </Button>
      </Menu.Item>
    </Menu>
  ));
  return (
    <StyledPrint ref={parentRef}>
      {/* <Dropdown overlay={menu} placement="bottomLeft" >
        <Button className="print-btn" style={{ marginLeft: 10, height: 34, ...style }}>
          <Download size={18} />
          {' '}
          {t("Download actions")}
        </Button>
      </Dropdown> */}
      <ButtonAlternative size="small" onClick={handleModal}>
        {t("Download actions")}
      </ButtonAlternative>
      <Modal
        visible={visible}
        onCancel={handleModal}
        onOk={handleModal}
        width={"80%"}
        zIndex={1050}
        getContainer={() => parentRef.current}
      >
        <Table
          columns={columns}
          dataSource={data}
          style={{ marginTop: 40 }}
          rowKey="id"
          scroll={{ x: true }}
          onChange={(pagination, filter, sort, extra) => {
            // console.log(filter, sort);
            console.log(extra);
            setFilters(filter);
            setSorts(sort);
          }}
        />
      </Modal>
    </StyledPrint>
  );
};

export default PrintToFile;
