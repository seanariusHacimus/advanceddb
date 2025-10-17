import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Table, Menu, Dropdown, Popconfirm, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import scrollIntoView from "scroll-into-view";

import { withRouter } from "react-router-dom";
import { ReactComponent as IconChevronDown } from "../../../assets/startBusiness/chevron-down.svg";
import { ReactComponent as IconChevronUp } from "../../../assets/startBusiness/chevron-up.svg";
import { ActionTablePage } from "../../../styles/startBusiness";
import { ReactComponent as IconDelete } from "../../../assets/reform/delete.svg";
import { ReactComponent as IconEdit } from "../../../assets/reform/edit.svg";
import { fetchCurrentIndicatorGroupAction } from "../../../store/SelectedIndicator/actions";
import { ButtonPrimary, ButtonSecondary, TitleH3, Flex } from "../../../styles";
import iconAddSubaction from "../../../assets/startBusiness/add.svg";
import {
  DELETE_ACTION,
  COMPLETE_ACTION,
  UNCOMPLETE_ACTION,
} from "../../../graphql/actions";
import getQuery from "./queryGenerator";
import { columns } from "./table";
import SubActionTable from "./SubActionTable";
import Axios from "../../../utils/axios";
import { fetchActionPlans } from "../../../store/Actions/actions";
import { ErrorAlerts, notEmptyErrorConfig, parseErrors } from "../../../utils";
import { withLocale } from "../../../utils/locale";
import { toast } from "react-toastify";
import { ButtonAlternative } from "../../../styles/buttons";

const EditActionPlan = lazy(() => import("./EditActionPlan"));
const AddSubAction = lazy(() => import("./AddSubAction"));

const errorsConfig = {
  action_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false,
    },
  },
};
class ActionList extends Component {
  constructor(props) {
    super(props);

    this.defaultPageSize = 10;
    this.state = {
      alerts: [],
      onDragEndActive: false,
      editAction: false,
      selectedAction: {},
      parentAction: {},
      addSubAction: false,
      isDragCanceled: true,
      isScrolled: false,
      currentPage: 1,
      expandedActions: [],
      scrollTo: "",
      collapseActive: false,
    };
  }

