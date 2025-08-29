import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FETCH_AUDIT_LOGS } from '../../graphql/audit';
import Axios from '../../utils/axios';
import { Table, Modal, Select, Dropdown, Button, Checkbox } from 'antd';
import { useLocale } from '../../utils/locale';
import defaultUserImage from '../../assets/startBusiness/user.svg';
import StyledAudit from '../../styles/audit';
import { ArrowRightOutlined, InboxOutlined, SettingOutlined } from '@ant-design/icons';

export default function Audit() {
  const [data, setData] = useState([{
    id: 1,
    created_at: new Date(),
    name: "Test data",
    event: "Action deleted",
    event_description: "Something bad happened",
    initiator: {
      first_name: "Antuan",
      last_name: "Bekko",
      photo: ''
    },
    location: "Jizzax"
  }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(JSON.parse(window.localStorage.getItem('auditColumns')) || ["created_at", 'initiator', 'location']);
  const [pagination, setPagination] = useState({ page: 1, total: 0, size: 10 });
  const parentRef = useRef('');
  const [selectedData, setSelectedData] = useState({ previous_data: {}, committed_data: {} });
  const [t] = useLocale();
  const [filters, setFilters] = useState([
    {
      id: "created_at",
      title: t("Created date"),
      value: true,
    },

    {
      id: "event",
      title: t("Event"),
      value: true,
    },
    {
      id: "event_description",
      title: t("Event description"),
      value: true,
    },
    {
      id: "initiator",
      title: t("Creator"),
      value: true,
    },
    {
      id: "location",
      title: t("Location"),
      value: true,
    },
  ]);

  useEffect(() => {
    handlePage();
  }, []);

  const handlePage = async (page, size = 10) => {
    try {
      const res = await Axios.post('/graphql', {
        query: FETCH_AUDIT_LOGS,
        variables: {
          pagination: {
            size,
            page
          }
        },
      });
      console.log(res)
      if (res?.data) {
        const { action_logs: { nodes, page, size, total } } = res.data.data;
        setData(nodes)
        setPagination({ page: parseInt(page), total, size });
      }
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
    }
  }

  const columnList = [
    {
      dataIndex: "created_at",
      title: t("Created date"),
      render: val => new Date(val).toLocaleString(),
    },
    {
      dataIndex: "event",
      title: t("Event"),
    },
    {
      dataIndex: "event_description",
      title: t("Event description"),
    },
    {
      dataIndex: "initiator",
      title: t("Creator"),
      render: (val, record, item) => {
        const user = record.initiator;
        return (
          <div>
            <img className="user-image" src={user?.photo?.url || defaultUserImage} alt="" />
            {`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
          </div>
        )
      },
    },
    {
      dataIndex: "location",
      title: t("Location"),
      render: (val, record, item) => record.location,
    },

  ];

  const handleModalVisibility = useCallback((event, item = {}) => {
    setModalVisible(state => !state);
    setSelectedData(item);
  }, [modalVisible]);

  function findModifiedData() {
    let result = {};
    const { committed_data, previous_data } = selectedData;
    const skipableValue = ['updated_at', 'almost_expired_notified_at', 'completed_at', 'deleted_at', 'completer_id', 'creator_id', 'created_at', 'parent_action_id', 'number', 'id', 'group_id', 'expired_notified_at'];
    for (let x in committed_data) {
      if (!skipableValue.includes(x)) {

        const currentResponsiveTags = committed_data?.responsive_tags?.sort()?.join(', ');
        const previouseResponsiveTags = previous_data?.responsive_tags?.sort()?.join(', ');
        console.log(currentResponsiveTags, previouseResponsiveTags)
        if (x === 'responsive_tags') {
          if (currentResponsiveTags !== previouseResponsiveTags) {
            result = {
              ...result,
              [x]: {
                currentValue: currentResponsiveTags,
                name: x,
                oldValue: previouseResponsiveTags
              }
            }
          }
        } else if (committed_data?.[x] !== previous_data?.[x]) {
          result = {
            ...result,
            [x]: {
              currentValue: committed_data?.[x],
              name: x,
              oldValue: previous_data?.[x]
            }
          }
        }

      }
    }
    console.log(result);
    return result;
  }

  function handleSelectedFilters(value) {
    setSelectedFilters(value);
    window.localStorage.setItem('auditColumns', JSON.stringify(value));
  }
  const displayData = useMemo(() => findModifiedData(), [selectedData]);
  console.log(selectedFilters)

  const columns = useMemo(() => columnList.filter(item => selectedFilters.includes(item.dataIndex)), [selectedFilters]);
  console.log(columns)
  return (
    <StyledAudit ref={parentRef} style={{ position: 'relative' }}>
      <h1>{t("Audit logs")}</h1>

      <div className="filter-wrapper">
        <Button className="more-actions"><SettingOutlined /></Button>
        <Checkbox.Group value={selectedFilters} onChange={handleSelectedFilters}>
          {
            filters.map(item => {
              return (
                <div key={item.id}>
                  <Checkbox style={{ width: '100%', margin: '5px 0' }} value={item.id}>{item.title}</Checkbox>
                </div>
              )
            })
          }
        </Checkbox.Group>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        rowClassName="clickable"
        onRow={(record, index) => {
          const { previous_data, committed_data } = record;
          return {
            onClick: event => handleModalVisibility(event, { previous_data, committed_data }),
          }
        }}
        pagination={{
          hideOnSinglePage: false,
          pageSize: pagination.size,
          current: pagination.page,
          total: pagination.total,
          showSizeChanger: true,
          showSizeChangerOptions: {},
          onChange: (page, size) => handlePage(page, size),
          pageSizeOptions: [10, 20, 30, 50],
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
      />
      <Modal
        visible={modalVisible}
        onCancel={handleModalVisibility}
        onOk={handleModalVisibility}
        getContainer={el => parentRef.current}
        footer={null}
      >
        <h2>{t('Summary')}</h2>

        <ul>
          {
            Object.values(displayData).length ? Object.values(displayData).map((item, index) => {
              if (item.currentValue || item.oldValue) {
                return (
                  <li key={index}>
                    {item.name}:
                    <span className="deleted">{JSON.stringify(item.oldValue) || " "}</span>
                    <ArrowRightOutlined className={`arrow ${item.currentValue ? 'arrow-added' : 'arrow-deleted'}`} />
                    <span className="added">{JSON.stringify(item.currentValue) || " "}</span>
                  </li>
                )
              }
              return null
            })
              :
              <div className="text-center" style={{ marginLeft: -40, marginTop: 12 }}>
                <InboxOutlined size={50} style={{ fontSize: 50 }} />
                <h3>{t("No changes")}</h3>
              </div>
          }
        </ul>
      </Modal>
    </StyledAudit>
  )
}
