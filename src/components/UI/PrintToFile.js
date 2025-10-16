import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, message, Table, Space, Checkbox, Input } from "antd";
import Axios from "../../utils/axios";
import { FETCH_ACTIONS_AND_SUB_ACTIONS } from "../../graphql/print";
import { exportToExel, exportToPdf } from "../../utils/printer";
import { useLocale } from "../../utils/locale";
import { FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";
import { indicatorStatus } from "../../constants";
import StyledPrint from "../../styles/print";
import { unionBy } from "lodash";
import iconDownload from "../../assets/dashboard/download.svg";
import { ButtonAlternative, ButtonPrimary } from "../../styles/buttons";

const PrintToFile = ({ id, title, style, printSortedData = [], page }) => {
  const [t] = useLocale();
  const parentRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [data, setData] = useState([]);
  const [customFilter, setCustomFilter] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const allResponsibleTitles = useMemo(() => {
    let result = [];
    data.forEach((item) => {
      const { responsive_accounts, responsive_tags } = item;
      result = result
        .concat(
          responsive_tags.map((i) => ({ label: "#" + i.title, value: i.title }))
        )
        .concat(
          responsive_accounts.map((i) => ({
            label: `${i.first_name} ${i.last_name}`,
            value: i.id,
          }))
        );
    });
    return unionBy(result, "value");
  }, [data]);

  const filteredAccounts = useMemo(() => {
    console.log(query);
    if (query) {
      return allResponsibleTitles.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      return allResponsibleTitles;
    }
  });

  const fetchWorkingGroupActions = async (page) => {
    try {
      const { data } = await Axios.post("/graphql", {
        query: FETCH_ACTIONS_AND_SUB_ACTIONS,
        variables: {
          filter: {
            group_id: id,
          },
          filterSubAction: {
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
      const { actions, sub_actions } = data.data;
      console.log(sub_actions);
      let subActionByParentId = {};
      sub_actions.nodes.forEach((item) => {
        const { parent_action, ...data } = item;
        const key = item.parent_action.id;
        if (key in subActionByParentId) {
          subActionByParentId[key].push(data);
        } else {
          subActionByParentId[key] = [data];
        }
        // subActionByParentId = { ...subActionByParentId, [key]: [...subActionByParentId[key], data] };
      });
      console.log(subActionByParentId);

      const result = actions.nodes.map((item) => {
        if (item.id in subActionByParentId) {
          return {
            ...item,
            group: item.group.title,
            sub_actions: subActionByParentId[item.id],
          };
        } else {
          return {
            ...item,
            group: item.group.title,
            sub_actions: [],
          };
        }
      });

      console.log(result);
      const nestedDataWithIndex = result.map((item, index) => {
        const { sub_actions, ...data } = item;
        return [
          {
            index: index + 1,
            responsive: [
              ...item.responsive_accounts.map((i) => ({
                label: `${i.first_name} ${i.last_name}`,
                value: i.id,
              })),
              ...item.responsive_tags.map((i) => ({
                label: i.title,
                value: i.title,
              })),
            ],
            ...data,
          },
          ...sub_actions.map((i, count) => ({
            index: `${index + 1}.${count + 1}`,
            responsive: [
              ...i.responsive_accounts.map((i) => ({
                label: `${i.first_name} ${i.last_name}`,
                value: i.id,
              })),
              ...i.responsive_tags.map((i) => ({
                label: i.title,
                value: i.title,
              })),
            ],
            ...i,
            group: i.group.title,
          })),
        ];
      });
      console.log();
      setData(nestedDataWithIndex.flat());
    } catch (err) {
      console.log(err);
      message.error(t("Something went wrong"));
    }
  };

  useEffect(() => {
    setPrintData(data);
  }, [data]);

  const handleModal = () => setVisible((state) => !state);
  useEffect(() => {
    if (visible) {
      fetchWorkingGroupActions();
    }
  }, [visible]);

  const columns = useMemo(
    () => [
      {
        title: t("#"),
        dataIndex: "index",
        key: "index",
      },
      {
        title: t("Action name"),
        dataIndex: "name",
        key: "name",
        className: "action-title",
        render: (val, action, index) => {
          return (
            <div className="icons-set">
              <span className="item-title">{val.slice(0, 50)}</span>
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
        width: 160,
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
          // multiple: 1
        },
        sortDirections: ["ascend", "descend"],
      },
      {
        title: t("End date"),
        className: "table-date",
        dataIndex: "end_at",
        key: "end_at",
        width: 160,
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
          // multiple: 1,
        },
        sortDirections: ["ascend", "descend"],
      },
      {
        title: t("Responsible"),
        dataIndex: "responsive_organizations",
        key: "responsive_organizations",
        className: "table-responsible",
        width: 250,
        ellipsis: {
          showTitle: true,
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
        filterDropdown: (props) => {
          console.log(props);
          const handleChange = (val) => {
            console.log(val);
            let filteredValues = data;
            setSelectedAccounts((state) => [...new Set(state.concat(val))]);
            if (val.length) {
              setCustomFilter(true);
              filteredValues = data.filter((item) => {
                return item.responsive.some((item) => val.includes(item.value));
              });
              props.setSelectedKeys(val);
            } else {
              setCustomFilter(false);
              setSelectedAccounts([]);
              props.setSelectedKeys([]);
              setQuery("");
            }
            setPrintData(filteredValues);
          };
          return (
            <div className="custom-filter-dropdown">
              <div className="search-wrapper">
                <Input
                  onChange={(val) => setQuery(val.target.value)}
                  allowClear
                  value={query}
                  placeholder={t("Search working group")}
                />
              </div>

              <Checkbox.Group
                value={props.selectedKeys}
                options={filteredAccounts}
                onChange={handleChange}
              />

              <button style={{ marginTop: 5 }} onClick={handleChange}>
                {t("Reset")}
              </button>
            </div>
          );
        },
        onFilter: (value, record) =>
          record.responsive_accounts.find((i) => i.id === value) ||
          record.responsive_tags.find((i) => i.title === value),
      },
      {
        title: t("Status"),
        dataIndex: "status",
        key: "status",
        width: 200,
        filters: [
          {
            text: t("Not Started"),
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
          {
            text: t("Under Review"),
            value: "on_review",
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
    ],
    [data, filteredAccounts]
  );

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

  return (
    <StyledPrint ref={parentRef} style={{ marginLeft: 10, ...style }}>
      <ButtonAlternative onClick={handleModal} size="small">
        <img src={iconDownload} alt="download" style={{ marginRight: 8 }} />
        {t("Download actions")}
      </ButtonAlternative>
      <Modal
        visible={visible}
        onCancel={handleModal}
        onOk={handleModal}
        width={"80%"}
        zIndex={1050}
        getContainer={() => parentRef.current}
        footer={null}
      >
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => exportToPdf({ title, data: printData })}
          >
            <FilePdfOutlined /> {t("Download PDF")}
          </Button>
          <Button
            type="primary"
            onClick={() => exportToExel({ title, data: printData })}
          >
            <FileExcelOutlined /> {t("Download Excel")}
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={customFilter ? printData : data}
          style={{ marginTop: 40 }}
          rowKey="id"
          scroll={{ x: true }}
          onChange={(pagination, filter, sort, extra) => {
            // console.log(filter, sort);
            setPrintData(extra.currentDataSource);
            setFilters(filter);
            setSorts(sort);
          }}
          pagination={{
            pageSize: data.length,
            showTotal: (total) => total,
            hideOnSinglePage: true,
          }}
        />
      </Modal>
    </StyledPrint>
  );
};

export default PrintToFile;
