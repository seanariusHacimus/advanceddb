import { Component, lazy, Suspense, createRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Popconfirm, Table, DropdownMenuWrapper, DropdownItem } from "../../UI/shadcn";
import { toast } from "react-toastify";
import { MoreVertical } from "lucide-react";
import { MeetingMinutesPage } from "../../../styles/startBusiness";
import { TitleH3, Flex } from "../../../styles";
import { ReactComponent as IconDelete } from "../../../assets/reform/delete.svg";
import { ReactComponent as IconEdit } from "../../../assets/reform/edit.svg";
import { ReactComponent as IconChevronDown } from "../../../assets/startBusiness/chevron-down.svg";
import { ReactComponent as IconChevronUp } from "../../../assets/startBusiness/chevron-up.svg";
import iconAttachment from "../../../assets/startBusiness/attachment.svg";
import AddMeetingMinutes, { errorsConfig } from "./AddMeetingMinutes";
import Axios from "../../../utils/axios";
import { DELETE_MEETING, FETCH_MEETINGS } from "../../../graphql/meetings";
import { columns } from "./table";
import MeetingMinutesEmpty from "./MeetingsMinutesEmpty";
import Print from "../../../components/UI/Printer";
import { ErrorAlerts, parseErrors } from "../../../utils";
import { withLocale } from "../../../utils/locale";

const EditMeetingMinutes = lazy(() => import("./EditMeetingMinutes"));

class MeetingMinutes extends Component {
  state = {
    currentPage: 1,
    data: [],
    editMeeting: false,
    printActive: false,
    alerts: [],
  };

  defaultPageSize = 10;
  printRef = createRef();

