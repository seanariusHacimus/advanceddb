import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Col, Row, Modal } from "../../../UI/shadcn";
import { DatePicker, Select, Tag } from "antd"; // Keep for now - complex forms
import moment from "moment-timezone";
import Axios from "../../../../utils/axios";
import { CREATE_ACTION } from "../../../../graphql/actions";
import {
  Button,
  ButtonPrimary,
  Flex,
  InputWrapper,
  StyledActionPlan,
  TitleH1,
  TitleH3,
} from "../../../../styles";
import { ReactComponent as IconCheck } from "../../../../assets/list-icon.svg";
import { fetchActionPlans } from "../../../../store/Actions/actions";
import {
  dissoc,
  ErrorAlerts,
  indexBy,
  InputErrors,
  parseErrors,
} from "../../../../utils";
import { withLocale } from "../../../../utils/locale";
import FileUpload from "../components/FileUpload";
import ActionNameSelection from "../components/ActionNameSelection";
import { Editor } from "../../../UI";
import { toast } from "react-toastify";
import { getCategoriesByPillar, getSubcategoriesByCategory } from "../util";
import { errorsConfig, initialState } from "./constants";
import {
  getAllGroupAccounts,
  getAllOrganizations,
  getAllTags,
} from "./helpers";

export {
  errorsConfig,
  initialState,
  getAllGroupAccounts,
  getAllOrganizations,
  getAllTags,
};

export class ActionPlanBase extends Component {
  state = { ...initialState, end_at_isGreater: false };
  membersRef = createRef();
  parentRef = createRef();

  componentDidMount() {
    getAllTags().then((tags) => {
      const allTags = tags.map(({ title }) => ({
        first_name: title,
        id: title,
        isTag: true,
      }));
      this.setState({
        allAccounts: getAllGroupAccounts(this.props.selectedWorkingGroup),
        allTags: indexBy(allTags, "id"),
      });
    });
  }

  refreshEntities = () => {
    const { responsive_accounts, responsive_tags, responsive_organizations } =
      this.props.selectedAction;
    const allAccounts = getAllGroupAccounts(this.props.selectedWorkingGroup);
    getAllTags().then((allTags) => {
      const externalTags = indexBy(
        responsive_tags.filter(({ title }) => !allTags[title]),
        "title"
      );
      const externalAccounts = indexBy(
        responsive_accounts.filter(({ id }) => !allAccounts[id]),
        "id"
      );
      this.setState({
        allTags: {
          ...externalTags,
          ...allTags,
        },
        allAccounts: {
          ...externalAccounts,
          ...allAccounts,
        },
      });
    });
  };

  onPillarChange = (pillar_number) => {
    console.log("pillar_number", pillar_number);
    this.setState(
      {
        pillar_number,
        category: undefined,
        sub_category: undefined,
        categoriesList: [],
        subCategoriesList: [],
        errors: dissoc(
          dissoc(dissoc(this.state.errors, "pillar_number"), "category"),
          "sub_category"
        ),
      },
      () => this.loadCategories(pillar_number)
    );
  };

  onCategoryChange = (category) => {
    this.setState(
      {
        category,
        sub_category: undefined,
        subCategoriesList: getSubcategoriesByCategory(
          this.props.indicatorGroup.title,
          category
        ),
        errors: dissoc(this.state.errors, "sub_category"),
      },
      () => this.loadSubCategories(category)
    );
  };

  loadCategories = (pillar) => {
    if (!pillar) return;

    const topicName = this.props.indicatorGroup.title;
    const list = getCategoriesByPillar(topicName, pillar);
    this.setState({ categoriesList: list || [] });
  };

  loadSubCategories = async (category) => {
    if (!category) return;
    const topicName = this.props.indicatorGroup.title;
    const list = getSubcategoriesByCategory(topicName, category);
    this.setState({ subCategoriesList: list || [] });
  };

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errors: dissoc(this.state.errors, name) });
  };

  handleActionNameChange = (value) => {
    this.setState((prev) => ({
      ...prev,
      name: value,
    }));
  };

  handleActionNameClear = () => {
    this.setState((prev) => ({
      ...prev,
      name: "",
      pillar_number: undefined,
      category: undefined,
      sub_category: undefined,
      categoriesList: [],
      subCategoriesList: [],
      isActionNameSelected: false,
    }));
  };

  onSelectActionName = ({ pillar_number, category, sub_category }) => {
    const topicName = this.props.indicatorGroup.title;
    const categoriesList = getCategoriesByPillar(topicName, pillar_number);
    const subCategoriesList = category
      ? getSubcategoriesByCategory(topicName, category)
      : [];

    this.setState((prev) => ({
      ...prev,
      pillar_number,
      category,
      sub_category,
      categoriesList,
      subCategoriesList,
      isActionNameSelected: true,
    }));
  };

  handleRemoveTag = (tag) => {
    const removedTag = this.state.responsive_tags.filter((i) => i !== tag);
    this.setState({ responsive_tags: removedTag });
  };

  render() {
    throw "Function not implemented";
  }
}

