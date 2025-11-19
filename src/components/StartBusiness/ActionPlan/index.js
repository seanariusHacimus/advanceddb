import React, {
  useRef,
  Suspense,
  lazy,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Row, Col, Button, ButtonGroup, ButtonGroupItem, PageHeader, PageHeaderTitle, PageHeaderActions } from "../../UI/shadcn";
import { useSelector, useDispatch } from "react-redux";
import { LayoutGrid, List, Plus } from "lucide-react";
import {
  ActionStatuses,
  TaskProgress,
  OverdueActions,
} from "./ActionPlanStatistics";
import ActionList from "./ActionList";
import ActionPlanEmpty from "./components/ActionPlanEmpty";
import CustomGantt from "./components/CustomGantt";
import Axios from "../../../utils/axios";
import { fetchActionPlans } from "../../../store/Actions/actions";
import { getDonutChartData } from "../../../utils/statisticsCalculator";
import Spinner from "../../UI/Spinner";
import { ActionPlanPage } from "../../../styles/startBusiness";
import Print from "../../../components/UI/Printer";
import { fetchCurrentIndicatorGroupAction } from "../../../store/SelectedIndicator/actions";
import UserRoles from "../../Members/UserRoles";
import { OVERDUE_ACTIONS } from "../../../graphql/actions";
import { useLocale } from "../../../utils/locale";
import PrintToFile from "../../UI/PrintToFile";

const CreateAction = lazy(() => import("./CreateAction/CreateAction"));

