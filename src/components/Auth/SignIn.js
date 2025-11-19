import React, { useCallback, useState, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useHistory } from "react-router-dom";
import { Row, Col } from "../UI/shadcn";
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
import { ThemeToggle } from "../UI/ThemeToggle";

import { messaging } from "../../store";
import { useLocale } from "../../utils/locale";

function refreshToken() {
  try {
    if (!messaging || !messaging.getToken) {
      console.log("Messaging not initialized, skipping token refresh");
      return Promise.resolve();
    }
    
    return messaging.getToken().then((token) => {
      if (!token) {
        console.log("No token received, skipping");
        return;
      }
      
      return Axios.post("/graphql", {
        query: SEND_PUSH_TOKEN,
        variables: {
          push_token: token,
        },
      }).then(() => {
        console.log("Notification token was set up");
      }).catch((err) => {
        console.error("Failed to send push token:", err);
      });
    }).catch((err) => {
      console.error("Failed to get messaging token:", err);
    });
  } catch (err) {
    console.error("[Custom Catch Error]-->", err);
    return Promise.resolve();
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
      
      // Validate inputs
      if (!email || !email.trim()) {
        setErrors({ email: [t("Email is required")] });
        toast.error({
          title: t("Validation Error"),
          description: t("Please enter your email address"),
        });
        return;
      }
      
      if (!password || !password.trim()) {
        setErrors({ password: [t("Password is required")] });
        toast.error({
          title: t("Validation Error"),
          description: t("Please enter your password"),
        });
        return;
      }
      
      setIsLoading(true);
      
      // Ensure query is a string
      const queryString = typeof SIGN_IN_MUTATION === 'string' 
        ? SIGN_IN_MUTATION 
        : String(SIGN_IN_MUTATION);
      
      const requestPayload = {
        query: queryString,
        variables: {
          email: email.trim(),
          password: password.trim(),
        },
      };
      
      // Validate that variables are not empty
      if (!requestPayload.variables.email || !requestPayload.variables.password) {
        toast.error({
          title: t("Validation Error"),
          description: t("Email and password are required"),
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Sending login request:', {
        url: '/graphql',
        queryLength: queryString.length,
        queryPreview: queryString.substring(0, 150) + '...',
        variables: { email: email.trim(), password: '***' },
        fullPayload: { ...requestPayload, variables: { ...requestPayload.variables, password: '***' } }
      });
      
      Axios.post("/graphql", requestPayload, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then((res) => {
          if (res?.data?.data?.sign_in) {
            props.signInSuccess(res.data.data.sign_in);
            
            // Set up push notifications (safe to fail)
            refreshToken().catch(err => {
              console.warn("Failed to set up push notifications:", err);
            });
            
            if (messaging && messaging.onTokenRefresh) {
              try {
                messaging.onTokenRefresh(() => {
                  refreshToken();
                });
              } catch (err) {
                console.warn("Failed to set up token refresh listener:", err);
              }
            }
            
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
          console.error('Login error:', err);
          console.error('Error response:', err.response);
          console.error('Error data:', err.response?.data);
          
          // Handle 400 Bad Request
          if (err.response?.status === 400) {
            const errorData = err.response.data;
            const firstError = errorData?.errors?.[0];
            const errorMessage = firstError?.message || errorData?.message || t("Invalid request. Please check your email and password.");
            const errorPath = firstError?.path ? ` at ${firstError.path.join('.')}` : '';
            
            console.error('400 Bad Request - Full error:', {
              message: errorMessage,
              path: errorPath,
              extensions: firstError?.extensions,
              fullError: firstError,
              allErrors: errorData?.errors
            });
            
            toast.error({
              title: t("Bad Request"),
              description: `${errorMessage}${errorPath}`,
            });
            
            // Try to extract validation errors
            if (errorData?.errors?.[0]?.extensions?.validation) {
              const { alerts, errors: validationErrors } = parseErrors(
                errorsConfig,
                errorData.errors[0].extensions.validation
              );
              setErrorAlerts(alerts);
              setErrors(validationErrors);
            } else {
              setErrorAlerts([errorMessage + errorPath]);
            }
          } else if (err.response?.status === 422) {
            const { alerts, errors: validationErrors } = parseErrors(
              errorsConfig,
              err.response.data?.errors[0]?.extensions?.validation
            );
            setErrorAlerts(alerts);
            setErrors(validationErrors);
            
            toast.error({
              title: t("Sign In Failed"),
              description: alerts[0] || t("Please check your credentials"),
            });
          } else {
            console.error('Unexpected error details:', {
              status: err.response?.status,
              message: err.message,
              response: err.response?.data,
              stack: err.stack
            });
            
            const errorMessage = err.response?.data?.errors?.[0]?.message || 
                                err.response?.data?.message || 
                                err.message || 
                                t("An unexpected error occurred");
            
            toast.error({
              title: t("Error"),
              description: errorMessage,
            });
            
            setErrorAlerts([errorMessage]);
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
      {/* Theme Toggle - Fixed Position */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'calc(var(--radius) - 2px)',
        boxShadow: '0 2px 8px hsl(var(--foreground) / 0.08)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'hsl(var(--muted-foreground))' }}>
          {t("Theme")}
        </span>
        <ThemeToggle />
      </div>

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
            <Title 
              margin="0 0 40px" 
              style={{ 
                color: 'hsl(var(--foreground))', 
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {t("Log in to your account")}
            </Title>
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
    background: "hsl(var(--muted) / 0.3)",
    backgroundSize: "cover",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    position: "relative",
    overflow: "hidden",
    borderLeftWidth: 1,
    borderLeftColor: "hsl(var(--border))",
    borderLeftStyle: "solid",
    borderTopWidth: 1,
    borderTopColor: "hsl(var(--border))",
    borderTopStyle: "solid",
    minHeight: 450,
    transition: "background 0.3s ease, border-color 0.3s ease",
  },
  textWrapper: {
    width: "100%",
    maxWidth: 450,
    padding: "80px 20px",
    color: "hsl(var(--foreground))",
    margin: "auto",
    textAlign: "center",
    zIndex: 2,
    transition: "color 0.3s ease",
  },
  title: {
    fontSize: 53,
    lineHeight: 1.1,
    color: "hsl(var(--foreground))",
    fontWeight: "700",
    transition: "color 0.3s ease",
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: "500",
    marginTop: 21,
    color: "hsl(var(--muted-foreground))",
    transition: "color 0.3s ease",
  },
  flag: {
    width: "100%",
    padding: 40,
    opacity: 0.12,
    position: "absolute",
    maxWidth: 500,
    transition: "opacity 0.3s ease",
  },
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ signInSuccess }, dispatch);

export default connect(null, mapDispatchToProps)(SignIn);
