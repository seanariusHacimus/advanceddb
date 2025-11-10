import React, { useCallback, useState, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useHistory } from "react-router-dom";
import { Row, Col } from "antd";
import Axios from "../../utils/axios";
import { dissoc, ErrorAlerts, parseErrors } from "../../utils";
import { signInSuccess } from "../../store/Auth/actions";
import { SEND_PUSH_TOKEN, SIGN_IN_MUTATION } from "../../graphql/auth";
// -------------- STYLES -----------
import { SignInPage } from "../../styles/auth";
import { Flex, Title } from "../../styles";
// -------------- ASSETS -----------
import iconLogo from "../../assets/logo.svg";
// -------------- SHADCN UI -----------
import { Button, Input, Label, FormGroup, FormError, Checkbox } from "../UI/shadcn";
import { useToast } from "../UI/shadcn/toast";

import { messaging } from "../../store";
import { useLocale } from "../../utils/locale";

function refreshToken() {
  try {
    return messaging.getToken().then((token) => {
      Axios.post("/graphql", {
        query: SEND_PUSH_TOKEN,
        variables: {
          push_token: token,
        },
      }).then(() => {
        console.log("Notification token was set up");
      });
    });
  } catch (err) {
    console.error("[Custom Catch Error]-->", err);
  }
}

const errorsConfig = {
  email: {
    "does not exist": {
      msg: "is wrong",
      alert: "Account does not exist",
    },
    "should be active": {
      msg: null,
      alert: "Account is disabled",
    },
    "is wrong": {
      msg: "invalid",
      alert: "Email or password is wrong",
    },
    "should be existing": {
      msg: "invalid",
      alert: "Email or password is wrong",
    },
  },
  password: {
    "is wrong": {
      msg: "invalid",
      alert: false,
    },
  },
};

function SignIn(props) {
  const { toast } = useToast();
  const emailRef = useRef();
  const passwordRef = useRef();
  const messageRef = useRef();
  const checkRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorAlerts, setErrorAlerts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [t] = useLocale();

  const submitForm = useCallback(
    (e) => {
      e.preventDefault();
      setErrorAlerts([]);
      setErrors({});
      setIsLoading(true);
      Axios.post("/graphql", {
        query: SIGN_IN_MUTATION,
        variables: {
          email,
          password,
        },
      })
        .then((res) => {
          if (res?.data) {
            props.signInSuccess(res.data.data.sign_in);
            refreshToken();
            messaging.onTokenRefresh(() => {
              refreshToken();
            });
            
            toast.success({
              title: t("Welcome back!"),
              description: t("You have successfully signed in."),
            });
            
            if (res.data.data.sign_in.account.request_password_change) {
              history.push("/settings/profile/security");
            }
          } else {
            setErrorAlerts([t("Email or password is wrong")]);
            toast.error({
              title: t("Sign In Failed"),
              description: t("Email or password is wrong"),
            });
          }
        })
        .catch((err) => {
          if (err.message.includes("422")) {
            const { alerts, errors } = parseErrors(
              errorsConfig,
              err.response.data?.errors[0]?.extensions?.validation
            );
            setErrorAlerts(alerts);
            setErrors(errors);
            
            toast.error({
              title: t("Sign In Failed"),
              description: alerts[0] || t("Please check your credentials"),
            });
          } else {
            toast.error({
              title: t("Error"),
              description: t("An unexpected error occurred"),
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [email, password, props, toast, t, history]
  );

  return (
    <SignInPage>
      <Row style={{ flex: 1 }}>
        <Col xs={24} lg={8}>
          <div className="inner-container">
            <Link to="/" id="logo">
              <img
                src={iconLogo}
                alt={t("AdvancedDB logo")}
                style={{ width: 150 }}
              />
            </Link>
            <Title margin="0 0 40px">{t("Log in to your account")}</Title>
            <form action="" autoComplete="off" onSubmit={submitForm}>
              <div ref={messageRef} style={{ position: "relative", marginBottom: '16px' }}>
                <ErrorAlerts alerts={errorAlerts} />
              </div>
              <input type="password" name="" hidden />
              <input type="password" name="" hidden />
              <input type="password" name="" hidden />
              
              <FormGroup>
                <Label data-required="true">{t("Email address")}</Label>
                <Input
                  required
                  type="email"
                  name="email"
                  value={email}
                  ref={emailRef}
                  autoComplete="new-email"
                  placeholder={t("Enter your email")}
                  hasError={errors.email?.length > 0}
                  onChange={(e) => {
                    setErrors(dissoc(errors, "email"));
                    setEmail(e.target.value);
                  }}
                />
                {errors.email?.length > 0 && (
                  <FormError>{errors.email?.join(", ")}</FormError>
                )}
              </FormGroup>

              <FormGroup>
                <Label data-required="true">{t("Password")}</Label>
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  ref={passwordRef}
                  placeholder={t("Enter your password")}
                  hasError={errors.password?.length > 0}
                  showPasswordToggle
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onChange={(e) => {
                    setErrors(dissoc(errors, "password"));
                    setPassword(e.target.value);
                  }}
                />
                {errors.password?.length > 0 && (
                  <FormError>{errors.password?.join(", ")}</FormError>
                )}
              </FormGroup>

              <Flex jc="space-between" margin="0 0 24px" style={{ alignItems: 'center' }}>
                <Checkbox
                  checked={remember}
                  onCheckedChange={setRemember}
                  label={t("Remember my entry")}
                />
                <Link to="/forgot-password" style={{ 
                  color: 'hsl(var(--primary))', 
                  fontSize: '14px',
                  textDecoration: 'none'
                }}>
                  {t("Forgot password?")}
                </Link>
              </Flex>
              <Button 
                type="submit" 
                style={{ width: '100%' }}
                disabled={isLoading}
              >
                {isLoading ? t("Signing in...") : t("Sign In")}
              </Button>
            </form>
            <h4 style={{ marginTop: 40 }}>
              <Link to="/request-access" width="auto" margin="30px 0 0">
                {t("Request access")}
              </Link>
            </h4>
          </div>
        </Col>
        <Col style={styles.backgroundImage} sm={24} lg={16} flex={5}>
          <img src={iconLogo} alt={t("EDBM")} style={styles.flag} id="flag" />
          {/* <div style={styles.textWrapper}>
            <Title style={styles.title}>{t("Advance DB")}</Title>
            <p style={styles.subTitle}>{t("The Reform Tracking tool")}</p>
          </div> */}
        </Col>
      </Row>
    </SignInPage>
  );
}

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
    maxWidth: 450,
    padding: "80px 20px",
    color: "#fff",
    margin: "auto",
    textAlign: "center",
    zIndex: 2,
  },
  title: {
    fontSize: 53,
    lineHeight: 1.1,
    color: "#fff",
    fontWeight: "700",
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: "500",
    marginTop: 21,
  },
  flag: {
    width: "100%",
    padding: 40,
    // opacity: 0.12,
    position: "absolute",
    maxWidth: 500,
  },
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ signInSuccess }, dispatch);

export default connect(null, mapDispatchToProps)(SignIn);
