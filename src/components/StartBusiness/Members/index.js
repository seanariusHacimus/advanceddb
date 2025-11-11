import { Component } from "react";
import { Table, DropdownMenuWrapper, DropdownItem, Popconfirm } from "../../UI/shadcn";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MoreVertical } from "lucide-react";
import SearchComponent from "../../UI/Search";
import { MembersPage } from "../../../styles/startBusiness";
import { TitleH3, Flex } from "../../../styles";
import { ReactComponent as IconDelete } from "../../../assets/reform/delete.svg";
import { ReactComponent as IconChevronDown } from "../../../assets/startBusiness/chevron-down.svg";
import { ReactComponent as IconChevronUp } from "../../../assets/startBusiness/chevron-up.svg";
import iconEmail from "../../../assets/startBusiness/email.svg";
import iconPhone from "../../../assets/startBusiness/phone.svg";
import { ReactComponent as IconEdit } from "../../../assets/reform/edit.svg";
import MembersForm, { errorsConfig } from "./MembersForm";
import Axios from "../../../utils/axios";
import {
  REMOVE_MEMBERS_MUTATION,
  FETCH_WORKING_GROUPS,
} from "../../../graphql/workingGroups";
import EmptyMembers from "./MembersEmpty";
import { fetchCurrentIndicatorGroupAction } from "../../../store/SelectedIndicator/actions";
import { groupTitleToUrl, parseErrors } from "../../../utils";

import { columns } from "./table";
import { withLocale } from "../../../utils/locale";
import { toast } from "react-toastify";

class Members extends Component {
  state = {
    id: "",
    isSearchActive: false,
    members: [],
    newAction: false,
    query: "",
    selectedMembers: [],
    alerts: [],
  };

  fetchMembers = async () => {
    const { title } = this.props.match.params;
    const currentIndicator = this.props.indicators.find((item) => {
      if (groupTitleToUrl(item.title) === title) {
        return item;
      }
    });

    try {
      const res = await Axios.post("/graphql", {
        query: FETCH_WORKING_GROUPS,
        variables: { filter: { title: currentIndicator.title } },
      });
      if (res?.data) {
        const {
          nodes: [currentData],
        } = res.data.data.indicator_groups;
        const leaders = currentData.leaders.map((item) => ({
          ...item,
          role: "leader",
        }));
        const members = currentData.members.map((item) => ({
          ...item,
          role: "member",
        }));
        const allMembers = [...leaders, ...members];

        this.setState({
          alerts: [],
          ...currentData,
          members: allMembers,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  async componentDidMount() {
    this.fetchMembers();
  }

  render() {
    const { members, id, isSearchActive, selectedMembers, alerts } = this.state;
    const data = isSearchActive ? selectedMembers : members;
    const {
      user: { role, id: myAccountId },
      membersPermissions,
      printActive,
    } = this.props;
    const { t } = this.props;

    const moreActionsBtn = {
      title: "",
      dataIndex: "",
      key: "id",
      width: 30,
      render: (val, account) =>
        membersPermissions.delete &&
        (account.id !== myAccountId ||
          ["coordinator", "superuser"].includes(role)) && (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenuWrapper
              align="end"
              trigger={<MoreVertical size={16} />}
            >
              <Popconfirm
                overlayClassName="custom-popconfirm"
                icon={null}
                title={
                  <div>
                    <h3>
                      {t("Are you sure you want to remove the member?")}
                    </h3>
                  </div>
                }
                onConfirm={async (e) => {
                  e.stopPropagation();
                  try {
                    const { id: groupId } = this.state;
                    const res = await Axios.post("/graphql", {
                      query: REMOVE_MEMBERS_MUTATION,
                      variables: {
                        members: [account.id],
                        group_id: groupId,
                      },
                    });
                    if (res?.data) {
                      toast.success(
                        t("The member has been removed successfully")
                      );
                      this.setState({ alerts: [] });
                      this.fetchMembers();
                      this.props.fetchCurrentIndicatorGroupAction(
                        groupTitleToUrl(
                          this.props.selectedWorkingGroup.title
                        )
                      );
                    }
                  } catch (err) {
                    if (err.message.includes("422")) {
                      const errorsRaw =
                        err.response.data.errors[0].extensions?.validation;
                      const { alerts } = parseErrors(
                        errorsConfig,
                        errorsRaw
                      );
                      this.setState({ alerts });
                    }
                  }
                }}
                okText={t("Yes, remove it!")}
                cancelText={t("Cancel")}
              >
                <DropdownItem
                  as="div"
                  variant="destructive"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconDelete />
                  {t("Delete")}
                </DropdownItem>
              </Popconfirm>
              <DropdownItem
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.history.push(`/members/${account.id}`);
                }}
              >
                <IconEdit />
                {t("Edit")}
              </DropdownItem>
            </DropdownMenuWrapper>
          </div>
        ),
    };

    if (members.length) {
      return (
        <MembersPage>
          <MembersForm
            groupId={id}
            role={role}
            alerts={alerts}
            membersPermissions={membersPermissions}
            fetchMembers={this.fetchMembers}
          >
            <SearchComponent
              ref={this}
              data={members}
              dataKey={["first_name", "last_name"]}
            />
          </MembersForm>
          <Table
            columns={[...columns(t), moreActionsBtn]}
            expandedRowKeys={printActive ? data.map((i) => i.id) : ""}
            dataSource={data}
            pagination={{
              pageSize: printActive ? data.length : 20,
              hideOnSinglePage: true,
              position: ["bottomCenter"],
              showLessItems: true,
              size: "small",
            }}
            rowKey={(obj) => obj.id}
            onRow={() => ({
              onClick: (event) => {
                const row = event.currentTarget;
                row.classList.toggle("bg-white");
              },
            })}
            expandable={{
              expandRowByClick: true,
              expandIcon: ({ expanded, onExpand, record }) =>
                expanded ? (
                  <IconChevronUp onClick={(e) => onExpand(record, e)} />
                ) : (
                  <IconChevronDown onClick={(e) => onExpand(record, e)} />
                ),
              indentSize: 0,
              expandedRowRender: (item) => (
                <div className="expanded-content">
                  <Flex>
                    <TitleH3 className="expanded-title">
                      <img src={iconEmail} alt="user" />
                      {t("Email")}:
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </TitleH3>{" "}
                    {item.phone && (
                      <TitleH3 className="expanded-title">
                        <img src={iconPhone} alt="phone" />
                        {t("Phone")}:
                        <a href={`tel:${item.phone}`}>{item.phone}</a>
                      </TitleH3>
                    )}
                  </Flex>
                </div>
              ),
            }}
          />
        </MembersPage>
      );
    }

    return (
      <EmptyMembers
        groupId={id}
        role={role}
        alerts={alerts}
        membersPermissions={membersPermissions}
        fetchMembers={this.fetchMembers}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.account,
  indicators: state.workingGroups.data,
  selectedWorkingGroup: state.selectedWorkingGroup,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchCurrentIndicatorGroupAction }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withLocale(Members)));