  componentDidUpdate() {
    const queryParams = new URLSearchParams(window.location.search);
    this.autoScroll(queryParams.get("scroll_to_action"));
  }

  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    this.autoScroll(queryParams.get("scroll_to_action"));
  }

  showModal = (name) => {
    this.setState({ [name]: true });
  };

  hideModal = (name) => {
    this.setState({ [name]: false });
  };

  onDragEnd = (list) => {
    const data = list.map((item, index) => ({ id: item.id, number: index }));
    if (data.length > 1) {
      this.setState({
        onDragEndActive: true,
        dragList: data,
        isDragCanceled: false,
      });
    }
  };

  formModalhandler = () => {
    this.props.fetchActionPlans(this.props.selectedWorkingGroup.id);
    this.setState((prevState) => ({ editAction: !prevState.editAction }));
  };

  subActionFormModalhandler = () => {
    this.props.fetchActionPlans(this.props.selectedWorkingGroup.id);
    this.setState((prevState) => ({ addSubAction: !prevState.addSubAction }));
  };

  cancelDraggedRow = () => {
    this.setState({ onDragEndActive: false, isDragCanceled: true });
  };

  saveDraggedRow = async () => {
    this.setState({ onDragEndActive: false });
    const query = `mutation($action: UpdateActionInput!, $action_id: Uuid!) {${getQuery(
      this.state.dragList
    )}}`;
    try {
      const res = await Axios.post("/graphql", {
        query,
      });
      if (res?.data) {
        // const { id } = this.props.selectedWorkingGroup;
        // this.props.fetchActionPlans(id);
        // console.log('started');
        // this.props.fetchCurrentWorkingGroup();
      }
    } catch (err) {
      console.log(err);
    }
  };

  updateStatus = async (event, id, status) => {
    event.stopPropagation();
    const { t } = this.props;
    this.setState({ alerts: [] });

    let query = {};
    if (status === "completed") {
      query = {
        query: UNCOMPLETE_ACTION,
        variables: {
          action_id: id,
        },
      };
    } else {
      query = {
        query: COMPLETE_ACTION,
        variables: {
          action_id: id,
        },
      };
    }

    try {
      const res = await Axios.post("/graphql", query);
      if (res?.data) {
        const { id } = this.props.selectedWorkingGroup;
        this.props.fetchActionPlans(id);
        this.props.fetchCurrentWorkingGroup();
        this.props.fetchOverdueActions();
      }
    } catch (err) {
      if (err.message.includes("422")) {
        const { alerts } = parseErrors(
          errorsConfig,
          err.response.data.errors[0].extensions?.validation?.actions?.find(
            (a) => a
          )
        );
        this.setState({ alerts });
      }
      this.setState({ loading: false });
    }
  };

  completeAction = async (id) => {
    this.setState({ alerts: [] });
    try {
      const res = await Axios.post("/graphql", {
        query: COMPLETE_ACTION,
        variables: {
          action_id: id,
        },
      });

      if (res?.data) {
        const { id } = this.props.selectedWorkingGroup;
        this.props.fetchActionPlans(id);
        this.props.fetchCurrentWorkingGroup();
        this.props.fetchOverdueActions();
      }
    } catch (err) {
      if (err.message.includes("422")) {
        const { alerts } = parseErrors(
          errorsConfig,
          err.response.data.errors[0].extensions?.validation
        );
        this.setState({ alerts });
      }
      this.setState({ loading: false });
    }
  };

  uncompleteAction = async (id) => {
    this.setState({ alerts: [] });
    try {
      const res = await Axios.post("/graphql", {
        query: UNCOMPLETE_ACTION,
        variables: {
          action_id: id,
        },
      });

      if (res?.data) {
        const { id } = this.props.selectedWorkingGroup;
        this.props.fetchActionPlans(id);
        this.props.fetchCurrentWorkingGroup();
        this.props.fetchOverdueActions();
      }
    } catch (err) {
      if (err.message.includes("422")) {
        const { alerts } = parseErrors(
          errorsConfig,
          err.response.data.errors[0].extensions?.validation
        );
        this.setState({ alerts });
      }
      this.setState({ loading: false });
    }
  };

  setPage(currentPage) {
    this.setState({ currentPage });
  }

  setScrollTo(scrollTo) {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("scroll_to_action", scrollTo);
    this.props.history.push(`?${queryParams.toString()}`);
    this.setState({ scrollTo });
  }

  expandAction(actionId) {
    this.setState((state) => ({
      expandedActions: [
        ...state.expandedActions.filter((id) => id !== actionId),
        actionId,
      ],
    }));
  }

  unexpandAction(actionId) {
    this.setState((state) => ({
      expandedActions: [
        ...state.expandedActions.filter((id) => id !== actionId),
      ],
    }));
  }

  deleteAction = async (id) => {
    const { t } = this.props;
    try {
      const res = await Axios.post("/graphql", {
        query: DELETE_ACTION,
        variables: {
          action_id: id,
        },
      });
      if (res?.data) {
        const { id } = this.props.selectedWorkingGroup;
        this.props.fetchCurrentIndicatorGroupAction();
        this.props.fetchActionPlans(id);
        toast.success(t("The action has been deleted successfully"));
        this.props.fetchOverdueActions();
      }
    } catch (err) {
      if (err.message.includes("422")) {
        const { alerts } = parseErrors(
          errorsConfig,
          err.response.data.errors[0].extensions?.validation
        );
        this.setState({ alerts });
      }
    }
  };

  calculatePageOfAction(actionId) {
    const indexOfAction = this.props.actions
      .map((action) => action.id)
      .indexOf(actionId);
    return (
      Math.floor(
        (indexOfAction !== -1 ? indexOfAction : 0) / this.defaultPageSize
      ) + 1
    );
  }

  findParentAction(actionId) {
    return this.props.actions.find((action) => {
      if (
        action.id === actionId ||
        action.sub_actions.some((action) => (action.id = actionId))
      )
        if (action.id === actionId) return true;
      return action.sub_actions.some((action) => {
        if (action.id === actionId) return (action.id = actionId);
      });
    });
  }

  autoScroll(newScrollTo) {
    const { scrollTo, expandedActions, currentPage } = this.state;
    const { actions } = this.props;
    if (scrollTo !== newScrollTo) {
      if (newScrollTo && actions.length !== 0) {
        const parentAction = this.findParentAction(newScrollTo);
        if (parentAction) {
          const page = this.calculatePageOfAction(parentAction.id);
          const isActionExpanded =
            expandedActions.indexOf(parentAction.id) !== -1;
          if (currentPage !== page) {
            this.setPage(page);
          } else if (isActionExpanded) {
            this.setScrollTo(newScrollTo);
            scrollIntoView(document.getElementById(newScrollTo), {});
          } else {
            this.expandAction(parentAction.id);
          }
        }
      }
    }
  }

  render() {
    const {
      onDragEndActive,
      collapseActive,
      isDragCanceled,
      editAction,
      parentAction,
      selectedAction,
      addSubAction,
      currentPage,
      expandedActions,
      alerts,
    } = this.state;
    const {
      actions,
      fetchActions,
      members,
      actionPermissions,
      printActive,
      user,
    } = this.props;
    const { t } = this.props;
    const moreActionsBtn = {
      title: "",
      dataIndex: "",
      key: "actions",
      className: "more-action-cell",
      render: (val, props) => {
        const { t } = this.props;
        return (
          Object.values(actionPermissions).some((v) => v) && (
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown.Button
                className="more-action-btn"
                trigger={["click"]}
                getPopupContainer={(trigger) => trigger.parentNode}
                onClick={(e) => e.stopPropagation()}
                overlay={
                  <Menu className="more-action-btn-table">
                    {actionPermissions.update && (
                      <Menu.Item
                        key="1"
                        onClick={() =>
                          this.setState({
                            selectedAction: props,
                            editAction: true,
                          })
                        }
                        icon={<IconEdit />}
                      >
                        {t("Edit")}
                      </Menu.Item>
                    )}

                    {(actionPermissions.delete ||
                      props.creator?.id === user.id) && (
                      <Popconfirm
                        disabled={!actionPermissions.complete}
                        overlayClassName="actions-popconfirm"
                        title={
                          <div>
                            <h3>{t("Delete the action")}</h3>
                            <p>
                              {t(
                                "When you delete the action you can not restore it later."
                              )}
                            </p>
                          </div>
                        }
                        onConfirm={(e) => {
                          e.stopPropagation();
                          this.deleteAction(props.id);
                        }}
                        onCancel={(e) => e.stopPropagation()}
                        okText={t("Confirm")}
                        cancelText={t("Cancel")}
                        icon={null}
                      >
                        <Menu.Item key="delete" icon={<IconDelete />}>
                          {t("Delete")}
                        </Menu.Item>
                      </Popconfirm>
                    )}
                  </Menu>
                }
                icon={<MoreOutlined />}
              />
            </div>
          )
        );
      },
    };
    return (
      <ActionTablePage ref={this.props.printRef}>
        <div className="inner-block">
          <ErrorAlerts alerts={alerts} />
          <Table
            expandedRowKeys={
              printActive ? actions.map((i) => i.id) : expandedActions
            }
            onExpand={(expanded, action) => {
              if (expanded) {
                this.expandAction(action.id);
              } else {
                this.unexpandAction(action.id);
              }
            }}
            dataSource={actions.slice(
              0,
              printActive
                ? actions.length
                : collapseActive
                ? actions.length
                : this.defaultPageSize
            )}
            onRow={(action) => ({
              id: action.id,
            })}
            columns={[
              ...columns(
                {
                  actionPermissions,
                  currentPage,
                  updateStatus: this.updateStatus,
                  uncompleteAction: this.uncompleteAction,
                  completeAction: this.completeAction,
                  t,
                },
                this
              ),
              moreActionsBtn,
            ]}
            scroll={{ x: true }}
            pagination={false}
            className="custom-table"
            rowKey="id"
            rowClassName="custom-table-row"
            expandable={{
              expandRowByClick: true,
              expandedRowClassName: () => "custom-table-expanded-row",
              // rowExpandable: record => record.sub_actions.length > 0,
              expandIcon: ({ expanded, onExpand, record }) => {
                if (
                  !(actionPermissions.create || record.sub_actions.length > 0)
                )
                  return null;
                return expanded ? (
                  <IconChevronUp onClick={(e) => onExpand(record, e)} />
                ) : (
                  <IconChevronDown onClick={(e) => onExpand(record, e)} />
                );
              },
              indentSize: 0,
              expandedRowRender: (item, index) =>
                item.sub_actions.length ? (
                  <>
                    <SubActionTable
                      key={item.id}
                      onDragEnd={this.onDragEnd}
                      onDragCancel={isDragCanceled}
                      originalData={item.sub_actions.sort(
                        (a, b) => a.number - b.number
                      )}
                      parentIndex={index}
                      members={members}
                      data={item.sub_actions.sort(
                        (a, b) => a.number - b.number
                      )}
                      parentAction={item}
                      fetchActions={fetchActions}
                      deleteAction={this.deleteAction}
                      updateStatus={this.updateStatus}
                      actionPermissions={actionPermissions}
                      fetchCurrentWorkingGroup={
                        this.props.fetchCurrentIndicatorGroupAction
                      }
                    />
                    {actionPermissions.create && (
                      <div className="text-right sub-action-wrapper">
                        <button
                          type="button"
                          className="add-subaction-btn"
                          onClick={() =>
                            this.setState({
                              addSubAction: true,
                              parentAction: item,
                            })
                          }
                        >
                          <img src={iconAddSubaction} alt="add subaction" />
                          {t("Add subaction")}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  actionPermissions.create && (
                    <div className="text-right sub-action-wrapper">
                      <button
                        type="button"
                        className="add-subaction-btn"
                        onClick={() =>
                          this.setState({
                            addSubAction: true,
                            parentAction: item,
                          })
                        }
                      >
                        <img src={iconAddSubaction} alt="add subaction" />{" "}
                        {t("Add subaction")}
                      </button>
                    </div>
                  )
                ),
            }}
          />
          {actions.length > this.defaultPageSize && (
            <div className="text-center" style={{ marginTop: 25 }}>
              <ButtonSecondary
                className="transparent small"
                style={{ width: "auto", margin: "auto", fontWeight: "400" }}
                type="text"
                onClick={() =>
                  this.setState((prevState) => ({
                    collapseActive: !prevState.collapseActive,
                  }))
                }
              >
                {collapseActive ? t("Show Less") : t("Show all")}
              </ButtonSecondary>
            </div>
          )}
          {onDragEndActive && (
            <Flex id="dragable-move">
              <TitleH3 color="#fff">
                {t("Are you sure you want to save the result?")}
              </TitleH3>
              <ButtonSecondary
                className="medium cancel"
                onClick={this.cancelDraggedRow}
              >
                {t("Cancel")}
              </ButtonSecondary>
              <ButtonPrimary className="medium" onClick={this.saveDraggedRow}>
                {t("Save")}
              </ButtonPrimary>
            </Flex>
          )}

          {editAction && actionPermissions.update && (
            <Suspense fallback={t("Loading...")}>
              <EditActionPlan
                modalHandler={this.formModalhandler}
                visible={editAction}
                selectedAction={selectedAction}
                fetchCurrentWorkingGroup={
                  this.props.fetchCurrentIndicatorGroupAction
                }
              />
            </Suspense>
          )}
          {addSubAction && actionPermissions.create && (
            <Suspense fallback={t("Loading...")}>
              <AddSubAction
                modalHandler={this.subActionFormModalhandler}
                visible={addSubAction}
                parentAction={parentAction}
                fetchCurrentWorkingGroup={
                  this.props.fetchCurrentIndicatorGroupAction
                }
              />
            </Suspense>
          )}
        </div>
      </ActionTablePage>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.account,
  actions: state.actions.data,
  selectedWorkingGroup: state.selectedWorkingGroup,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { fetchActionPlans, fetchCurrentIndicatorGroupAction },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withLocale(ActionList)));
