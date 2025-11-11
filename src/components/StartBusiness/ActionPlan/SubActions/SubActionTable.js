import React, {
  useState,
  useCallback,
  useEffect,
  Suspense,
  lazy,
} from "react";
import { useSelector } from "react-redux";
import { 
  SubActionsContainer, 
  SubActionCardItem,
  AddSubActionContainer,
  DropdownMenuWrapper, 
  DropdownItem,
  Badge
} from "../../../UI/shadcn";
import { MoreVertical } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import { ReactComponent as IconDelete } from "../../../../assets/reform/delete.svg";
import { ReactComponent as IconEdit } from "../../../../assets/reform/edit.svg";
import { ReactComponent as IconReassign } from "../../../../assets/startBusiness/add-user.svg";
import { useLocale } from "../../../../utils/locale";

const EditSubAction = lazy(() => import("./EditSubAction"));
const ReassignModal = lazy(() => import("../components/ReassignModal"));
const ViewActionModal = lazy(() => import("../components/ViewActionModal"));

// Drag and drop type constant
const SUBACTION_TYPE = "DragableSubAction";

// Helper function to get status variant
const getStatusVariant = (status) => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'ongoing_within_deadline':
      return 'warning';
    case 'ongoing_past_deadline':
      return 'destructive';
    case 'not_started':
      return 'secondary';
    case 'on_review':
      return 'outline';
    default:
      return 'secondary';
  }
};

// Draggable Sub-Action Card Component
const DraggableSubActionCard = ({ 
  subAction, 
  index, 
  moveRow, 
  onDragEnd,
  parentIndex,
  onViewAction,
  renderStatus,
  renderActions,
  t 
}) => {
  const dragItem = { type: "DragableSubAction", index };
  
  const [{ isDragging }, drag] = useDrag({
    type: "DragableSubAction",
    item: dragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: onDragEnd,
  });

  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: "DragableSubAction",
    collect: (monitor) => {
      const item = monitor.getItem();
      if (!item || item.index === index) return {};
      
      return {
        isOver: monitor.isOver(),
        dropClassName: item.index < index ? 'drop-over-downward' : 'drop-over-upward',
      };
    },
    drop: (item) => {
      if (item && item.index !== undefined) {
        moveRow(item.index, index);
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))}>
      <SubActionCardItem
        subAction={subAction}
        index={index}
        parentIndex={parentIndex}
        onViewAction={onViewAction}
        isDragging={isDragging}
        dropClassName={dropClassName}
        status={renderStatus(subAction)}
        actions={renderActions(subAction)}
        t={t}
      />
    </div>
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

  const renderActions = (currentAction) => {
    if (!Object.values(actionPermissions).some((v) => v)) return null;

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenuWrapper
          align="end"
          trigger={<MoreVertical size={16} />}
        >
          {actionPermissions.update && (
            <DropdownItem
              onClick={(e) => {
                e.stopPropagation();
                setEditAction(true);
                setSelectedAction(currentAction);
              }}
            >
              <IconEdit />
              {t("Edit")}
            </DropdownItem>
          )}
          {actionPermissions.update && (
            <DropdownItem
              onClick={(e) => {
                e.stopPropagation();
                setReassignAction(true);
                setSelectedAction(currentAction);
              }}
            >
              <IconReassign />
              {t("Re-assign")}
            </DropdownItem>
          )}
          {(actionPermissions.delete || currentAction.creator?.id === id) && (
            <DropdownItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                props.deleteAction(currentAction.id);
              }}
            >
              <IconDelete />
              {t("Delete")}
            </DropdownItem>
          )}
        </DropdownMenuWrapper>
      </div>
    );
  };

  const renderStatus = (subAction) => {
    return (
      <Badge variant={getStatusVariant(subAction.status)}>
        {t(subAction.status)}
      </Badge>
    );
  };

  return (
    <>
      <SubActionsContainer>
        {data.map((subAction, index) => (
          <div 
            key={subAction.id}
            style={{ marginBottom: index < data.length - 1 ? '8px' : '0' }}
          >
            <DraggableSubActionCard
              subAction={subAction}
              index={index}
              moveRow={moveRow}
              onDragEnd={() => props.onDragEnd(data)}
              parentIndex={props.parentIndex}
              onViewAction={handleViewAction}
              renderStatus={renderStatus}
              renderActions={renderActions}
              t={t}
            />
          </div>
        ))}
      </SubActionsContainer>
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
    </>
  );
};

export default DragSortingTable;
