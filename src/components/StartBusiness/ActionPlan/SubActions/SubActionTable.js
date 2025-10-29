import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  Suspense,
  lazy,
} from "react";
import { useSelector } from "react-redux";
import { Table, Dropdown, Menu } from "antd";
import { DndProvider, useDrag, useDrop, createDndContext } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { MoreOutlined } from "@ant-design/icons";
import { ReactComponent as IconDelete } from "../../../../assets/reform/delete.svg";
import { ReactComponent as IconEdit } from "../../../../assets/reform/edit.svg";
import { ReactComponent as IconReassign } from "../../../../assets/startBusiness/add-user.svg";
import { subActionColumn } from "../table";
import { useLocale } from "../../../../utils/locale";

const EditSubAction = lazy(() => import("./EditSubAction"));
const ReassignModal = lazy(() => import("../components/ReassignModal"));
const ViewActionModal = lazy(() => import("../components/ViewActionModal"));
const RNDContext = createDndContext(HTML5Backend);

const type = "DragableBodyRow";

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  onDragEnd,
  ...restProps
}) => {
  const ref = React.useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward",
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{ cursor: "move", ...style }}
      {...restProps}
      onDragEnd={onDragEnd}
    />
  );
};

const DragSortingTable = (props) => {
  const [data, setData] = useState(props.data);
  const { actionPermissions, fetchCurrentWorkingGroup } = props;
  const {
    user: { id },
  } = useSelector((state) => ({ user: state.auth.account }));
  const rows = [];
  const [t] = useLocale();
  props.data.forEach((item) => {
    if (item.status === "completed") {
      return rows.push(item.id);
    }
  });

  const [editAction, setEditAction] = useState(false);
  const [selectedAction, setSelectedAction] = useState({});
  const [reassignAction, setReassignAction] = useState(false);
  const [viewAction, setViewAction] = useState(false);
  const [actionToView, setActionToView] = useState({});

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  useEffect(() => {
    if (props.onDragCancel) {
      setData(props.data);
    }
  }, [props.data, props.onDragCancel]);

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
    },
    [data]
  );

  const manager = useRef(RNDContext);

  const modalHandler = (name) => {
    setEditAction((visible) => !visible);
  };

  const reassignModalHandler = () => {
    setReassignAction((visible) => !visible);
  };

  const handleViewAction = (action) => {
    setViewAction(true);
    setActionToView(action);
  };

  const handleCloseViewModal = () => {
    setViewAction(false);
    setActionToView({});
  };

  const moreActionsBtn = {
    title: "",
    dataIndex: "",
    key: "actions",
    // fixed: 'right',
    className: "more-action-cell",
    render: (val, currentAction) =>
      Object.values(actionPermissions).some((v) => v) && (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown.Button
            className="more-action-btn"
            trigger={["click"]}
            overlay={
              <Menu className="more-action-btn-table">
                {actionPermissions.update && (
                  <Menu.Item
                    key="1"
                    onClick={() => {
                      setEditAction(true);
                      setSelectedAction(currentAction);
                    }}
                    icon={<IconEdit />}
                  >
                    {t("Edit")}
                  </Menu.Item>
                )}
                {actionPermissions.update && (
                  <Menu.Item
                    key="2"
                    onClick={() => {
                      setReassignAction(true);
                      setSelectedAction(currentAction);
                    }}
                    icon={<IconReassign />}
                  >
                    {t("Re-assign")}
                  </Menu.Item>
                )}
                {(actionPermissions.delete ||
                  currentAction.creator?.id === id) && (
                  <Menu.Item
                    key="3"
                    onClick={() => props.deleteAction(currentAction.id)}
                    icon={<IconDelete />}
                  >
                    {t("Delete")}
                  </Menu.Item>
                )}
              </Menu>
            }
            icon={<MoreOutlined />}
          />
        </div>
      ),
  };

  const columns = [
    { key: "icon", dataIndex: "icon", title: "=" },
    ...subActionColumn({
      actionPermissions,
      parentIndex: props.parentIndex,
      completeAction: props.completeAction,
      updateStatus: props.updateStatus,
      t,
      onViewAction: handleViewAction,
    }),
    moreActionsBtn,
  ];

  return (
    <DndProvider manager={manager.current.dragDropManager}>
      <Table
        columns={columns}
        className="custom-draggable-table"
        dataSource={data}
        showHeader={false}
        components={components}
        pagination={{ hideOnSinglePage: true, defaultPageSize: 20 }}
        rowKey="id"
        onRow={(record, index) => ({
          id: record.id,
          index,
          moveRow,
          className: "sub-action-row",
          onDragEnd: () => props.onDragEnd(data),
        })}
      />
      {editAction && (
        <Suspense fallback={t("Loading...")}>
          <EditSubAction
            modalHandler={modalHandler}
            visible={editAction}
            selectedAction={selectedAction}
            fetchCurrentWorkingGroup={fetchCurrentWorkingGroup}
            parentAction={props.parentAction}
          />
        </Suspense>
      )}
      {reassignAction && (
        <Suspense fallback={t("Loading...")}>
          <ReassignModal
            modalHandler={reassignModalHandler}
            visible={reassignAction}
            selectedAction={selectedAction}
            fetchCurrentWorkingGroup={fetchCurrentWorkingGroup}
            fetchActionPlans={props.fetchActionPlans}
            fetchOverdueActions={props.fetchOverdueActions}
            selectedWorkingGroup={props.selectedWorkingGroup}
          />
        </Suspense>
      )}
      {viewAction && (
        <Suspense fallback={t("Loading...")}>
          <ViewActionModal
            visible={viewAction}
            onClose={handleCloseViewModal}
            action={actionToView}
            isSubaction
            parentAction={props.parentAction}
          />
        </Suspense>
      )}
    </DndProvider>
  );
};

export default DragSortingTable;
