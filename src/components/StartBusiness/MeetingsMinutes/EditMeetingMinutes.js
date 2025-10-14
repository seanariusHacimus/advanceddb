import React, { Component } from "react";
import { Row, Col, Alert, Modal, DatePicker } from "antd";
import {
  TitleH1,
  Button,
  ButtonPrimary,
  Flex,
  InputWrapper,
  Input,
} from "../../../styles";
import iconUpload from "../../../assets/indicator/upload.svg";
import Editor from "../../UI/Editor/Editor.js";
import Axios from "../../../utils/axios";
import {
  UPDATE_MEETING,
  DELETE_ATTACHMENTS,
  ADD_ATTACHMENTS,
} from "../../../graphql/meetings";
import moment from "moment-timezone";
import iconAttachment from "../../../assets/startBusiness/attachment.svg";
import { dissoc, ErrorAlerts, parseErrors } from "../../../utils";
import { errorsConfig } from "./AddMeetingMinutes";
import { withLocale } from "../../../utils/locale";
import { toast } from "react-toastify";

class ActionPlan extends Component {
  state = {
    name: "",
    date: "",
    comment: "",
    group_id: "",
    attachments: [],
    newAction: false,
    errors: {},
    alerts: [],
    newAttachments: [],
  };

  componentDidMount() {
    this.setState({ ...this.props.selectedItem });
  }

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errors: dissoc(this.state.errors, name) });
  };

  fileSelection = () => {
    let data = [];
    for (let i = 0; i < this.fileRef.files.length; i++) {
      data.push(this.fileRef.files[i].name);
    }
    this.setState({ newAttachments: data });
  };

  removeAttachments = async (event, attachmentId) => {
    event.preventDefault();
    const { id, attachments } = this.state;
    try {
      const res = await Axios.post("/graphql", {
        query: DELETE_ATTACHMENTS,
        variables: {
          meeting_minute_id: id,
          attachments: [attachmentId],
        },
      });
      if (res?.data) {
        this.setState({
          loading: false,
          attachments: attachments.filter((file) => file.id !== attachmentId),
        });
        this.props.fetchMeetings();
      }
    } catch (err) {
      if (err.message.includes("422")) {
        const { alerts, errors } = parseErrors(
          errorsConfig,
          err.response.data.errors[0].extensions?.validation
        );
        this.setState({ alerts, errors });
      }
      this.setState({ loading: false });
    }
  };

  addAttachments = async () => {
    const { t } = this.props;
    const { id } = this.state;
    const files = this.fileRef.files;
    let formData = new FormData();
    const request = {
      query: ADD_ATTACHMENTS,
      variables: {
        meeting_minute_id: id,
        attachments: files.length ? Array(files.length).fill(null) : null,
      },
    };

    // ------ Create map for FormData -------
    let map = {};
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
      if (res?.data) {
        this.setState({
          loading: false,
          attachments: res.data.data.add_attachments.filter(
            (file) => file.deleted_at === null
          ),
          msgType: "success",
          msg: t("The file has been uploaded"),
          newAttachments: [],
        });
        this.props.fetchMeetings();
      }
    } catch (err) {
      if (err.message.includes("422")) {
        const { alerts, errors } = parseErrors(
          errorsConfig,
          err.response.data.errors[0].extensions?.validation
        );
        this.setState({ alerts, errors });
      } else {
        this.setState({
          alerts: [t("The file could not be uploaded")],
        });
      }
    }
  };

  submitMeetingMinute = async (e) => {
    e.preventDefault();
    const { t } = this.props;
    this.setState({ alerts: [], errors: {} });
    const { name, comment, date } = this.state;
    // --- New Action data ---
    const meeting_minute = {
      name,
      date: moment(date).utc().startOf("day").toISOString(),
      comment,
    };

    const filteredMeetingMinute = Object.keys(meeting_minute).reduce(
      (acc, name) => {
        const val = meeting_minute[name];
        return {
          ...acc,
          [name]: val || null,
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
    const request = {
      query: UPDATE_MEETING,
      variables: {
        meeting_minute: filteredMeetingMinute,
        meeting_minute_id: this.state.id,
      },
    };

    try {
      const res = await Axios.post("/graphql", request);
      if (this.fileRef.files.length) {
        await this.addAttachments();
      }
      if (res?.data) {
        this.props.fetchMeetings();
        this.props.modalHandler();
        this.props.showMessage(
          "success",
          t("Meeting minute has been updated successfully")
        );
        toast.success(t("Meeting minute has been updated successfully"));
      }
    } catch (err) {
      if (err.message.includes("422")) {
        const rawErrors = err.response.data.errors[0].extensions?.validation;
        const { alerts, errors } = parseErrors(errorsConfig, {
          meeting_minute_id: rawErrors.meeting_minute_id,
          ...rawErrors,
        });
        this.setState({ alerts, errors });
      }
    }
  };

  render() {
    const { name, date, newAttachments, attachments, comment, errors, alerts } =
      this.state;
    const meetingDate = moment(date);
    const { t } = this.props;

    return (
      <Modal
        title={null}
        visible={this.props.visible}
        onOk={this.props.modalHandler}
        onCancel={this.props.modalHandler}
        footer={null}
        zIndex={1080}
      >
        <TitleH1>{t("Edit meeting minute")}</TitleH1>
        <form id="header" onSubmit={this.submitMeetingMinute}>
          <ErrorAlerts alerts={alerts} />
          <Row gutter={[22]}>
            <Col xs={24}>
              <InputWrapper>
                <Input
                  required
                  type="text"
                  name="name"
                  value={name}
                  id="meeting-title"
                  autoComplete="off"
                  ref={(el) => (this.nameRef = el)}
                  className={`dynamic-input grey ${
                    errors.name && "input-error"
                  } ${name ? "has-value" : ""}`}
                  onChange={this.handleInput}
                />
                <label htmlFor="" onClick={() => this.nameRef.focus()}>
                  {t("Meeting name *")}
                </label>
              </InputWrapper>
            </Col>
            <Col span={24}>
              <label htmlFor="" onClick={() => this.end_atRef.click()}>
                {t("Date *")}
              </label>
              <InputWrapper>
                <DatePicker
                  required
                  type="date"
                  name="end_at"
                  getPopupContainer={(el) => el.parentNode}
                  value={meetingDate}
                  placeholder={t("Start Date *")}
                  ref={(el) => (this.start_atRef = el)}
                  disabledDate={(current) => current < moment()}
                  className={`custom-datepicker large grey ${
                    errors.date && "input-error"
                  }`}
                  onChange={(val) => this.setState({ end_at: val })}
                />
              </InputWrapper>
            </Col>

            <Col xs={24}>
              <InputWrapper>
                <Editor
                  placeholder={t("comment")}
                  className={`${errors.comment && "input-error"}`}
                  onChange={(val) => this.setState({ comment: val })}
                  value={comment}
                />
              </InputWrapper>
            </Col>
          </Row>
          <Flex style={{ flexWrap: "wrap" }}>
            {attachments.map((item) => {
              return (
                <div
                  key={item.id}
                  href={item.file.download_url}
                  className="file-attachment"
                >
                  <img
                    src={iconAttachment}
                    alt={t("has attachment")}
                    className="file-attachment-icon"
                  />
                  {item.filename.slice(0, 12) + "..." + item.filename.slice(-5)}
                  <button
                    onClick={(event) => this.removeAttachments(event, item.id)}
                    className="file-attachment-remove-btn"
                  >
                    x
                  </button>
                </div>
              );
            })}
          </Flex>
          <Flex style={{ flexWrap: "wrap" }}>
            {newAttachments.map((item, index) => {
              return (
                <div key={index} className="file-attachment">
                  <img
                    src={iconAttachment}
                    alt={t("has attachment")}
                    className="file-attachment-icon"
                  />
                  {item.slice(0, 12) + "..." + item.slice(-5)}
                </div>
              );
            })}
          </Flex>
          <input
            type="file"
            multiple
            onChange={this.fileSelection}
            hidden
            ref={(el) => (this.fileRef = el)}
          />
          <Button
            type="button"
            className="transparent small"
            onClick={() => this.fileRef.click()}
          >
            <img src={iconUpload} alt={t("Upload")} /> {t("Attach file")}
          </Button>
          <Flex className="btn-group" margin="30px 0 20px">
            <Button
              className="transparent cancel"
              type="reset"
              onClick={this.props.modalHandler}
            >
              {t("Cancel")}
            </Button>
            <ButtonPrimary className="" margin="0px 0 0 10px" type="submit">
              {t("Update Meeting Minutes")}
            </ButtonPrimary>
          </Flex>
        </form>
      </Modal>
    );
  }
}

export default withLocale(ActionPlan);
