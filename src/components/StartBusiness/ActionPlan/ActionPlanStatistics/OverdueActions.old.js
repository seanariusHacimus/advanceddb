import React, { useState, Suspense, lazy } from "react";
import moment from "moment-timezone";
import { Col, DropdownMenuWrapper, DropdownItem } from "../../../UI/shadcn";
import { List, Collapse, Typography } from "antd";
import { MoreVertical } from "lucide-react";
import { TitleH3, ButtonSecondary } from "../../../../styles";
import { useLocale, withLocale } from "../../../../utils/locale";
import { OverdueActionsContainer } from "./ActionPlanStatistics.style";
import { ReactComponent as IconReassign } from "../../../../assets/startBusiness/add-user.svg";

const ReassignModal = lazy(() => import("../components/ReassignModal"));

const { Panel } = Collapse;
const INITIAL_ITEMS_TO_SHOW = 3;

function OverdueActions({
  actions = [],
  actionPermissions = {},
  fetchActions,
  fetchOverdueActions,
  fetchCurrentWorkingGroup,
  selectedWorkingGroup,
}) {
  const [collapseActive, setCollapseActive] = useState(false);
  const [reassignAction, setReassignAction] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [t] = useLocale();

  const getMenuItems = (item) => {
    const canReassign = actionPermissions.update && item.status !== "completed";

    const items = [];

    if (canReassign) {
      items.push({
        key: "reassign",
        label: t("Re-assign"),
        icon: <IconReassign />,
        onClick: () => {
          setReassignAction(true);
          setSelectedAction(item);
        },
      });
    }

    return items;
  };

  if (!actions.length) {
    return null;
  }

  return (
    <Col xs={24} md={8} lg={9} className="col-3">
      <div className="inner-block">
        <div>
          <TitleH3 className="sub-title" style={{ marginBottom: 8 }}>
            {t("Overdue tasks")}
          </TitleH3>
          <OverdueActionsContainer>
            <List
              itemLayout="horizontal"
              dataSource={actions.slice(
                0,
                collapseActive ? actions.length : INITIAL_ITEMS_TO_SHOW
              )}
              className={`progress-toggle ${collapseActive ? "show" : "hide"}`}
              renderItem={(item) => {
                return (
                  <List.Item
                    key={item.id}
                    className={`overdue__item ${
                      item.isParent ? "action" : "sub-action"
                    }`}
                  >
                    <h5 className="overdue__item__date">
                      <b>{moment().diff(item.end_at, "days")}</b> days
                    </h5>
                    <Typography.Text
                      className="overdue__item__title"
                      ellipsis={{ tooltip: true }}
                    >
                      {item.name}
                    </Typography.Text>
                    <div className="overdue__item__deadline">
                      {new Date(item.end_at).toLocaleDateString()}
                    </div>
                    <div
                      className="more-action-btn-container"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuWrapper
                        align="end"
                        trigger={<MoreVertical size={16} />}
                      >
                        {getMenuItems(item).map((menuItem) => (
                          <DropdownItem
                            key={menuItem.key}
                            onClick={(e) => {
                              e.stopPropagation();
                              menuItem.onClick();
                            }}
                          >
                            {menuItem.icon}
                            {menuItem.label}
                          </DropdownItem>
                        ))}
                      </DropdownMenuWrapper>
                    </div>
                  </List.Item>
                );
              }}
            />
            <Collapse
              activeKey={[collapseActive ? "statistics" : null]}
              bordered={false}
              className="custom-collapse"
            >
              <Panel key={"statistics"} showArrow={false}>
                <List
                  itemLayout="horizontal"
                  dataSource={actions.slice(
                    INITIAL_ITEMS_TO_SHOW,
                    actions.length
                  )}
                  className={`progress-toggle`}
                  renderItem={(item) => {
                    return (
                      <List.Item
                        key={item.id}
                        className={`overdue__item ${
                          item.isParent ? "action" : "sub-action"
                        }`}
                      >
                        <h5 className="overdue__item__date">
                          <b>{moment().diff(item.end_at, "days")}</b> days
                        </h5>
                        <Typography.Text
                          // className="overdue__item__title"
                          ellipsis={{ tooltip: true }}
                        >
                          {item.name}
                        </Typography.Text>
                        <div className="overdue__item__deadline">
                          {new Date(item.end_at).toLocaleDateString()}
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuWrapper
                            align="end"
                            trigger={<MoreVertical size={16} />}
                          >
                            {getMenuItems(item).map((menuItem) => (
                              <DropdownItem
                                key={menuItem.key}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  menuItem.onClick();
                                }}
                              >
                                {menuItem.icon}
                                {menuItem.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenuWrapper>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </Panel>
            </Collapse>
            {actions.length > INITIAL_ITEMS_TO_SHOW && (
              <div className="text-center" style={{ marginTop: 10 }}>
                <ButtonSecondary
                  type="text"
                  className="transparent small"
                  style={{ width: "auto", margin: "auto", fontWeight: "400" }}
                  onClick={() => setCollapseActive((state) => !state)}
                >
                  {collapseActive ? t("Show Less") : t("Show all")}
                </ButtonSecondary>
              </div>
            )}
          </OverdueActionsContainer>
        </div>
        {reassignAction && actionPermissions.update && (
          <Suspense fallback={t("Loading...")}>
            <ReassignModal
              modalHandler={() => setReassignAction(false)}
              visible={reassignAction}
              selectedAction={selectedAction}
              fetchCurrentWorkingGroup={fetchCurrentWorkingGroup}
              fetchActionPlans={fetchActions}
              fetchOverdueActions={fetchOverdueActions}
              selectedWorkingGroup={selectedWorkingGroup}
            />
          </Suspense>
        )}
      </div>
    </Col>
  );
}

export default withLocale(OverdueActions);
