import React, { useEffect, useRef, useState } from "react";
import { Result, Row, Col, Modal } from "antd";
import { ButtonPrimary, InputWrapper, Input, Button } from "../../../../styles";
import { ReactComponent as IconInvitation } from "../../../../assets/invitation/invite.svg";
import Axios from "../../../../utils/axios";
import {
  filterVals,
  roleNames,
  roleWeights,
  verboseErrors,
} from "../../../../utils";
import { REGISTER_DUMMY_ACCOUNT } from "../../../../graphql/members";
import { ErrorAlerts, parseErrors } from "../../../../utils";
import { errorsConfig } from "../../Members/MembersForm";
import { useLocale } from "../../../../utils/locale";

export default function DummyModal(props) {
  const [t] = useLocale();
  const { visible, handleSuccess, handleCancel, input, group_id } = props;

  useEffect(() => {
    const [firstName, lastName] = input.split(" ");
    setFirstName(firstName || "");
    setLastName(lastName || "");
  }, []);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [errors, setErrors] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const account = {
      first_name: firstName,
      last_name: lastName,
      organization,
      groups: [group_id],
    };

    const filteredAccount = filterVals((v) => v, account);
    try {
      const response = await Axios.post("/graphql", {
        query: REGISTER_DUMMY_ACCOUNT,
        variables: {
          account: filteredAccount,
        },
      });
      const { id } = response.data?.data.register_dummy_account;
      handleSuccess(id);
    } catch (err) {
      if (err.response.status === 422) {
        const { alerts, errors } = parseErrors(
          errorsConfig,
          err.response.data.errors[0].extensions?.validation?.account
        );
        setAlerts(alerts);
        setErrors(errors);
      }
    }
  };

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      zIndex={1059}
    >
      <Result
        icon={<IconInvitation fill="#527BDD" width="50" />}
        title={t("Create dummy account")}
        extra={
          <form
            onSubmit={onSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit(e);
            }}
          >
            <ErrorAlerts alerts={alerts} />
            <Row gutter={[15, 15]}>
              <Col span={12}>
                <InputWrapper margin="0">
                  <Input
                    required
                    type="text"
                    value={firstName}
                    autoFocus
                    ref={firstNameRef}
                    className={`dynamic-input ${firstName ? "has-value" : ""} ${
                      errors.email && "input-error"
                    }`}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <label
                    htmlFor=""
                    onClick={() => firstNameRef.current.focus()}
                  >
                    {t("First name")}
                  </label>
                </InputWrapper>
              </Col>
              <Col span={12}>
                <InputWrapper margin="0">
                  <Input
                    required
                    type="lastName"
                    value={lastName}
                    ref={lastNameRef}
                    className={`dynamic-input ${lastName ? "has-value" : ""} ${
                      errors.lastName && "input-error"
                    }`}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <label htmlFor="" onClick={() => lastNameRef.current.focus()}>
                    {t("Last name")}
                  </label>
                </InputWrapper>
              </Col>
              <Col span={24}>
                <ButtonPrimary className="small" style={{ width: "100%" }}>
                  {t("Create dummy account")}
                </ButtonPrimary>
              </Col>
            </Row>
          </form>
        }
      />
    </Modal>
  );
}
