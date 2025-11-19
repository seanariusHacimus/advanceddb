import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useHistory } from "react-router-dom";
import camelcaseKeys from "camelcase-keys";
import snakecase_keys from "snakecase-keys";
import { Row, Col } from "../UI/shadcn"; // Using shadcn grid
import { Select, Input as ShInput, Textarea, Label, FormGroup, FormError, Button } from "../UI/shadcn";
import { useToast } from "../UI/shadcn/toast";
import { EyeOff, Eye } from "lucide-react";
import { useQueryParam, StringParam } from "use-query-params";
import {
  REQUEST_ACCESS_MUTATION,
  FETCH_ORGANIZATIONS_AND_GROUP_INFOS,
  ACCOUNT_INFO,
} from "../../graphql/auth";
import Axios from "../../utils/axios";
// -------------- STYLES -----------
import { SignUp } from "../../styles/auth";
import {
  ButtonPrimary,
  ButtonSecondary,
  Flex,
  Input,
  InputWrapper,
  Title,
  TitleH3,
} from "../../styles";
// -------------- ASSETS -----------
import iconLogo from "../../assets/logo.svg";
import { ReactComponent as IconLogin } from "../../assets/auth/login.svg";
import ellipse from "../../assets/auth/shapes/ellipse.svg";
import ellipse2 from "../../assets/auth/shapes/ellipse2.svg";
import cubic from "../../assets/auth/shapes/cubics.svg";
import rectangle from "../../assets/auth/shapes/rectangle.svg";
import rectangle2 from "../../assets/auth/shapes/rectangle2.svg";
import { colors } from "../../constants";
import {
  dissoc,
  filterVals,
  parseErrors,
  InputErrors,
  ErrorAlerts,
  notEmptyErrorConfig,
  indexBy,
} from "../../utils";
import { useLocale } from "../../utils/locale";

const errorsConfig = {
  email: {
    ...notEmptyErrorConfig,
    "should be valid email": {
      alert: "Invalid input",
      msg: "invalid",
    },
    "already exist": {
      msg: "should be unique",
      alert: "Account with this email is already registered",
    },
    "is already on review": {
      msg: "should be unique",
      alert: "Account with this email is already registered",
    },
    "is disabled": {
      msg: false,
      alert: "Account with this email already exists and is disabled",
    },
  },
  first_name: notEmptyErrorConfig,
  last_name: notEmptyErrorConfig,
  middle_name: {},
  phone: notEmptyErrorConfig,
  organization: {},
  comment: {},
  prefix: {},
  job_position: {},
  password: {
    "should have more than 7 characters": {
      msg: "should be more than 7 characters",
      alert: "Invalid input",
    },
  },
  confirm_password: {
    "passwords should match": {
      msg: "Password does not match",
      alert: "Confirm password should match",
    },
  },
  member_groups: {
    "cannot be empty": {
      alert: "You must select a working group",
      msg: "Working group can't be empty",
    },
  },
};

const nullableFields = [
  "middle_name",
  "organization",
  "prefix",
  "job_position",
  "comment",
  "password",
];

const styles = {
  backgroundImage: {
    background: "rgb(99 143 225 / 6%)",
    backgroundSize: "cover",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    position: "relative",
    overflow: "hidden",
    borderLeftWidth: 1,
    borderLeftColor: "rgb(82 123 221 / 21%)",
    borderLeftStyle: "solid",
    borderTopWidth: 1,
    borderTopColor: "rgb(82 123 221 / 21%)",
    borderTopStyle: "solid",
    minHeight: 450,
  },
  textWrapper: {
    width: "100%",
    maxWidth: 420,
    padding: "80px 20px",
    color: "#fff",
    margin: "auto",
    zIndex: 2,
  },
  title: {
    fontSize: 43,
    lineHeight: 1.1,
    color: "#fff",
    fontWeight: "700",
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: "500",
    marginTop: 21,
    textAlign: "center",
  },
  cubic: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  ellipse: {
    position: "absolute",
    right: 0,
    bottom: "10%",
  },
  ellipse2: {
    position: "absolute",
    left: 0,
    transform: "translateX(-50%)",
  },
  rectangle: {
    position: "absolute",
    top: -7,
    left: "10%",
  },
  rectangle2: {
    position: "absolute",
    bottom: -40,
    left: 0,
  },
  flag: {
    width: "100%",
    padding: 40,
    // opacity: 0.12,
    position: "absolute",
    maxWidth: 800,
  },
};

