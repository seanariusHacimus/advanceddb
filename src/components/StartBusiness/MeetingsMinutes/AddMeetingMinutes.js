import React, { Component } from "react";
import { Row, Col, Alert, DatePicker } from "antd";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import { ActionPlanPage } from "../../../styles/startBusiness";
import {
  TitleH3,
  Button,
  ButtonPrimary,
  Flex,
  InputWrapper,
  Input,
} from "../../../styles";
import iconUpload from "../../../assets/indicator/upload.svg";
import iconAddSubaction from "../../../assets/startBusiness/add-primary.svg";
import Editor from "../../UI/Editor/Editor.js";
import Axios from "../../../utils/axios";
import { CREATE_MEETING } from "../../../graphql/meetings";
import iconAttachment from "../../../assets/startBusiness/attachment.svg";
import {
  dissoc,
  ErrorAlerts,
  InputErrors,
  notEmptyErrorConfig,
  parseErrors,
} from "../../../utils";
import { withLocale } from "../../../utils/locale";

const initialState = {
  name: "",
  date: moment(),
  comment: "",
  group_id: "",
  attachments: [],
  newMeetingMinute: false,
  errors: {},
  alerts: [],
};

export const nullableFields = ["comment"];

export const errorsConfig = {
  name: { ...notEmptyErrorConfig },
  comment: {},
  date: { "should be valid": { msg: "invalid", alert: false } },
  meeting_minute_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false,
    },
  },
  group_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false,
    },
  },
};

class AddMeetingMinutes extends Component {
  state = initialState;

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errors: dissoc(this.state.errors, name) });
  };

  fileSelection = () => {
    const data = [];
    for (let i = 0; i < this.fileRef.files.length; i++) {
      data.push(this.fileRef.files[i].name);
    }
    this.setState({ attachments: data });
  };

  submitAction = async (e) => {
    const { t } = this.props;
    e.preventDefault();
    this.setState({ alerts: [], errors: {} });
    const { name, comment, date } = this.state;
    // --- New Action data ---
    const meeting_minute = {
      name,
      date: moment(date).utc().startOf("day").toISOString(),
      comment,
      group_id: this.props.groupId,
    };
    const filteredMeetingMinute = Object.keys(meeting_minute).reduce(
      (acc, name) => {
        const val = meeting_minute[name];
        return {
          ...acc,
          [name]: nullableFields.includes(name) ? val || null : val || "",
        };
      },
      {}
    );
    if (!filteredMeetingMinute.date) {
      this.setState({
        errors: {
          date: [t("is required")],
        },
      });
      return;
    }
    const { files } = this.fileRef;
    const formData = new FormData();
    // If file exist use this section
    const request = {
      query: CREATE_MEETING,
      variables: {
        meeting_minute: filteredMeetingMinute,
        attachments: files.length ? Array(files.length).fill(null) : null,
      },
    };
    // ------ Create map for FormData -------
    const map = {};
    Array(files.length)
      .fill("")
      .forEach((item, index) => {
        map[index] = [`variables.attachments.${index}`];
      });

    // ------ APPEND data to FormDate -------
    formData.append("operations", JSON.stringify(request));
    formData.append("map", JSON.stringify(map));

    Array(files.length)
      .fill("")
      .forEach((item, index) => {
        formData.append([index], files[index]);
      });
    try {
      const res = await Axios.post("/graphql", formData);
      if (res.data) {
        this.props.fetchMeetings();
        this.setState({ ...initialState });
        Swal.fire({
          title: t("Created"),
          text: t("Meeting minute has been created successfully"),
          icon: "success",
        });
      }
    } catch (err) {
      if (err.message.includes("422")) {
        const { alerts, errors } = parseErrors(
          errorsConfig,
          err.response.data.errors[0].extensions?.validation?.meeting_minute
        );
        this.setState({ alerts, errors });
      }
    }
  };

  render() {
    const { name, date, newMeetingMinute, attachments, alerts, errors } =
      this.state;
    const { meetingMinutesPermissions } = this.props;
    const { t } = this.props;

    return (
      <ActionPlanPage>
        <Flex margin="0 0 20px" className="action-btn-group">
          <TitleH3>{t("All meetings")}</TitleH3>
          {meetingMinutesPermissions.create && (
            <ButtonPrimary
              className="small add-new-action"
              onClick={() => this.setState({ newMeetingMinute: true })}
            >
              <img src={iconAddSubaction} alt={t("add subaction")} />{" "}
              {t("New Meeting")}
            </ButtonPrimary>
          )}
          {this.props.children}
        </Flex>
        {newMeetingMinute && meetingMinutesPermissions.create && (
          <form onSubmit={this.submitAction} id="header">
            <ErrorAlerts alerts={alerts} />
            <Row gutter={[22]}>
              <Col xs={24} lg={8}>
                <InputWrapper className="has-messages" align="flex-end">
                  <Input
                    type="text"
                    name="name"
                    value={name}
                    index="1"
                    id="meeting-title"
                    autoComplete="off"
                    ref={(el) => (this.nameRef = el)}
                    className={`dynamic-input grey ${
                      errors.name && "input-error"
                    } ${name ? "has-value" : ""}`}
                    onChange={this.handleInput}
                  />
                  <label htmlFor="" onClick={() => this.nameRef.focus()}>
                    {t("Meeting name")}
                  </label>
                  <InputErrors name={"name"} errors={errors} />
                </InputWrapper>
                <InputWrapper className="has-messages" align="flex-end">
                  <DatePicker
                    name="date"
                    value={date}
                    index="2"
                    ref={(el) => (this.dateRef = el)}
                    placeholder={t("Start Date *")}
                    className={`custom-datepicker large dynamic-input grey ${
                      errors.date && "input-error"
                    } ${date ? "has-value" : ""}`}
                    onChange={(val) => this.setState({ date: val })}
                  />
                  <InputErrors name={"date"} errors={errors} />
                </InputWrapper>
              </Col>
              <Col xs={24} lg={16}>
                <InputWrapper className="has-messages" align="flex-end">
                  <Editor
                    height={125}
                    index="3"
                    onChange={(val) => this.setState({ comment: val })}
                    className={`${errors.comment && "input-error"}`}
                  />
                  <InputErrors name={"comment"} errors={errors} />
                </InputWrapper>
              </Col>
            </Row>
            <input
              type="file"
              multiple
              onChange={this.fileSelection}
              hidden
              ref={(el) => (this.fileRef = el)}
            />
            <Flex style={{ flexWrap: "wrap" }}>
              {attachments.map((item, index) => (
                <div key={index} className="file-attachment">
                  <img
                    src={iconAttachment}
                    alt={t("has attachment")}
                    className="file-attachment-icon"
                  />
                  {`${item.slice(0, 12)}...${item.slice(-5)}`}
                </div>
              ))}
            </Flex>
            <Flex className="btn-group">
              <Button
                className="transparent small"
                type="button"
                onClick={() => this.fileRef.click()}
              >
                {" "}
                <img src={iconUpload} alt={t("Upload")} /> {t("Attach file")}
              </Button>
              <Button
                className="transparent small cancel"
                type="button"
                onClick={() => this.setState({ newMeetingMinute: false })}
              >
                {t("Cancel")}
              </Button>
              <ButtonPrimary className="small">
                {t("Save meeting minutes")}
              </ButtonPrimary>
            </Flex>
          </form>
        )}
      </ActionPlanPage>
    );
  }
}

export default withLocale(AddMeetingMinutes);
