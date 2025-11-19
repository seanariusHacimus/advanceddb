import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, DatePicker, Select, Alert } from "antd"; // Using Ant components for complex forms
import Editor from "../UI/Editor/Editor.js";
import { Flex, Button, ButtonPrimary, Input, InputWrapper } from "../../styles";
import { EditPage } from "../../styles/reform";
import { FETCH_WORKING_GROUPS } from "../../graphql/workingGroups";
import { CREATE_REFORM } from "../../graphql/reforms";
import moment from "moment-timezone";
import Axios from "../../utils/axios";
import {
  dissoc,
  ErrorAlerts,
  InputErrors,
  notEmptyErrorConfig,
  parseErrors,
  pick,
} from "../../utils";
import { withLocale } from "../../utils/locale";

export const errorsConfig = {
  type_of_update: {
    ...notEmptyErrorConfig,
  },
  date_of_entry: {},
  group_id: {
    ...notEmptyErrorConfig,
    "should be existing": {
      msg: "should exist",
      alert: "Working group is deleted",
    },
  },
  geo_impact: {},
  sub_index_impacted: {
    ...notEmptyErrorConfig,
  },
  legal_basis: {},
  suggested_data_modification: {},
  description: {},
};

export const nullableFields = [
  "geo_impact",
  "description",
  "suggested_date",
  "suggested_data_modification",
  "date_of_entry",
  "legal_basis",
];
export const initialState = {
  creator: "id",
  date_of_entry: "",
  description: "",
  geo_impact: "",
  group_id: "",
  groups: [],
  legal_basis: "",
  sub_index_impacted: "",
  suggested_data: "",
  suggested_data_modification: "",
  type_of_update: "",
  visible: false,
  errors: {},
  alerts: [],
};

export class ReformBase extends Component {
  state = initialState;
  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errors: dissoc(this.state.errors, name) });
  };

  handleTextArea = (val) => {
    this.setState({
      description: val,
      errors: dissoc(this.state.errors, "description"),
    });
  };
}