class ActionPlanForm extends ActionPlanBase {
  state = initialState;

  submitAction = async (e) => {
    e.preventDefault();
    const { t } = this.props;
    this.setState({ alerts: [], errors: {} });
    const {
      end_at,
      name,
      description,
      number,
      start_at,
      responsive_account_ids,
      responsive_tags,
      allAccounts,
      attachments,
      pillar_number,
      category,
      sub_category,
    } = this.state;

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
      ...new Set(sortedTags.responsive_tags.concat(responsive_tags)),
    ];

    const action = {
      start_at: moment(start_at).startOf("day").toISOString(),
      end_at: moment(end_at).endOf("day").toISOString(),
      group_id: this.props.selectedWorkingGroup.id,
      name,
      description: description || null,
      number,
      responsive_account_ids: sortedTags.responsive_account_ids.length
        ? sortedTags.responsive_account_ids
        : null,
      responsive_tags: allResponsiveTags.length ? allResponsiveTags : null,
      pillar_number,
      category,
      sub_category,
    };

    const isUserAddedWorkingGroup = Boolean(
      this.props.indicatorGroup.removable
    );
    const hasRequiredFields =
      start_at && end_at && name && responsive_account_ids?.length > 0;
    const hasPillarFields = !isUserAddedWorkingGroup
      ? pillar_number && category && sub_category
      : true;