  async componentDidMount() {
    this.fetchMeetingMinutes();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedWorkingGroup.id !== this.props.selectedWorkingGroup.id
    ) {
      this.fetchMeetingMinutes();
    }
  }

  fetchMeetingMinutes = async () => {
    const { id } = this.props.selectedWorkingGroup;
    if (id) {
      try {
        const res = await Axios.post("/graphql", {
          query: FETCH_MEETINGS,
          variables: {
            filter: { group_id: id },
            order: {
              key: "created_at",
              direction: "desc",
            },
          },
        });
        if (res?.data) {
          const { nodes } = res.data.data.meeting_minutes;
          this.setState({ data: nodes, group_id: id });
        }
      } catch (err) {
        console.error("[Custom Catch Error]-->", err);
      }
    }
  };

  modalHandler = () => {
    this.setState((prevState) => ({ editMeeting: !prevState.editMeeting }));
  };

  showMessage = (type = "error", content) => {
    const { t } = this.props;
    content = content || t("Something went wrong");
    
    if (type === "success") {
      toast.success(content);
    } else if (type === "warning") {
      toast.warning(content);
    } else {
      toast.error(content);
    }
  };

  beforePrint = () => {
    this.setState({ printActive: true });
  };

  afterPrint = () => {
    this.setState({ printActive: false });
  };

  render() {
    const { editMeeting, data, currentPage, printActive, alerts } = this.state;
    const { meetingMinutesPermissions, members = [], user } = this.props;
    const { t } = this.props;

    const moreActionsBtn = {
      title: "",
      dataIndex: "",
      key: "actions",
      width: 30,
      render: (item) =>
        Object.values(meetingMinutesPermissions).some((v) => v) && (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenuWrapper
              align="end"
              trigger={<MoreVertical size={16} />}
            >
              {meetingMinutesPermissions.update && (
                <DropdownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    this.setState({
                      editMeeting: true,
                      selectedItem: item,
                    });
                  }}
                >
                  <IconEdit />
                  {t("Edit")}
                </DropdownItem>
              )}
              {(meetingMinutesPermissions.delete ||
                item.creator?.id === user.id) && (
                <Popconfirm
                  overlayClassName="custom-popconfirm"
                  icon={null}
                  title={
                    <div>
                      <h3>{t("Are you sure?")}</h3>
                      <p>
                        {t(
                          "When you delete the meeting minute? You can not restore it later."
                        )}
                      </p>
                    </div>
                  }
                  onConfirm={async (e) => {
                    e.stopPropagation();
                    this.setState({ alerts: [] });
                    try {
                      const res = await Axios.post("/graphql", {
                        query: DELETE_MEETING,
                        variables: {
                          meeting_minute_id: item.id,
                        },
                      });
                      if (res?.data) {
                        this.fetchMeetingMinutes();
                        this.showMessage(
                          "success",
                          t("The meeting has been deleted successfully")
                        );
                      }
                    } catch (err) {
                      if (err.message.includes("422")) {
                        const { alerts, errors } = parseErrors(
                          errorsConfig,
                          err.response.data.errors[0].extensions
                            ?.validation
                        );
                        this.setState({ alerts, errors });
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
              )}
            </DropdownMenuWrapper>
          </div>
        ),
    };

    if (data.length > 0) {
      return (
        <MeetingMinutesPage ref={this.printRef}>
          <ErrorAlerts alerts={alerts} style={{ marginBottom: 20 }} />
          <AddMeetingMinutes
            groupId={this.state.group_id}
            fetchMeetings={this.fetchMeetingMinutes}
            members={members}
            user={user}
            meetingMinutesPermissions={meetingMinutesPermissions}
          >
            <Print
              ref={this.printRef.current}
              style={{
                marginLeft: meetingMinutesPermissions.create ? "10px" : "auto",
              }}
              afterPrint={this.afterPrint}
              beforePrint={this.beforePrint}
              buttonStyle={{ padding: 10, height: 34 }}
            />
          </AddMeetingMinutes>

          <Table
            columns={[...columns({ currentPage, t }), moreActionsBtn]}
            expandedRowKeys={printActive ? data.map((i) => i.id) : ""}
            dataSource={data}
            pagination={{
              pageSize: printActive ? data.length : this.defaultPageSize,
              hideOnSinglePage: true,
              position: ["bottomCenter"],
              showLessItems: true,
              size: "small",
              current: currentPage,
              onChange: (page) =>
                this.setState({ currentPage: page, all: true }),
            }}
            rowKey={(item) => item.id}
            onRow={(record) => ({
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
              expandIconColumnIndex: 0,
              expandedRowRender: (item) =>
                item.comment && (
                  <div className="expanded-content">
                    <TitleH3>{t("Description")}:</TitleH3>
                    <p dangerouslySetInnerHTML={{ __html: item.comment }} />
                    {item.attachments.length > 0 && (
                      <Flex style={{ flexWrap: "wrap" }}>
                        <TitleH3>{t("Files")}:</TitleH3>
                        {item.attachments.map((item) => (
                          <div className="icons-set" key={item.id}>
                            <img
                              src={iconAttachment}
                              alt={t("has attachment")}
                              className="attachment-icon"
                            />
                            <a
                              href={item.file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="item-title"
                            >
                              {item.filename}
                            </a>
                          </div>
                        ))}
                      </Flex>
                    )}
                  </div>
                ),
            }}
          />
          {editMeeting && (
            <Suspense fallback={t("Loading...")}>
              <EditMeetingMinutes
                modalHandler={this.modalHandler}
                visible={this.state.editMeeting}
                fetchMeetings={this.fetchMeetingMinutes}
                showMessage={this.showMessage}
                selectedItem={this.state.selectedItem}
                members={members}
                user={user}
              />
            </Suspense>
          )}
        </MeetingMinutesPage>
      );
    }

    return (
      <MeetingMinutesEmpty
        groupId={this.props.selectedWorkingGroup.id}
        showMessage={this.showMessage}
        fetchMeetings={this.fetchMeetingMinutes}
        members={members}
        user={user}
        meetingMinutesPermissions={meetingMinutesPermissions}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.account,
  indicators: state.workingGroups.data,
  selectedWorkingGroup: state.selectedWorkingGroup,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocale(MeetingMinutes));