class AddReform extends ReformBase {
  async componentDidMount() {
    try {
      const res = await Axios.post("/graphql", {
        query: FETCH_WORKING_GROUPS,
        variables: {
          filter: {},
          order: {
            key: "title",
            direction: "asc",
          },
        },
      });
      if (res?.data) {
        const { indicator_groups } = res.data.data;
        this.setState({ groups: indicator_groups.nodes, loading: false });
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { t } = this.props;
    let filteredReform = pick(this.state, [
      "type_of_update",
      "date_of_entry",
      "group_id",
      "geo_impact",
      "sub_index_impacted",
      "legal_basis",
      "suggested_data_modification",
      "description",
    ]);

    filteredReform = Object.keys(filteredReform).reduce((acc, name) => {
      const val = filteredReform[name];
      return {
        ...acc,
        [name]: nullableFields.includes(name) ? val || null : val || "",
      };
    }, {});

    const reform = {
      ...filteredReform,
      date_of_entry: moment(filteredReform.date_of_entry)
        .utc()
        .endOf("day")
        .toISOString(),
    };

    if (filteredReform.group_id) {
      try {
        const res = await Axios.post("/graphql", {
          query: CREATE_REFORM,
          variables: {
            reform,
            attachments: [],
          },
        });
        if (res?.data.data) {
          this.props.fetchReforms();
          this.props.showMessage(
            "success",
            t("The reform has been created successfully!")
          );
          this.props.hideModal();
          this.setState(initialState);
        }
      } catch (err) {
        if (err.message.includes("422")) {
          const { alerts, errors } = parseErrors(
            errorsConfig,
            err.response.data.errors[0].extensions?.validation?.reform
          );
          this.setState({ alerts, errors });
        }
      }
    } else {
      const { alerts, errors } = parseErrors(errorsConfig, {
        group_id: ["cannot be empty"],
      });
      this.setState({ alerts, errors });
    }
  };

  render() {
    const { t } = this.props;
    const { modalVisible, hideModal } = this.props;
    const {
      type_of_update,
      date_of_entry,
      geo_impact,
      sub_index_impacted,
      legal_basis,
      groups,
      description,
      alerts,
      errors,
      group_id,
      suggested_data_modification,
    } = this.state;

    return (
      <EditPage ref={(el) => (this.addParentRef = el)}>
        <Modal
          title={null}
          visible={modalVisible}
          onCancel={hideModal}
          footer={null}
          zIndex={1080}
          width={"100%"}
          style={{ maxWidth: 600 }}
        >
          <h2 className="title">{t("New reform update")}</h2>
          <form action="">
            <ErrorAlerts alerts={alerts} />
            <InputWrapper className="has-messages" align="flex-end">
              <Select
                showSearch
                size="large"
                name="type_of_update"
                value={type_of_update || null}
                multiple={false}
                id="reform-title"
                ref={(el) => (this.type_of_updateRef = el)}
                placeholder={t("Type of data update")}
                onChange={(val) =>
                  this.setState({
                    type_of_update: val,
                    errors: dissoc(errors, "type_of_update"),
                  })
                }
                style={{ width: "100%" }}
                optionFilterProp={"children"}
                className={`custom-select narrow no-padding grey ${
                  errors.type_of_update && "input-error"
                } ${type_of_update ? "has-value" : ""}`}
                allowClear={true}
                getPopupContainer={(node) => node.parentNode}
                dropdownStyle={{ backgroundColor: "#535263", padding: 10 }}
              >
                <Select.Option
                  key={"Data Correction"}
                  className="select-item"
                  value={"Data Correction"}
                >
                  {t("Data Correction")}
                </Select.Option>
                <Select.Option
                  key={"Reform"}
                  className="select-item"
                  value={"Reform"}
                >
                  {t("Reform")}
                </Select.Option>
              </Select>
              <label htmlFor="" onClick={() => this.type_of_updateRef.focus()}>
                {t("Type of data update")}
              </label>
              <InputErrors name={"type_of_update"} errors={errors} />
            </InputWrapper>
            <InputWrapper className="has-messages" align="flex-end">
              <Select
                showSearch
                size="large"
                name="group_id"
                value={group_id || null}
                multiple={false}
                placeholder={t("Indicator impacted")}
                onChange={(val) =>
                  this.setState({
                    group_id: val,
                    errors: dissoc(errors, "group_id"),
                  })
                }
                style={{ width: "100%" }}
                optionFilterProp={"children"}
                className={`custom-select narrow no-padding grey ${
                  errors.group_id && "input-error"
                } ${group_id ? "has-value" : ""}`}
                allowClear={true}
                getPopupContainer={(node) => node.parentNode}
                dropdownStyle={{ backgroundColor: "#535263", padding: 10 }}
              >
                {groups.map((item) => (
                  <Select.Option
                    key={item.title}
                    className="select-item"
                    value={item.id}
                  >
                    {item.title}
                  </Select.Option>
                ))}
              </Select>
              <label htmlFor="" className="custom-select-label">
                {t("Indicator impacted")}
              </label>
              <InputErrors name={"group_id"} errors={errors} />
            </InputWrapper>
            <InputWrapper className="has-messages" align="flex-end">
              <Input
                type="text"
                id="geo-impact"
                name="geo_impact"
                autoComplete="off"
                value={geo_impact}
                ref={(el) => (this.geo_impactRef = el)}
                className={`dynamic-input grey ${
                  errors.geo_impact && "input-error"
                } ${geo_impact ? "has-value" : ""}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.geo_impactRef.focus()}>
                {t("Geographic impact")}
              </label>
              <InputErrors name={"geo_impact"} errors={errors} />
            </InputWrapper>
            <div fd="column">
              <p className="text-left" style={{ width: "100%" }}>
                <label htmlFor="">{t("Description of the data update")}</label>
              </p>
              <Editor
                onChange={(val) => {
                  this.setState({ description: val });
                }}
                value={description}
                placeholder={t("Description of the data update")}
                maxChars={2500}
              />
            </div>
            <InputWrapper className="has-messages" align="flex-end">
              <Input
                required
                type="text"
                autoComplete="off"
                id="sub-index-impacted"
                name="sub_index_impacted"
                value={sub_index_impacted || ""}
                ref={(el) => (this.sub_index_impactedRef = el)}
                className={`dynamic-input grey ${
                  errors.sub_index_impacted && "input-error"
                } ${sub_index_impacted ? "has-value" : ""}`}
                onChange={this.handleInput}
              />
              <label
                htmlFor=""
                onClick={() => this.sub_index_impactedRef.focus()}
              >
                {t("Sub-index or question impacted")}
              </label>
              <InputErrors name={"sub_index_impacted"} errors={errors} />
            </InputWrapper>
            <InputWrapper className="has-messages" align="flex-end">
              <Input
                autoComplete="off"
                id="suggested_data_modification"
                name="suggested_data_modification"
                value={suggested_data_modification}
                ref={(el) => (this.suggested_data_modificationRef = el)}
                className={`dynamic-input grey ${
                  errors.suggested_data_modification && "input-error"
                } ${suggested_data_modification ? "has-value" : ""}`}
                onChange={this.handleInput}
              />
              <label
                htmlFor=""
                onClick={() => this.suggested_data_modificationRef.focus()}
              >
                {t("Suggested data modification")}
              </label>
              <InputErrors
                name={"suggested_data_modification"}
                errors={errors}
              />
            </InputWrapper>
            <InputWrapper className="has-messages" align="flex-end">
              <DatePicker
                required
                type="date"
                name="date_of_entry"
                placeholder={t("Date of entry into force (if applicable):")}
                getPopupContainer={(el) => el.parentNode}
                value={date_of_entry ? moment(date_of_entry) : date_of_entry}
                ref={(el) => (this.date_of_entryRef = el)}
                className={`custom-datepicker large grey ${
                  errors.date_of_entry && "input-error"
                } ${date_of_entry ? "has-value" : ""}`}
                onChange={(val) => this.setState({ date_of_entry: val })}
              />
              <InputErrors name={"date_of_entry"} errors={errors} />
            </InputWrapper>
            <InputWrapper className="has-messages" align="flex-end">
              <Input
                required
                type="text"
                id="legal_basis"
                autoComplete="off"
                name="legal_basis"
                value={legal_basis}
                ref={(el) => (this.legal_basisRef = el)}
                className={`dynamic-input grey ${
                  errors.legal_basis && "input-error"
                } ${legal_basis ? "has-value" : ""}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.legal_basisRef.focus()}>
                {t("Legal basis (if applicable)")}:
              </label>
              <InputErrors name={"legal_basis"} errors={errors} />
            </InputWrapper>
            <Flex>
              <Button
                type="reset"
                onClick={hideModal}
                style={{ height: 51, marginRight: 12 }}
              >
                {t("Cancel")}
              </Button>
              <ButtonPrimary onClick={this.handleSubmit}>
                {t("Apply")}
              </ButtonPrimary>
            </Flex>
          </form>
        </Modal>
      </EditPage>
    );
  }
}

AddReform.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default withLocale(AddReform);
