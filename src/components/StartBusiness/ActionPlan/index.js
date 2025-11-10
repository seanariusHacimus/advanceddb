import React, {
  useRef,
  Suspense,
  lazy,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Row, Col } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Flex, TitleH3 } from "../../../styles";
import { Button } from "../../UI/shadcn";
import {
  ActionStatuses,
  TaskProgress,
  OverdueActions,
} from "./ActionPlanStatistics";
import ActionList from "./ActionList";
import ActionPlanEmpty from "./components/ActionPlanEmpty";
import Frappe from "./components/Frappe";
import Axios from "../../../utils/axios";
import { fetchActionPlans } from "../../../store/Actions/actions";
import { getDonutChartData } from "../../../utils/statisticsCalculator";
import iconAddSubaction from "../../../assets/startBusiness/add-primary.svg";
import iconList2 from "../../../assets/startBusiness/list-2.svg";
import iconGantt from "../../../assets/startBusiness/gantt.svg";
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
  const [collapseActive, setCollapseActive] = useState(false);
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
      <Flex margin="30px 0 20px" className="action-btn-group">
        <TitleH3>{t("Action plan")}</TitleH3>
        {!isEmpty && (
          <>
            <Button
              style={{ marginLeft: "auto" }}
              onClick={() => setIsGanttActive(true)}
              title={t("Gantt Chart")}
              className={`small list-btn transparent ${
                isGanttActive && "active"
              }`}
            >
              <img src={iconGantt} alt={t("show ganttchart")} />
            </Button>
            <Button
              onClick={() => setIsGanttActive(false)}
              className={`small list-btn transparent ${
                !isGanttActive && "active"
              }`}
            >
              <img src={iconList2} alt={t("add subaction")} />
            </Button>
          </>
        )}
        {actionPermissions.create ? (
          <Button
            style={{ marginLeft: isEmpty ? "auto" : "initial" }}
            size="sm"
            onClick={formModalHandler}
          >
            <img src={iconAddSubaction} alt={t("add subaction")} style={{ marginRight: '8px', width: '16px', height: '16px' }} />
            {t("New Action")}
          </Button>
        ) : (
          <Button
            style={{ marginLeft: isEmpty ? "auto" : "initial" }}
            size="sm"
            variant="outline"
            onClick={handleUserRoles}
          >
            <img src={iconAddSubaction} alt={t("add subaction")} style={{ marginRight: '8px', width: '16px', height: '16px' }} />
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
              style={{ marginLeft: 10 }}
              buttonStyle={{ padding: 10, height: 34 }}
            />

            <PrintToFile
              id={currentIndicator.id}
              title={currentIndicator.title}
              printSortedData={printSortedData}
            />
          </>
        )}
      </Flex>
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
        <Row className="action-statistics" gutter={[20, 20]}>
          <ActionStatuses chartData={chartData} showLabels={false} />
          <TaskProgress
            actions={actions}
            collapseActive={collapseActive}
            onToggleCollapse={() =>
              setCollapseActive((prevState) => !prevState)
            }
          />
          <OverdueActions
            actions={overDueTasks}
            actionPermissions={actionPermissions}
            fetchActions={fetchActionPlansForGroup}
            fetchOverdueActions={fetchOverdueActions}
            fetchCurrentWorkingGroup={fetchCurrentWorkingGroupCallback}
            selectedWorkingGroup={selectedWorkingGroup}
          />
        </Row>
        {controlSection}
        {actions.length ? (
          isGanttActive ? (
            <Frappe data={actions} printRef={ganttRef} />
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
