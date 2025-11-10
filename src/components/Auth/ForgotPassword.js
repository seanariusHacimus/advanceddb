import React, { useCallback, useState, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useHistory } from "react-router-dom";
import { Row, Col } from "antd";
import Axios from "../../utils/axios";
import { signInSuccess } from "../../store/Auth/actions";
import { REQUEST_PASSWORD_RESET } from "../../graphql/auth";
// -------------- STYLES -----------
import { SignInPage } from "../../styles/auth";
import { Title } from "../../styles";
// -------------- SHADCN UI -----------
import { Button, Input, Label, FormGroup, FormError } from "../UI/shadcn";
import { useToast } from "../UI/shadcn/toast";
// -------------- ASSETS -----------
import iconLogo from "../../assets/logo.svg";
import ellipse from "../../assets/auth/shapes/ellipse.svg";
import ellipse2 from "../../assets/auth/shapes/ellipse2.svg";
import cubic from "../../assets/auth/shapes/cubics.svg";
import rectangle from "../../assets/auth/shapes/rectangle.svg";
import rectangle2 from "../../assets/auth/shapes/rectangle2.svg";
import { colors } from "../../constants";
import {
  ErrorAlerts,
  parseErrors,
  notEmptyErrorConfig,
  InputErrors,
} from "../../utils";
import { useLocale } from "../../utils/locale";

const errorsConfig = {
  email: {
    ...notEmptyErrorConfig,
    "should be existing": {
      msg: "should exist",
      alert: "Account does not exist",
    },
    "does not exist": {
      msg: "should exist",
      alert: "Account does not exist",
    },
    "should be active": {
      msg: false,
      alert: "Account is disabled",
    },
    "should be valid email": {
      msg: "invalid",
      alert: "Email is wrong",
    },
  },
};

function ForgotPasswordForm(props) {
  const [t] = useLocale();
  const { toast } = useToast();
  const emailRef = useRef();
  const [email, setEmail] = useState("");
  const [errorAlerts, setErrorAlerts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const updateValues = useCallback(
    (name, value) => {
      setEmail(value);
    },
    [setEmail]
  );

  const submitForm = useCallback(
    (e) => {
      e.preventDefault();
      setErrorAlerts([]);
      setErrors({});
      setIsLoading(true);
      Axios.post("/graphql", {
        query: REQUEST_PASSWORD_RESET,
        variables: {
          email,
        },
      })
        .then((res) => {
          if (res?.data) {
            const id = res.data.data.init_password_reset.id;
            toast.success({
              title: t("Success!"),
              description: t("Password reset instructions sent to your email"),
            });
            history.push(`/confirmation?reset_id=${id}&show_success=1`);
          }
        })
        .catch((err) => {
          if (err.message.includes("422")) {
            const { alerts, errors } = parseErrors(
              errorsConfig,
              err.response.data.errors[0].extensions.validation
            );
            setErrorAlerts(alerts);
            setErrors(errors);
            toast.error({
              title: t("Reset Failed"),
              description: alerts[0] || t("Please check your email"),
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
    [email, history, toast, t]
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
            <Title margin="0 0 40px">{t("Reset your password")}</Title>
            <form action="" autoComplete="off" onSubmit={submitForm}>
              <div style={{ position: "relative", marginBottom: '16px' }}>
                <ErrorAlerts alerts={errorAlerts} />
              </div>
              
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
                  onChange={(e) => updateValues("email", e.target.value)}
                />
                {errors.email?.length > 0 && (
                  <FormError>{errors.email?.join(", ")}</FormError>
                )}
              </FormGroup>
              
              <Button 
                type="submit" 
                style={{ width: '100%' }}
                disabled={isLoading}
              >
                {isLoading ? t("Submitting...") : t("Submit")}
              </Button>
            </form>
            <h4 style={{ marginTop: 40 }}>
              {t("Don’t have an account?")}{" "}
              <Link to="/request-access" width="auto" margin="30px 0 0">
                {t("Request access")}
              </Link>
            </h4>
          </div>
        </Col>
        <Col style={styles.backgroundImage} sm={24} lg={16} flex={5}>
          <img src={cubic} style={styles.cubic} alt={t("Cubic")} id="cubic" />
          <img
            src={ellipse}
            style={styles.ellipse}
            alt={t("ellipse")}
            id="ellipse"
          />
          <img
            src={ellipse2}
            style={styles.ellipse2}
            alt={t("ellipse2")}
            id="ellipse2"
          />
          <img
            src={rectangle}
            style={styles.rectangle}
            alt={t("rectangle")}
            id="rectangle"
          />
          <img
            src={rectangle2}
            style={styles.rectangle2}
            alt={t("rectangle2")}
            id="rectangle2"
          />
          <div style={styles.textWrapper}>
            <Title style={styles.title}>{t("Advance DB")}</Title>
            <p style={styles.subTitle}>{t("The Reform Tracking tool")}</p>
          </div>
        </Col>
      </Row>
    </SignInPage>
  );
}

const styles = {
  backgroundImage: {
    background: colors.primary,
    backgroundSize: "cover",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    position: "relative",
    overflow: "hidden",
  },
  textWrapper: {
    width: "100%",
    maxWidth: 450,
    padding: "80px 20px",
    color: "#fff",
    margin: "auto",
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
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ signInSuccess }, dispatch);

export default connect(null, mapDispatchToProps)(ForgotPasswordForm);
