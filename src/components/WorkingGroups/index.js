import { Component, Suspense, lazy } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Popconfirm, DropdownMenuWrapper, DropdownItem } from "../UI/shadcn";
import { MoreVertical } from "lucide-react";
import { useToast } from "../UI/shadcn/toast";
import { Dropdown, Menu } from "antd";
import Axios from "../../utils/axios";
import { StyledWorkingGroup } from "../../styles/workingGroup";
import {
  UPDATE_WORKING_GROUP,
  DELETE_WORKING_GROUP,
} from "../../graphql/workingGroups";
import { TitleH1, Flex, ButtonPrimary } from "../../styles";
import CustomizeDashboardReports from "../Dashboard/CustomizeDashboardReports";
// ----------------- ASSETS & STYLE -----------------
import { ReactComponent as IconEdit } from "../../assets/reform/edit.svg";
import { ReactComponent as IconDelete } from "../../assets/indicator/delete.svg";
import { fetchWorkingGroupsAction } from "../../store/WorkingGroups/actions";
import { ReactComponent as IconWGadd } from "../../assets/indicator/add.svg";
import DraggableList from "./WorkingGroupList";
import NewWorkingGroup from "./NewWorkingGroup";

import { columns } from "./table";
import { withLocale } from "../../utils/locale";
import { USER_ROLES } from "../../constants/userRoles";

const EditWorkingGroup = lazy(() => import("./EditWorkingGroup"));

class WorkingGroupList extends Component {
  state = {
    groups: [],
    loading: true,
    selectedItem: {},
    edit: false,
    newGroup: false,
  };

  async componentDidMount() {
    this.props.fetchWorkingGroupsAction();
  }

  modalHandler = () => {
    this.setState((prevState) => ({ edit: !prevState.edit }));
  };

  handleNewGroupModal = () => {
    this.setState((prevState) => ({ newGroup: !prevState.newGroup }));
  };

  updateWorkingGroupStatus = async (id, sidebar_visible) => {
    const request = {
      query: UPDATE_WORKING_GROUP,
      variables: {
        group: {
          sidebar_visible,
        },
        id,
      },
    };
    try {
      await Axios.post("/graphql", request);
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
    } finally {
      this.props.fetchWorkingGroupsAction();
    }
  };

  updateWorkingGroupTitle = async (id, title) => {
    const { t, toast } = this.props;
    const query = {
      query: UPDATE_WORKING_GROUP,
      variables: {
        group: {
          title,
        },
        id,
      },
    };

    try {
      const res = await Axios.post("/graphql", query);
      console.log(res);
      if (res?.data) {
        if (res?.data) {
          toast?.success({
            title: t("Success"),
            description: t("Title has been updated successfully"),
          });
          return true;
        }
      }
    } catch (err) {
      // TODO parse errors
      const { extensions = "" } = err.response?.data?.errors[0];
      if (extensions.validation) {
        const errorTitle = extensions.validation.group.title.includes(
          "should not conflict"
        )
          ? t("Group with this title is already exist")
          : extensions.validation.group.title;
        console.log(errorTitle);
        toast?.error({
          title: t("Error"),
          description: errorTitle,
        });
      } else {
        toast?.error({
          title: t("Error"),
          description: t("Something went wrong"),
        });
      }
    }
  };

  render() {
    const { selectedItem, edit, newGroup } = this.state;
    const { role } = this.props.user;
    const { t } = this.props;
    const moreActionsBtn = {
      title: "",
      dataIndex: "",
      key: "id",
      width: 5,
      className: "drag-visible",
      render: (val, props) => {
        return ["superuser", "coordinator"].includes(role) ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown.Button
              className="users more-action-btn"
              trigger={["click"]}
              getPopupContainer={(el) => el.parentNode}
              overlay={
                <>
                  <Menu className="more-action-btn-table">
                    <Menu.Item
                      key="1"
                      onClick={() =>
                        this.setState({ edit: true, selectedItem: props })
                      }
                      icon={<IconEdit className="has-icon" />}
                    >
                      {t("Edit")}
                    </Menu.Item>
                    {props.removable && (
                      <Popconfirm
                        overlayClassName="custom-popconfirm"
                        icon={null}
                        title={
                          <div>
                            <h3>{t("This will disable the working group")}</h3>
                          </div>
                        }
                        onConfirm={async () => {
                          try {
                            this.setState({ loading: true });
                            await Axios.post("/graphql", {
                              query: DELETE_WORKING_GROUP,
                              variables: { id: props.id },
                            });
                          } catch (err) {
                            console.error("[Custom Catch Error]-->", err);
                          } finally {
                            this.props.fetchWorkingGroupsAction();
                          }
                        }}
                        okText={t("Yes, delete it")}
                        cancelText={t("Cancel")}
                        okButtonProps={{ danger: true }}
                      >
                        <Menu.Item
                          key="4"
                          icon={<IconDelete className="has-icon" />}
                        >
                          {t("Delete")}
                        </Menu.Item>
                      </Popconfirm>
                    )}
                  </Menu>
                </>
              }
              icon={<MoreVertical size={16} />}
            />
          </div>
        ) : null;
      },
    };

    return (
      <StyledWorkingGroup>
        <Flex jc="space-between">
          <TitleH1 margin="20px 0">{t("All working groups")}</TitleH1>

          {[USER_ROLES.SUPERUSER, USER_ROLES.COORDINATOR].includes(role) && (
            <Flex>
              <CustomizeDashboardReports />
              <ButtonPrimary
                className="small ml-auto"
                onClick={this.handleNewGroupModal}
                style={{ marginLeft: 12 }}
              >
                <IconWGadd />
                {t("Create Working Group")}
              </ButtonPrimary>
            </Flex>
          )}
        </Flex>
        <DraggableList
          data={this.props.workingGroups.map((item, index) => ({
            ...item,
            index,
          }))}
          columns={[
            ...columns({
              updateWorkingGroupStatus: this.updateWorkingGroupStatus,
              updateWorkingGroupTitle: this.updateWorkingGroupTitle,
              t,
            }),
            moreActionsBtn,
          ]}
        />
        {edit && (
          <Suspense fallback={t("Loading...")}>
            <EditWorkingGroup
              visible={edit}
              modalHandler={this.modalHandler}
              selectedItem={selectedItem}
            />
          </Suspense>
        )}
        {newGroup && (
          <Suspense fallback={t("Loading...")}>
            <NewWorkingGroup
              visible={newGroup}
              modalHandler={this.handleNewGroupModal}
            />
          </Suspense>
        )}
      </StyledWorkingGroup>
    );
  }
}

// HOC to inject toast
function withToast(Component) {
  return function WrappedComponent(props) {
    const { toast } = useToast();
    return <Component {...props} toast={toast} />;
  };
}

const mapStateToProps = (state) => ({
  workingGroups: state.workingGroups.data,
  user: state.auth.account,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchWorkingGroupsAction }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withLocale(withToast(WorkingGroupList))));
