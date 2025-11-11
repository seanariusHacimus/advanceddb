import React, { useState, Suspense, lazy } from "react";
import moment from "moment-timezone";
import { 
  Col, 
  StatCard, 
  CardHeader, 
  CardTitle, 
  StatCardContent,
  CardFooter,
  Button,
  TaskList,
  TaskListItem,
  TaskBadge,
  TaskContent,
  TaskTitle,
  TaskMeta,
  TaskAction,
  DropdownMenuWrapper,
  DropdownItem
} from "../../../UI/shadcn";
import { ChevronDown, ChevronUp, MoreVertical, UserPlus } from "lucide-react";
import { useLocale } from "../../../../utils/locale";

const ReassignModal = lazy(() => import("../components/ReassignModal"));

const INITIAL_ITEMS_TO_SHOW = 5;

function OverdueActions({
  actions = [],
  actionPermissions = {},
  fetchActions,
  fetchOverdueActions,
  fetchCurrentWorkingGroup,
  selectedWorkingGroup,
}) {
  const [showAll, setShowAll] = useState(false);
  const [reassignAction, setReassignAction] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [t] = useLocale();

  const displayedActions = showAll ? actions : actions.slice(0, INITIAL_ITEMS_TO_SHOW);
  const hasMore = actions.length > INITIAL_ITEMS_TO_SHOW;

  const getMenuItems = (item) => {
    const canReassign = actionPermissions.update && item.status !== "completed";

    const items = [];

    if (canReassign) {
      items.push({
        key: "reassign",
        label: t("Re-assign"),
        icon: <UserPlus size={16} />,
        onClick: () => {
          setReassignAction(true);
          setSelectedAction(item);
        },
      });
    }

    return items;
  };

  const getDaysOverdue = (endDate) => {
    return Math.abs(moment().diff(endDate, "days"));
  };

  if (!actions.length) {
    return null;
  }

  return (
    <Col xs={24} md={8} lg={9}>
      <StatCard>
        <CardHeader>
          <CardTitle>{t("Overdue tasks")}</CardTitle>
        </CardHeader>
        <StatCardContent style={{ padding: 0 }}>
          <TaskList>
            {displayedActions.map((item) => {
              const daysOverdue = getDaysOverdue(item.end_at);
              const menuItems = getMenuItems(item);

              return (
                <TaskListItem key={item.id}>
                  <TaskBadge variant="danger">
                    {daysOverdue} {t("days")}
                  </TaskBadge>
                  <TaskContent>
                    <TaskTitle title={item.name}>{item.name}</TaskTitle>
                    <TaskMeta>
                      {item.isParent ? t("Action") : t("Sub-action")} • 
                      {t("Due")}: {moment(item.end_at).format("MMM D, YYYY")}
                    </TaskMeta>
                  </TaskContent>
                  {menuItems.length > 0 && (
                    <TaskAction>
                      <DropdownMenuWrapper
                        trigger={
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={16} />
                          </Button>
                        }
                        items={menuItems}
                      />
                    </TaskAction>
                  )}
                </TaskListItem>
              );
            })}
          </TaskList>
        </StatCardContent>
        {hasMore && (
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              style={{ width: '100%' }}
            >
              {showAll ? (
                <>
                  <ChevronUp size={16} />
                  {t("Show less")}
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  {t("Show all")} ({actions.length - INITIAL_ITEMS_TO_SHOW} {t("more")})
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </StatCard>

      {reassignAction && (
        <Suspense fallback={<div>Loading...</div>}>
          <ReassignModal
            visible={reassignAction}
            onClose={() => {
              setReassignAction(false);
              setSelectedAction(null);
            }}
            action={selectedAction}
            fetchActions={fetchActions}
            fetchOverdueActions={fetchOverdueActions}
            fetchCurrentWorkingGroup={fetchCurrentWorkingGroup}
            selectedWorkingGroup={selectedWorkingGroup}
          />
        </Suspense>
      )}
    </Col>
  );
}

export default OverdueActions;

