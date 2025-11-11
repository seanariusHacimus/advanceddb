import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Row, Col } from "../../../UI/shadcn";
import { Select, Tag } from "antd";
import Axios from "../../../../utils/axios";
import { UPDATE_ACTION } from "../../../../graphql/actions";
import {
  Button,
  ButtonPrimary,
  Flex,
  InputWrapper,
  TitleH1,
} from "../../../../styles";
import { ReactComponent as IconCheck } from "../../../../assets/list-icon.svg";
import { fetchActionPlans } from "../../../../store/Actions/actions";
import {
  dissoc,
  indexBy,
  ErrorAlerts,
  InputErrors,
  parseErrors,
} from "../../../../utils";
import { getAllGroupAccounts, getAllTags } from "../CreateAction/CreateAction";
import { withLocale } from "../../../../utils/locale";
import { toast } from "react-toastify";

class ReassignModal extends Component {
  state = {
    responsive_account_ids: [],
    responsive_tags: [],
    allAccounts: {},
    allTags: {},
    alerts: [],
    errors: {},
    loading: false,
  };

  async componentDidMount() {
    const { selectedAction, selectedWorkingGroup } = this.props;
    const { responsive_accounts = [], responsive_tags = [] } = selectedAction;

    const getTags = await getAllTags();
    const allAccounts = await getAllGroupAccounts(
      selectedWorkingGroup,
      responsive_accounts
    );
    const allTags = indexBy(
      getTags.map(({ title }) => ({
        first_name: title,
        id: title,
        isTag: true,
      })),
      "id"
    );

    const responsive_account_ids = [
      ...responsive_accounts.map(({ id }) => id),
      ...responsive_tags.map(({ title }) => title),
    ];

    this.setState({
      responsive_account_ids,
      responsive_tags: [],
      allAccounts,
      allTags,
    });
  }

  handleReassign = async () => {
    const { t } = this.props;
    this.setState({ alerts: [], errors: {}, loading: true });

    const { responsive_account_ids, allAccounts } = this.state;
    const { selectedAction } = this.props;

    const sortedTags = responsive_account_ids.reduce(
      (acc, i) => {
        if (!allAccounts[i]) {
          acc.responsive_tags.push(i);
        } else {
          acc.responsive_account_ids.push(i);
        }
        return acc;
      },
      { responsive_tags: [], responsive_account_ids: [] }
    );

    const allResponsiveTags = [
      ...new Set(sortedTags.responsive_tags.concat(this.state.responsive_tags)),
    ];

    const action = {
      responsive_account_ids: sortedTags.responsive_account_ids.length
        ? sortedTags.responsive_account_ids
        : null,
      responsive_tags: allResponsiveTags.length ? allResponsiveTags : null,
    };

    try {
      const res = await Axios.post("/graphql", {
        query: UPDATE_ACTION,
        variables: {
          action,
          action_id: selectedAction.id,
        },
      });

      if (res?.data.data) {
        // Refetch all related data after successful update
        const { id } = this.props.selectedWorkingGroup;
        this.props.fetchActionPlans(id);
        this.props.fetchCurrentWorkingGroup();
        this.props.fetchOverdueActions();
        toast.success(t("Responsible entity updated successfully"));
        this.props.modalHandler();
        this.setState({ loading: false });
      }
    } catch (err) {
      this.setState({ loading: false });
      if (err.message.includes("422")) {
        const validation = err.response.data.errors[0].extensions?.validation;
        const { alerts, errors } = parseErrors(
          {
            responsive_account_ids: {
              "should be active": {
                msg: "Responsive account should be invited or activated",
                alert: false,
              },
            },
          },
          {
            ...dissoc(validation, "action"),
            ...validation.action,
          }
        );
        this.setState({ alerts, errors });
      }
    }
  };

  render() {
    const {
      responsive_account_ids,
      allAccounts,
      allTags,
      alerts,
      errors,
      loading,
    } = this.state;
    const { t } = this.props;

    function tagRender(props) {
      const { label, value, closable, onClose } = props;
      return (
        <Tag
          closable={closable}
          onClose={onClose}
          style={{ marginRight: 3, fontSize: 16, padding: 5 }}
          color={responsive_account_ids.includes(value) ? "blue" : "default"}
        >
          {label}
        </Tag>
      );
    }

    return (
      <Modal
        title={null}
        open={this.props.visible}
        onOk={this.props.modalHandler}
        onCancel={this.props.modalHandler}
        footer={null}
        zIndex={1080}
      >
        <div>
          <TitleH1>{t("Re-assign Responsible Entity")}</TitleH1>
          <ErrorAlerts alerts={alerts} />
          <InputWrapper className="has-messages" align="flex-end">
            <Select
              mode="multiple"
              required
              size="large"
              placeholder={t("Responsible Entity *")}
              value={responsive_account_ids}
              style={{ width: "100%", backgroundColor: "#fafbfc" }}
              optionFilterProp="children"
              allowClear
              showSearch
              onChange={(arr) => this.setState({ responsive_account_ids: arr })}
              className={`${
                responsive_account_ids?.length > 0 ? "has-value" : ""
              } ${errors.responsive_account_ids && "input-error"}`}
              getPopupContainer={(node) => node.parentNode}
              menuItemSelectedIcon={<IconCheck className="check-icon" />}
              dropdownStyle={{
                backgroundColor: "#535263",
                padding: 10,
                zIndex: 1090,
              }}
              notFoundContent={null}
              defaultActiveFirstOption={false}
              tagRender={tagRender}
              onSearch={(tagSearch) => this.setState({ tagSearch })}
              onInputKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim().length) {
                  this.setState((prevState) => ({
                    responsive_tags: [
                      ...new Set([
                        ...prevState.responsive_tags,
                        e.target.value,
                      ]),
                    ],
                    tagSearch: "",
                  }));
                  // This is for removing typed value from input
                  e.target.blur();
                  e.target.focus();
                }
              }}
            >
              {Object.values({ ...allAccounts, ...allTags }).map((acc) => {
                return (
                  <Select.Option
                    key={acc.id}
                    className="select-item"
                    value={acc.id}
                  >
                    {acc.isTag ? "#" : ""}
                    {`${acc.first_name || ""} ${acc.last_name || ""}`}
                  </Select.Option>
                );
              })}
            </Select>
            <InputErrors name={"responsive_account_ids"} errors={errors} />
          </InputWrapper>
          <Flex className="btn-group" margin="30px 0 20px">
            <Button
              className="transparent cancel"
              type="button"
              onClick={this.props.modalHandler}
            >
              {t("Cancel")}
            </Button>
            <ButtonPrimary
              className=""
              margin="0px 0 0 10px"
              type="button"
              onClick={this.handleReassign}
              loading={loading}
            >
              {t("Re-assign")}
            </ButtonPrimary>
          </Flex>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedWorkingGroup: state.selectedWorkingGroup,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchActionPlans }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocale(ReassignModal));