    if (hasRequiredFields && hasPillarFields) {
      const formData = new FormData();
      const request = {
        query: CREATE_ACTION,
        variables: {
          action,
          attachments: attachments.length
            ? Array(attachments.length).fill(null)
            : null,
        },
      };

      const map = {};
      Array(attachments.length)
        .fill("")
        .forEach((item, index) => {
          map[index] = [`variables.attachments.${index}`];
        });

      formData.append("operations", JSON.stringify(request));
      formData.append("map", JSON.stringify(map));

      Array(attachments.length)
        .fill("")
        .forEach((item, index) => {
          formData.append([index], attachments[index]);
        });

      try {
        const res = await Axios.post("/graphql", formData);

        if (res?.data.data) {
          toast.success(t("The action has been created successfully"));
          this.setState(initialState);
          this.props.fetchCurrentWorkingGroup();
          this.props.modalHandler();
        }
      } catch (err) {
        if (err.message.includes("422")) {
          const { alerts, errors } = parseErrors(
            errorsConfig,
            err.response.data.errors[0].extensions?.validation?.action
          );
          this.setState({ alerts, errors });
        }
      }
    } else {
      let errors = {};
      const requiredFields = [
        "start_at",
        "end_at",
        "name",
        "responsive_account_ids",
      ];

      // Only validate pillar-related fields if it's not a user-added working group
      if (!Boolean(this.props.indicatorGroup.removable)) {
        requiredFields.push("pillar_number", "category", "sub_category");
      }

      requiredFields.forEach((item) => {
        if (!this.state[item]) {
          errors = { ...errors, [item]: [t("Required field")] };
        }
      });

      this.setState({
        alerts: [t("Fill all required fields")],
        errors,
      });
    }
  };

  fileSelection = () => {
    const data = [];
    for (let i = 0; i < this.fileRef.files.length; i++) {
      data.push(this.fileRef.files[i].name);
    }
    this.setState({ attachments: data });
  };

  render() {
    const { t, indicatorGroup } = this.props;
    const workingGroupTitle = indicatorGroup.title;
    const isUserAddedWorkingGroup = Boolean(indicatorGroup.removable);

    const {
      name,
      description,
      start_at,
      end_at,
      responsive_account_ids,
      allAccounts,
      alerts,
      errors,
      tagSearch,
      isStartAtFocused,
      isEndAtFocused,
      responsive_tags,
      allTags,
      attachments = [],
      pillar_number,
      category,
      sub_category,
      categoriesList = [],
      subCategoriesList = [],
      isActionNameSelected,
    } = this.state;

    console.log("errors", errors);

    function tagRender(props) {
      const { label, value, closable, onClose } = props;

      return (
        <Tag
          closable={closable}
          onClose={onClose}
          style={{ marginRight: 3, fontSize: 16, padding: 5 }}
          color={responsive_tags.includes(value) ? "blue" : "default"}
        >
          {label}
        </Tag>
      );
    }
    return (
      <Modal
        title={t("Create a new action")}
        open={this.props.visible}
        onCancel={this.props.modalHandler}
        footer={
          <Row gutter={[16]}>
            <Col span={12}>
              <Button
                className="transparent cancel"
                type="reset"
                onClick={this.props.modalHandler}
              >
                {t("Cancel")}
              </Button>
            </Col>
            <Col span={12}>
              <ButtonPrimary type="submit" onClick={this.submitAction}>
                {t("Create a new action")}
              </ButtonPrimary>
            </Col>
          </Row>
        }
        zIndex={1080}
        styles={{
          content: {
            padding: "32px",
          },
        }}
      >
        <StyledActionPlan
          id="add-action-plan"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              console.log("parent Entered");
              e.preventDefault();
              this.submitAction(e);
            }
          }}
        >
          <form id="header" onSubmit={this.submitAction} ref={this.parentRef}>
            <ErrorAlerts alerts={alerts} />
            <Row gutter={[22]}>
              <Col xs={24} key="action-title">
                <InputWrapper
                  className="has-messages"
                  margin="8px"
                  align="flex-end"
                >
                  <ActionNameSelection
                    onChange={this.handleActionNameChange}
                    onSelect={this.onSelectActionName}
                    value={name}
                    topicName={workingGroupTitle}
                    placeholder="Action name*"
                    onClear={this.handleActionNameClear}
                    existingActions={this.props.actions.map(
                      (action) => action.name
                    )}
                  />
                  <label htmlFor="" onClick={() => this.nameRef.focus()}>
                    {t("Action name *")}
                  </label>
                  <InputErrors name={"name"} errors={errors} />
                </InputWrapper>
              </Col>
              {!isUserAddedWorkingGroup && (
                <>
                  <Col xs={24} key="pillar_number">
                    <InputWrapper
                      className="has-messages"
                      margin="8px"
                      align="flex-end"
                    >
                      <Select
                        showSearch
                        style={{ width: "100%" }}
                        size="large"
                        placeholder={t("Pillar number *")}
                        value={pillar_number}
                        allowClear
                        onChange={this.onPillarChange}
                        disabled={isActionNameSelected}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        className={`custom-select ${
                          pillar_number ? "has-value" : ""
                        } ${errors.pillar_number ? "input-error" : ""}`}
                        getPopupContainer={(node) => node.parentNode}
                        dropdownStyle={{ zIndex: 1090 }}
                      >
                        <Select.Option key={1} value={"I"}>
                          Pillar I
                        </Select.Option>
                        <Select.Option key={2} value={"II"}>
                          Pillar II
                        </Select.Option>
                        <Select.Option key={3} value={"III"}>
                          Pillar III
                        </Select.Option>
                      </Select>
                      <InputErrors name={"pillar_number"} errors={errors} />
                    </InputWrapper>
                  </Col>
                  <Col xs={24} key="category">
                    <InputWrapper
                      className="has-messages"
                      margin="8px"
                      align="flex-end"
                    >
                      <Select
                        style={{ width: "100%" }}
                        size="large"
                        placeholder={t("Category *")}
                        value={category}
                        onChange={this.onCategoryChange}
                        disabled={!pillar_number || isActionNameSelected}
                        allowClear
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        className={`custom-select ${
                          category ? "has-value" : ""
                        } ${errors.category ? "input-error" : ""}`}
                        getPopupContainer={(node) => node.parentNode}
                        dropdownStyle={{ zIndex: 1090 }}
                      >
                        {categoriesList?.map((item) => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.value}
                          </Select.Option>
                        ))}
                      </Select>
                      <InputErrors name={"category"} errors={errors} />
                    </InputWrapper>
                  </Col>
                  <Col xs={24} key="sub_category">
                    <InputWrapper className="has-messages" margin="8px">
                      <Select
                        showSearch
                        style={{ width: "100%" }}
                        placeholder={t("Sub-category *")}
                        value={sub_category}
                        onChange={(val) =>
                          this.setState({
                            sub_category: val,
                            errors: dissoc(this.state.errors, "sub_category"),
                          })
                        }
                        disabled={!category || isActionNameSelected}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        className={`custom-select  ${
                          sub_category ? "has-value" : ""
                        } ${errors.sub_category ? "input-error" : ""}`}
                        optionFilterProp="children"
                        allowClear
                        multiple={false}
                        getPopupContainer={(node) => node.parentNode}
                        dropdownStyle={{
                          backgroundColor: "#535263",
                          padding: 10,
                          zIndex: 1090,
                        }}
                        size="large"
                      >
                        {subCategoriesList?.map((item) => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.value}
                          </Select.Option>
                        ))}
                      </Select>
                      <InputErrors name={"sub_category"} errors={errors} />
                    </InputWrapper>
                  </Col>
                </>
              )}
              <Col xs={24} key="start_at">
                <Row gutter={[22]}>
                  <Col span={12}>
                    <InputWrapper
                      className="has-messages"
                      margin="8px"
                      align="flex-end"
                    >
                      <DatePicker
                        required
                        tabIndex="2"
                        type="date"
                        name="start_at"
                        value={start_at}
                        placeholder={t("Start Date *")}
                        ref={(el) => (this.start_atRef = el)}
                        open={isStartAtFocused}
                        getPopupContainer={(el) => el.parentNode}
                        onFocus={() =>
                          this.setState({ isStartAtFocused: true })
                        }
                        onBlur={() =>
                          this.setState({ isStartAtFocused: false })
                        }
                        onSelect={() =>
                          this.setState({ isStartAtFocused: false })
                        }
                        disabledDate={(current) =>
                          current < moment().startOf("day")
                        }
                        onChange={(val) =>
                          this.setState({
                            start_at: val
                              ? val.startOf("day")
                              : moment().startOf("day"),
                            isStartAtFocused: false,
                          })
                        }
                        className={`custom-datepicker large grey ${
                          errors.start_at && "input-error"
                        } ${start_at ? "has-value" : ""}`}
                      />
                      <InputErrors name={"start_at"} errors={errors} />
                    </InputWrapper>
                  </Col>
                  <Col span={12} key="end_at">
                    <InputWrapper
                      className="has-messages"
                      margin="8px"
                      align="flex-end"
                    >
                      <DatePicker
                        required
                        tabIndex="3"
                        type="date"
                        name="end_at"
                        placeholder={t("End Date *")}
                        value={end_at}
                        ref={(el) => (this.end_atRef = el)}
                        open={isEndAtFocused}
                        getPopupContainer={(el) => el.parentNode}
                        onFocus={() => this.setState({ isEndAtFocused: true })}
                        onBlur={() => this.setState({ isEndAtFocused: false })}
                        onSelect={() =>
                          this.setState({ isEndAtFocused: false })
                        }
                        onChange={(val) =>
                          this.setState({
                            end_at: val
                              ? val.endOf("day")
                              : moment().endOf("day"),
                            isEndAtFocused: false,
                          })
                        }
                        disabledDate={(current) =>
                          current < moment(start_at).add(1, "day")
                        }
                        className={`custom-datepicker large grey ${
                          errors.end_at && "input-error"
                        } ${end_at ? "has-value" : ""}`}
                      />
                      <InputErrors name={"end_at"} errors={errors} />
                    </InputWrapper>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} key="responsive_accounts">
                <InputWrapper
                  className="has-messages"
                  margin="8px"
                  align="flex-end"
                >
                  <Select
                    mode="multiple"
                    required
                    size="large"
                    tabIndex="5"
                    placeholder={t("Assign to*")}
                    value={[
                      ...new Set(
                        responsive_account_ids.concat(responsive_tags)
                      ),
                    ]}
                    onSearch={(tagSearch) => this.setState({ tagSearch })}
                    style={{ width: "100%", backgroundColor: "#fafbfc" }}
                    optionFilterProp="children"
                    allowClear
                    showSearch
                    onChange={(arr) =>
                      this.setState({ responsive_account_ids: arr })
                    }
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
                    ref={(el) => (this.entityRef = el)}
                    onDeselect={(tag) => this.handleRemoveTag(tag)}
                    onInputKeyDown={(e) => {
                      if (e.key === "Enter" && tagSearch.trim().length) {
                        this.setState((prevState) => ({
                          responsive_tags: [
                            ...new Set([
                              ...prevState.responsive_tags,
                              tagSearch,
                            ]),
                          ],
                          tagSearch: "",
                        }));
                        this.entityRef.blur();
                        this.entityRef.focus();
                      }
                    }}
                  >
                    {Object.values({ ...allAccounts, ...allTags }).map(
                      (acc) => {
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
                      }
                    )}
                  </Select>
                  <InputErrors
                    name={"responsive_account_ids"}
                    errors={errors}
                  />
                </InputWrapper>
              </Col>

              <Col span={24} style={{ marginBottom: 15 }}>
                <InputWrapper
                  className="has-messages"
                  margin="8px"
                  align="flex-start"
                >
                  <label htmlFor="" onClick={() => {}}>
                    {t("Description")}
                  </label>
                  <Editor
                    height={150}
                    value={description}
                    onChange={(val) =>
                      this.setState({
                        description: val,
                        errors: dissoc(this.state.errors, "description"),
                      })
                    }
                    className={`${errors.description && "input-error"}`}
                  />

                  <InputErrors name={"description"} errors={errors} />
                </InputWrapper>
              </Col>
              <Col span={24} style={{ marginBottom: 15 }}>
                <FileUpload
                  attachments={[]}
                  setAttachments={(attachments) =>
                    this.setState({ attachments })
                  }
                />
              </Col>
            </Row>
          </form>
        </StyledActionPlan>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedWorkingGroup: state.selectedWorkingGroup,
  actions: state.actions.data,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchActionPlans }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withLocale(ActionPlanForm)));
