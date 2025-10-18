import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Row, Col, Select, Modal, DatePicker, Tag } from "antd";
import Axios from "../../../utils/axios";
import { UPDATE_ACTION } from "../../../graphql/actions";
import {
  Button,
  ButtonPrimary,
  Flex,
  InputWrapper,
  TitleH1,
  StyledActionPlan,
} from "../../../styles";
import { ReactComponent as IconCheck } from "../../../assets/list-icon.svg";
import { fetchActionPlans } from "../../../store/Actions/actions";
import moment from "moment-timezone";
import {
  dissoc,
  indexBy,
  ErrorAlerts,
  InputErrors,
  parseErrors,
} from "../../../utils";
import {
  ActionPlanBase,
  errorsConfig,
  getAllTags,
  initialState,
  getAllGroupAccounts,
} from "./AddActionPlan";
import { withLocale } from "../../../utils/locale";
import FileUploadEdit from "./FileUploadEdit";
import ActionNameSelection from "./ActionNameSelection";
import { getCategoriesByPillar, getSubcategoriesByCategory } from "./util";

class EditActionPlan extends ActionPlanBase {
  state = initialState;

  async componentDidMount() {
    const {
      name,
      start_at,
      end_at,
      responsive_accounts,
      responsive_tags,
      pillar_number,
      category,
      sub_category,
    } = this.props.selectedAction;
    const getTags = await getAllTags();
    const allAccounts = await getAllGroupAccounts(
      this.props.selectedWorkingGroup,
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

    // Load categories and subcategories based on existing pillar and category
    const topicName =
      this.props.selectedWorkingGroup?.title || "Business Entry";
    const categoriesList = pillar_number
      ? getCategoriesByPillar(topicName, pillar_number)
      : [];
    const subCategoriesList = category
      ? getSubcategoriesByCategory(topicName, category)
      : [];

    this.setState({
      name,
      start_at,
      end_at,
      allAccounts,
      allTags,
      responsive_account_ids,
      responsive_tags: [],
      pillar_number,
      category,
      sub_category,
      categoriesList,
      subCategoriesList,
    });
  }

  handleActionNameChange = (value) => {
    this.setState((prev) => ({ ...prev, name: value }));
  };

  onSelectActionName = ({ pillar_number, category, sub_category }) => {
    const topicName = this.props.indicatorGroup?.title || "Business Entry";
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
    }));
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
          this.props.indicatorGroup?.title || "Business Entry",
          category
        ),
        errors: dissoc(this.state.errors, "sub_category"),
      },
      () => this.loadSubCategories(category)
    );
  };

  loadCategories = (pillar) => {
    if (!pillar) return;

    const topicName = this.props.indicatorGroup?.title || "Business Entry";
    const list = getCategoriesByPillar(topicName, pillar);
    this.setState({ categoriesList: list || [] });
  };

  loadSubCategories = async (category) => {
    if (!category) return;
    const topicName = this.props.indicatorGroup?.title || "Business Entry";
    const list = getSubcategoriesByCategory(topicName, category);
    this.setState({ subCategoriesList: list || [] });
  };

  submitAction = async (e) => {
    e.preventDefault();
    const { t } = this.props;

    this.setState({ alerts: [], errors: {} });
    const {
      end_at,
      name,
      responsive_account_ids,
      number,
      start_at,
      responsive_tags,
      allAccounts,
      pillar_number,
      category,
      sub_category,
    } = this.state;

    const { id, indicator_group } = this.props.selectedAction;
    console.log("indicator_group", indicator_group);

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
      end_at: moment(end_at).endOf("day").toISOString(),
      name,
      number,
      start_at: moment(start_at).startOf("day").toISOString(),
      responsive_account_ids: sortedTags.responsive_account_ids.length
        ? sortedTags.responsive_account_ids
        : null,
      responsive_tags: allResponsiveTags.length ? allResponsiveTags : null,
      pillar_number,
      category,
      sub_category,
    };

    if (
      start_at &&
      end_at &&
      name &&
      pillar_number &&
      category &&
      sub_category
    ) {
      try {
        const res = await Axios.post("/graphql", {
          query: UPDATE_ACTION,
          variables: {
            action,
            action_id: id,
          },
        });

        if (res?.data.data) {
          this.setState(initialState);
          this.props.fetchCurrentWorkingGroup();
          this.props.modalHandler();
        }
      } catch (err) {
        if (err.message.includes("422")) {
          const validation = err.response.data.errors[0].extensions?.validation;
          const { alerts, errors } = parseErrors(errorsConfig, {
            ...dissoc(validation, "action"),
            ...validation.action,
          });
          this.setState({ alerts, errors });
        }
      }
    } else {
      let errors = {};
      [
        "start_at",
        "end_at",
        "name",
        "pillar_number",
        "category",
        "sub_category",
      ].forEach((item) => {
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

  render() {
    const {
      name,
      start_at,
      end_at,
      responsive_account_ids,
      allAccounts,
      alerts,
      errors,
      showDummyModal,
      isStartAtFocused,
      isEndAtFocused,
      responsive_tags,
      allTags,
      tagSearch,
      pillar_number,
      category,
      sub_category,
      categoriesList = [],
      subCategoriesList = [],
    } = this.state;
    const { selectedAction } = this.props;
    const { action_boundaries } = selectedAction;
    const lowerBoundDate =
      action_boundaries && moment(action_boundaries.start_at);
    const upperBoundDate =
      action_boundaries && moment(action_boundaries.end_at);
    const endDate = moment(end_at);
    const startDate = moment(start_at);
    const { t } = this.props;
    const topicName =
      this.props.selectedWorkingGroup?.title || "Business Entry";

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
        title={null}
        open={this.props.visible && !showDummyModal}
        onOk={this.props.modalHandler}
        onCancel={this.props.modalHandler}
        footer={null}
        zIndex={1080}
      >
        <StyledActionPlan
          ref={this.parentRef}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              this.submitAction(e);
            }
          }}
        >
          <TitleH1>{t("Edit the action")}</TitleH1>
          <form id="edit-action-plan" onSubmit={this.submitAction}>
            <ErrorAlerts alerts={alerts} />
            <Row gutter={[22]}>
              <Col xs={24}>
                <InputWrapper className="has-messages" align="flex-end">
                  <ActionNameSelection
                    onChange={this.handleActionNameChange}
                    onSelect={this.onSelectActionName}
                    value={name}
                    topicName={topicName}
                    placeholder="Action name*"
                  />
                  <label htmlFor="" onClick={() => this.nameRef.focus()}>
                    {t("Action name *")}
                  </label>
                  <InputErrors name={"name"} errors={errors} />
                </InputWrapper>
              </Col>
              <Col xs={24} key="pillar_number">
                <InputWrapper className="has-messages" align="flex-end">
                  <Select
                    // showSearch
                    style={{ width: "100%" }}
                    size="large"
                    placeholder={t("Pillar number *")}
                    value={pillar_number}
                    allowClear
                    onChange={this.onPillarChange}
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
                <InputWrapper className="has-messages" align="flex-end">
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    size="large"
                    placeholder={t("Category *")}
                    value={category}
                    onChange={this.onCategoryChange}
                    disabled={!pillar_number}
                    loading={!pillar_number}
                    allowClear
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    className={`custom-select ${category ? "has-value" : ""} ${
                      errors.category ? "input-error" : ""
                    }`}
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
                <InputWrapper className="has-messages">
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
                    disabled={!category}
                    loading={!category}
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
              <Col xs={24}>
                <Row gutter={[22]}>
                  <Col span={12}>
                    <label htmlFor="">{t("Start Date *")}</label>
                    <InputWrapper className="has-messages" align="flex-end">
                      <DatePicker
                        required
                        type="date"
                        tabIndex="2"
                        name="start_at"
                        allowClear={false}
                        value={startDate}
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
                          (lowerBoundDate && current > lowerBoundDate) ||
                          current > endDate
                        }
                        className={`custom-datepicker large grey ${
                          errors.start_at && "input-error"
                        } ${start_at ? "has-value" : ""}`}
                        onChange={(val) =>
                          this.setState({ start_at: val.startOf("day") })
                        }
                      />
                      <InputErrors name={"start_at"} errors={errors} />
                    </InputWrapper>
                  </Col>
                  <Col span={12}>
                    <label htmlFor="">{t("End Date *")}</label>
                    <InputWrapper className="has-messages" align="flex-end">
                      <DatePicker
                        required
                        type="date"
                        name="end_at"
                        tabIndex="3"
                        allowClear={false}
                        getPopupContainer={(el) => el.parentNode}
                        value={endDate}
                        open={isEndAtFocused}
                        placeholder={t("End Date *")}
                        ref={(el) => (this.end_atRef = el)}
                        onFocus={() => this.setState({ isEndAtFocused: true })}
                        onBlur={() => this.setState({ isEndAtFocused: false })}
                        onSelect={() =>
                          this.setState({ isEndAtFocused: false })
                        }
                        disabledDate={(current) =>
                          (upperBoundDate && current < upperBoundDate) ||
                          current < startDate
                        }
                        className={`custom-datepicker large grey ${
                          errors.end_at && "input-error"
                        } ${start_at ? "has-value" : ""}`}
                        onChange={(val) =>
                          this.setState({ end_at: val.endOf("day") })
                        }
                      />
                      <InputErrors name={"end_at"} errors={errors} />
                    </InputWrapper>
                  </Col>
                </Row>
              </Col>
              <Col span={24} key="responsive_accounts">
                <InputWrapper className="has-messages" align="flex-end">
                  <Select
                    mode="multiple"
                    required
                    size="large"
                    tabIndex="5"
                    placeholder={t("Responsible Entity *")}
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
                    // showAction={['click', 'focus']}
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
                        // This is for removing typed value from input
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

              <Col span={24}>
                <FileUploadEdit
                  id={selectedAction.id}
                  attachments={selectedAction.attachments}
                  setAttachments={(files) => this.setState({ files })}
                />
              </Col>
            </Row>
            <Flex className="btn-group" margin="30px 0 20px">
              <Button
                className="transparent cancel"
                type="reset"
                onClick={this.props.modalHandler}
              >
                {t("Cancel")}
              </Button>
              <ButtonPrimary
                className=""
                tabIndex="6"
                margin="0px 0 0 10px"
                type="submit"
              >
                {t("Update the action")}
              </ButtonPrimary>
            </Flex>
          </form>
        </StyledActionPlan>
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
)(withRouter(withLocale(EditActionPlan)));