function ActionPlan({ currentIndicator, actionPermissions }) {
  const [isGanttActive, setIsGanttActive] = useState(false);
  const [newAction, setNewAction] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [printActive, setPrintActive] = useState(false);
  const [overDueTasks, setOverDueTasks] = useState([]);
  const [printSortedData, setPrintSortedData] = useState([]);

  const actionListRef = useRef();
  const ganttRef = useRef();

  const t = useLocale()[0];
  const dispatch = useDispatch();
  const selectedWorkingGroup = useSelector(
    (state) => state.selectedWorkingGroup
  );
  const actions = useSelector((state) => state.actions.data);
  const user = useSelector((state) => state.auth.account);

  const fetchOverdueActions = useCallback(async () => {
    const { id } = currentIndicator;
    if (!id) return;

    try {
      const { data } = await Axios.post("/graphql", {
        query: OVERDUE_ACTIONS,
        variables: {
          filter: {
            status: "ongoing_past_deadline",
            group_id: id,
          },
          order: {
            key: "end_at",
            direction: "asc",
          },
        },
      });

      const overDueTasksList = [];

      data.data.actions.nodes.forEach((item) => {
        const { sub_actions, ...itemData } = item;
        const overDueSubActions = sub_actions.filter(
          (i) => i.status === "ongoing_past_deadline"
        );
        overDueTasksList.push(
          { ...itemData, isParent: true },
          ...overDueSubActions
        );
      });

      setOverDueTasks(overDueTasksList);
    } catch (err) {
      console.log(err);
    }
  }, [currentIndicator]);

  useEffect(() => {
    const { id } = currentIndicator;
    if (id) {
      dispatch(fetchActionPlans(id));
      fetchOverdueActions();
    }
  }, [currentIndicator.id, dispatch, fetchOverdueActions]);

  useEffect(() => {
    const { id } = currentIndicator;
    if (selectedWorkingGroup.id && selectedWorkingGroup.id !== id) {
      dispatch(fetchActionPlans(id));
      fetchOverdueActions();
    }
  }, [
    selectedWorkingGroup.id,
    currentIndicator.id,
    dispatch,
    fetchOverdueActions,
  ]);

  const formModalHandler = useCallback(() => {
    dispatch(fetchActionPlans(selectedWorkingGroup.id));
    setNewAction((prevState) => !prevState);
  }, [selectedWorkingGroup.id, dispatch]);

  const beforePrint = useCallback(() => {
    setPrintActive(true);
  }, []);

  const afterPrint = useCallback(() => {
    setPrintActive(false);
  }, []);

  const handleUserRoles = useCallback(() => {
    setModalVisible((prevState) => !prevState);
  }, []);

  const isEmpty = actions.length === 0;

  const chartData = selectedWorkingGroup.sub_action_stats
    ? getDonutChartData(selectedWorkingGroup.action_stats)
    : [{}];
  console.log(
    "selectedWorkingGroup.action_stats",
    selectedWorkingGroup.action_stats
  );
  const fetchActionPlansForGroup = useCallback(() => {
    dispatch(fetchActionPlans(selectedWorkingGroup.id));
  }, [selectedWorkingGroup.id, dispatch]);

  const fetchCurrentWorkingGroupCallback = useCallback(() => {
    dispatch(fetchCurrentIndicatorGroupAction());
  }, [dispatch]);

  const controlSection = (
    <ActionPlanPage>
      <PageHeader>
        <PageHeaderTitle>{t("Action plan")}</PageHeaderTitle>
        <PageHeaderActions>
          {!isEmpty && (
            <ButtonGroup>
              <ButtonGroupItem
                onClick={() => setIsGanttActive(true)}
                className={isGanttActive ? "active" : ""}
                title={t("Gantt Chart")}
              >
                <LayoutGrid />
              </ButtonGroupItem>
              <ButtonGroupItem
                onClick={() => setIsGanttActive(false)}
                className={!isGanttActive ? "active" : ""}
                title={t("List View")}
              >
                <List />
              </ButtonGroupItem>
            </ButtonGroup>
          )}
          {actionPermissions.create ? (
            <Button size="sm" onClick={formModalHandler}>
              <Plus size={16} />
              {t("New Action")}
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleUserRoles}>
              <Plus size={16} />
              {t("New Action")}
              {modalVisible && <UserRoles hideModal={handleUserRoles} />}
            </Button>
          )}
          {!isEmpty && (
            <>
              <Print
                ref={isGanttActive ? ganttRef.current : actionListRef.current}
                beforePrint={beforePrint}
                afterPrint={afterPrint}
                buttonStyle={{ padding: 10, height: 34 }}
              />

              <PrintToFile
                id={currentIndicator.id}
                title={currentIndicator.title}
                printSortedData={printSortedData}
              />
            </>
          )}
        </PageHeaderActions>
      </PageHeader>
      {newAction && actionPermissions.create && (
        <Suspense fallback={<Spinner />}>
          <CreateAction
            visible={newAction}
            indicatorGroup={currentIndicator}
            modalHandler={formModalHandler}
            fetchCurrentWorkingGroup={fetchCurrentWorkingGroupCallback}
          />
        </Suspense>
      )}
    </ActionPlanPage>
  );

  if (actions.length) {
    return (
      <div>
        <div 
          className="action-statistics" 
          style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}
        >
          <ActionStatuses chartData={chartData} />
          <TaskProgress actions={actions} />
          <OverdueActions
            actions={overDueTasks}
            actionPermissions={actionPermissions}
            fetchActions={fetchActionPlansForGroup}
            fetchOverdueActions={fetchOverdueActions}
            fetchCurrentWorkingGroup={fetchCurrentWorkingGroupCallback}
            selectedWorkingGroup={selectedWorkingGroup}
          />
        </div>
        {controlSection}
        {actions.length ? (
          isGanttActive ? (
            <CustomGantt data={actions} printRef={ganttRef} />
          ) : (
            <ActionList
              printRef={actionListRef}
              setPrintSortedData={setPrintSortedData}
              actionPermissions={actionPermissions}
              data={actions}
              members={selectedWorkingGroup.members}
              fetchActions={fetchActionPlansForGroup}
              fetchOverdueActions={fetchOverdueActions}
              fetchCurrentWorkingGroup={fetchCurrentWorkingGroupCallback}
              printActive={printActive}
            />
          )
        ) : (
          <ActionPlanEmpty
            actionPermissions={actionPermissions}
            members={selectedWorkingGroup.members}
            organizations={selectedWorkingGroup.organizations}
            groupId={selectedWorkingGroup.id}
            fetchActions={fetchActionPlansForGroup}
          />
        )}
      </div>
    );
  }

  return (
    <ActionPlanEmpty
      actionPermissions={actionPermissions}
      members={selectedWorkingGroup.members}
      organizations={selectedWorkingGroup.organizations}
      groupId={selectedWorkingGroup.id}
      fetchActions={fetchActionPlansForGroup}
    >
      {controlSection}
    </ActionPlanEmpty>
  );
}

export default ActionPlan;