function RequestAccess(props) {
  const [t] = useLocale();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    middleName: "",
    organization: "",
    comment: "",
    prefix: "",
    jobPosition: "",
    password: "",
    confirmPassword: "",
    member_groups: [],
    leader_groups: [],
  });
  const [fixedVals, setFixedVals] = useState({});
  const [allGroups, setAllGroups] = useState([]);
  const [errorAlerts, setErrorAlerts] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const {
    firstName,
    middleName,
    lastName,
    comment,
    email,
    prefix,
    phone,
    password,
    confirmPassword,
  } = account;

  const [accountId] = useQueryParam("account_id", StringParam);
  const [inviteToken] = useQueryParam("invite_token", StringParam);
  const history = useHistory();
  const hasInvite = !!(inviteToken && accountId);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.post("/graphql", {
          query: FETCH_ORGANIZATIONS_AND_GROUP_INFOS,
        });
        if (res?.data?.data) {
          const { indicator_group_infos } = res.data.data;
          setAllGroups(indexBy(indicator_group_infos.nodes, "id"));
        }
      } catch (err) {
        console.error("[Custom Catch Error]-->", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (accountId) {
      (async () => {
        try {
          const res = await Axios.post("/graphql", {
            query: ACCOUNT_INFO,
            variables: { id: accountId },
          });
          const accountInfo = res.data.data.account_info;
          if (res?.data?.data) {
            if (!accountInfo) {
              // if account was deleted, then proceed with simple request access
              history.push(`/request-access`);
            } else if (!["invite_sent"].includes(accountInfo.status)) {
              history.push(
                `/confirmation?account_id=${accountInfo.id}&${
                  inviteToken ? `&invite_token=${inviteToken}` : ""
                }`
              );
            } else {
              console.log(hasInvite);
              const { leader_groups, member_groups, ...shortInfo } =
                accountInfo;
              const accountDeails = hasInvite ? shortInfo : accountInfo;
              setAccount({
                ...account,
                ...filterVals((v) => v, {
                  ...camelcaseKeys(accountDeails),
                  organization: accountInfo.organization?.title,
                }),
              });
              if (accountInfo.status !== "unconfirmed") {
                setFixedVals(accountInfo);
              }
            }
          }
        } catch (err) {
          console.error("[Custom Catch Error]-->", err);
        }
      })();
    }
  }, [accountId, inviteToken]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setErrors(dissoc(errors, name));
    setAccount({ ...account, ...camelcaseKeys({ [name]: value }) });
  };
  const submitForm = async (e) => {
    e.preventDefault();
    setErrorAlerts([]);
    setErrors({});
    setIsLoading(true);

    const snakecase_account = snakecase_keys(account);
    const filteredAccount = Object.keys(snakecase_account).reduce(
      (acc, name) => {
        const val = snakecase_account[name];
        console.log(acc);
        return {
          ...acc,
          [name]: nullableFields.includes(name) ? val || null : val || "",
        };
      },
      {}
    );

    console.log(filteredAccount);
    try {
      const res = await Axios.post("/graphql", {
        query: REQUEST_ACCESS_MUTATION,
        variables: {
          account: dissoc(filteredAccount, "id", "role", "status", "type"),
          has_invite: hasInvite,
        },
      });
      const createdAccount = res?.data.data.register_account;
      if (res.status === 200) {
        toast.success({
          title: t("Success!"),
          description: t("Registration request submitted successfully"),
        });
        history.push(
          `/confirmation?account_id=${createdAccount.id}&${
            inviteToken ? `&invite_token=${inviteToken}` : ""
          }`
        );
      }
    } catch (err) {
      if (err.message.includes("422")) {
        const { alerts, errors } = parseErrors(
          errorsConfig,
          err.response.data.errors[0].extensions?.validation?.account
        );
        setErrorAlerts(alerts);
        setErrors(errors);
        toast.error({
          title: t("Registration Failed"),
          description: alerts[0] || t("Please check your input"),
        });
      } else {
        toast.error({
          title: t("Error"),
          description: t("An unexpected error occurred"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const firstNameRef = useRef(null);
  const middleNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const prefixRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const showCommentBlock = !account.type || account.type === "requested";
  const showPasswordBlock =
    account.type &&
    account.type === "invited" &&
    account.status === "invite_sent";
  const showGroupsSelect =
    !account.id || ["member", "leader"].includes(account.role);

  return (
    <SignUp>
      <Row style={{ flex: 1 }}>
        <Col xs={24} lg={16}>
          <div className="inner-container">
            <Flex jc="center" className="logo-wrapper">
              <Link to="/sign-in" id="sig-in-btn">
                <IconLogin style={{ marginRight: 5 }} /> {t("Log in")}
              </Link>
              <Link to="/" id="logo">
                <img
                  src={iconLogo}
                  alt={t("AdvancedDB logo")}
                  style={{ width: 150 }}
                />
              </Link>
            </Flex>

            <Title margin="0 0 10px">{!hasInvite && t("Request access")}</Title>
            {hasInvite && (
              <TitleH3 margin="0 0 40px">
                {t(
                  "Please complete the information below to finalize your registration."
                )}
              </TitleH3>
            )}
            <form action="" onSubmit={submitForm} autoComplete="off">
              <ErrorAlerts alerts={errorAlerts} style={{ margin: 10 }} />
              <Row gutter={[0, 0]}>
                <Col xs={24} sm={12}>
                  <FormGroup style={{ margin: "10px" }}>
                    <Label htmlFor="first_name">{t("First name")} *</Label>
                    <ShInput
                      type="text"
                      disabled={fixedVals.first_name}
                      name="first_name"
                      id="first_name"
                      value={firstName}
                      onChange={handleInput}
                      autoComplete="given-name"
                    />
                    <InputErrors name={"first_name"} errors={errors} />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={12}>
                  <FormGroup style={{ margin: "10px" }}>
                    <Label htmlFor="last_name">{t("Last name")} *</Label>
                    <ShInput
                      type="text"
                      disabled={fixedVals.last_name}
                      name="last_name"
                      id="last_name"
                      value={lastName}
                      onChange={handleInput}
                      autoComplete="family-name"
                    />
                    <InputErrors name={"last_name"} errors={errors} />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={12}>
                  <FormGroup style={{ margin: "10px" }}>
                    <Label htmlFor="middle_name">{t("Middle name(optional)")}</Label>
                    <ShInput
                      type="text"
                      name="middle_name"
                      id="middle_name"
                      disabled={fixedVals.middle_name}
                      value={middleName}
                      onChange={handleInput}
                      autoComplete="additional-name"
                    />
                    <InputErrors name={"middle_name"} errors={errors} />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={12}>
                  <FormGroup style={{ margin: "10px" }}>
                    <Label htmlFor="prefix">{t("prefix(optional)")}</Label>
                    <ShInput
                      type="text"
                      name="prefix"
                      id="prefix"
                      disabled={fixedVals.prefix}
                      value={prefix}
                      onChange={handleInput}
                      autoComplete="honorific-suffix"
                    />
                    <InputErrors name={"prefix"} errors={errors} />
                  </FormGroup>
                </Col>
                {showGroupsSelect && (
                  <Col span={24}>
                    <InputWrapper
                      style={{ margin: 10 }}
                      className="has-messages"
                    >
                      <Select
                        showSearch
                        placeholder={t("Select a Working Group")}
                        onChange={(val) =>
                          setAccount({ ...account, member_groups: [val] })
                        }
                        disabled={
                          fixedVals.member_groups?.length > 0 || hasInvite
                        }
                        value={account.member_groups[0]}
                        style={{ width: "100%" }}
                        className={`custom-select ${
                          errors.member_groups && "input-error"
                        } ${
                          account.member_groups.length > 0 ? "has-value" : ""
                        }`}
                        optionFilterProp="children"
                        allowClear
                        multiple={false}
                        getPopupContainer={(node) => node.parentNode}
                        dropdownStyle={{
                          backgroundColor: "#535263",
                          padding: 10,
                        }}
                      >
                        {Object.keys(allGroups).map((key) => (
                          <Select.Option
                            key={key}
                            className="select-item"
                            value={key}
                          >
                            {allGroups[key].title}
                          </Select.Option>
                        ))}
                      </Select>
                      <label htmlFor="" className="custom-select-label">
                        {t("Working group")}
                      </label>
                      <InputErrors name={"member_groups"} errors={errors} />
                    </InputWrapper>
                  </Col>
                )}
                <Col xs={24} sm={12}>
                  <FormGroup style={{ margin: "10px" }}>
                    <Label htmlFor="phone">{t("Phone number")} *</Label>
                    <ShInput
                      type="tel"
                      name="phone"
                      id="phone"
                      disabled={fixedVals.phone}
                      value={phone}
                      onChange={handleInput}
                      autoComplete="tel"
                    />
                    <InputErrors name={"phone"} errors={errors} />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={12}>
                  <InputWrapper
                    style={{ margin: "10px" }}
                    className="has-messages"
                    align="flex-end"
                  >
                    <Input
                      type="email"
                      name="email"
                      disabled={fixedVals.email}
                      value={email}
                      ref={emailRef}
                      autoComplete="new-email"
                      className={`dynamic-input ${email ? "has-value" : ""}`}
                      onChange={handleInput}
                      hasErrors={errors.email}
                    />
                    <label htmlFor="" onClick={() => emailRef.current.focus()}>
                      {t("Email address")}
                    </label>
                    <InputErrors name={"email"} errors={errors} />
                  </InputWrapper>
                </Col>
                {showCommentBlock && (
                  <Col span={24}>
                    <InputWrapper
                      style={{ margin: "10px" }}
                      className="has-messages"
                      align="flex-end"
                    >
                      <AntInput.TextArea
                        rows={4}
                        width="100%"
                        placeholder={t("Additional comments")}
                        name="comment"
                        disabled={fixedVals.comment}
                        value={comment}
                        className={`dynamic-input ${
                          comment ? "has-value" : ""
                        }`}
                        onChange={handleInput}
                      />
                      <InputErrors name={"comment"} errors={errors} />
                    </InputWrapper>
                  </Col>
                )}
                {showPasswordBlock && (
                  <>
                    <Col xs={24} sm={12}>
                      <InputWrapper
                        className="has-input-icon has-messages"
                        align="flex-end"
                        style={{ margin: "10px" }}
                      >
                        <Input
                          type={showPassword ? "password" : "text"}
                          name="password"
                          value={password}
                          ref={passwordRef}
                          autoComplete="new-password"
                          className={`dynamic-input ${
                            password ? "has-value" : ""
                          }`}
                          onChange={handleInput}
                        />
                        <label
                          htmlFor=""
                          onClick={() => passwordRef.current.focus()}
                        >
                          {t("Choose a Password")}
                        </label>
                        <span
                          className="password-toggler"
                          onClick={() => setShowPassword((visible) => !visible)}
                          style={{ position: "absolute", right: 10, top: 15 }}
                        >
                          {showPassword ? (
                            <EyeTwoTone twoToneColor="#527bdd" />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </span>
                        <InputErrors name={"password"} errors={errors} />
                      </InputWrapper>
                    </Col>
                    <Col xs={24} sm={12}>
                      <InputWrapper
                        className="has-input-icon"
                        style={{ margin: "10px" }}
                      >
                        <Input
                          type={showPassword ? "password" : "text"}
                          name="confirm_password"
                          value={confirmPassword}
                          ref={confirmPasswordRef}
                          autoComplete="new-password"
                          className={`dynamic-input ${
                            confirmPassword ? "has-value" : ""
                          }`}
                          onChange={handleInput}
                        />
                        <label
                          htmlFor=""
                          onClick={() => confirmPasswordRef.current.focus()}
                        >
                          {t("Confirm Password")}
                        </label>
                        <span
                          className="password-toggler"
                          onClick={() => setShowPassword((visible) => !visible)}
                          style={{ position: "absolute", right: 10, top: 15 }}
                        >
                          {showPassword ? (
                            <EyeTwoTone twoToneColor="#527bdd" />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </span>
                        <InputErrors
                          name={"confirm_password"}
                          errors={errors}
                        />
                      </InputWrapper>
                    </Col>
                  </>
                )}
                <Col span={24}>
                  <Flex margin="10px">
                    <ButtonSecondary
                      className="transparent"
                      width="calc(50%)"
                      margin="10px 10px 10px 0"
                      type="button"
                      onClick={() => props.history.push("/members")}
                    >
                      {t("Cancel")}
                    </ButtonSecondary>
                    <ButtonPrimary
                      width="calc(50%)"
                      margin="10px 0px 10px 10px"
                    >
                      {t("Submit")}
                    </ButtonPrimary>
                  </Flex>
                  {/* <div style={{ margin: 10 }}>
                      <ButtonPrimary>Submit</ButtonPrimary>
                    </div> */}
                </Col>
              </Row>
            </form>
          </div>
        </Col>
        <Col style={styles.backgroundImage} xs={24} lg={8} flex={5}>
          <img src={iconLogo} alt="edbm" style={styles.flag} />
          {/* <img src={cubic} style={styles.cubic} alt={t("Cubic")} id="cubic" />
          <img src={ellipse} style={styles.ellipse} alt={t("ellipse")} id="ellipse" />
          <img src={ellipse2} style={styles.ellipse2} alt={t("ellipse2")} id="ellipse2" />
          <img src={rectangle} style={styles.rectangle} alt={t("rectangle")} id="rectangle" />
          <img src={rectangle2} style={styles.rectangle2} alt={t("rectangle2")} id="rectangle2" />
          <div style={styles.textWrapper}>
            <Title style={styles.title}>{t("Advance DB")}</Title>
            <p style={styles.subTitle}>
              {t("The Reform Tracking tool")}
            </p>
          </div> */}
        </Col>
      </Row>
    </SignUp>
  );
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(null, mapDispatchToProps)(RequestAccess);
