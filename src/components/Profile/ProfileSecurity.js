import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col } from "../UI/shadcn"; // Using shadcn grid
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import Axios from "../../utils/axios";
import { UPDATE_MY_PASSWORD } from "../../graphql/profile";
import { authUpdate, signOutAction } from "../../store/Auth/actions";
import { InputErrors, parseErrors } from "../../utils";

// -------- ASSETS & STYLES ------------
import {
  TitleH1,
  Flex,
} from "../../styles";
import { ProfileEditPage } from "../../styles/profile";
import iconSave from "../../assets/profile/save.svg";
import iconError from "../../assets/auth/error.svg";
import { withLocale } from "../../utils/locale";
import { useToast } from "../UI/shadcn/toast";
import { Input, Label, FormGroup, Button, FormError } from "../UI/shadcn";

const errorsConfig = {
  old_password: {
    "should match old password": {
      alert: "You have entered a wrong password",
      msg: "You have entered a wrong password",
    },
  },
  new_password: {
    "should not match old password": {
      alert: "You can't use your current password",
      msg: "You can't use your current password",
    },
    "should have more than 7 characters": {
      alert: "Your password must be at least 7 characters or more",
      msg: "Your password must be at least 7 characters or more",
    },
    "should be string": {
      alert: "Password must be string",
      msg: "Password must be string",
    },
  },
};

// Wrapper to use hooks with class component
const withToast = (Component) => {
  return (props) => {
    const toast = useToast();
    return <Component {...props} toast={toast} />;
  };
};

// Simple PasswordInput component
const PasswordInput = ({ value, onChange, name, id, ...props }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  return (
    <div style={{ position: 'relative' }}>
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'hsl(var(--muted-foreground))',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {showPassword ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
            <line x1="2" x2="22" y1="2" y2="22"/>
          </svg>
        )}
      </button>
    </div>
  );
};

class PasswordEdit extends Component {
  state = {
    new_password: "",
    old_password: "",
    confirmPassword: "",
    errors: { new_password: [], old_password: [] },
    alerts: [],
    oldPasswordType: true,
    newPasswordType: true,
  };

  handleSubmit = async (e) => {
    const { t } = this.props;
    const { old_password, new_password } = this.state;
    const formData = {
      query: UPDATE_MY_PASSWORD,
      variables: {
        new_password,
        old_password,
      },
    };

    try {
      const res = await Axios.post("/graphql", formData);
      if (res?.data.data) {
        this.props.toast.success(t("Your password has been updated successfully."));
        this.props.signOutAction();
      }
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
      const { alerts, errors } = parseErrors(
        errorsConfig,
        err.response.data.errors[0].extensions?.validation
      );
      this.setState({ alerts, errors });
    }
  };

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { t } = this.props;
    const {
      new_password,
      confirmPassword,
      errors,
      old_password,
      oldPasswordType,
      newPasswordType,
    } = this.state;

    return (
      <ProfileEditPage id="profile-page">
        <Flex>
          <TitleH1>{t("Set a new password")}</TitleH1>
          <div className="btn-group" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/settings/profile">
              <Button variant="outline" size="sm">
                {t("Cancel")}
              </Button>
            </Link>
            <Button 
              size="sm"
              onClick={this.handleSubmit}
              disabled={
                new_password?.length < 8 || new_password !== confirmPassword
              }
            >
              <img src={iconSave} alt={t("Profile")} style={{ marginRight: '8px', width: '16px', height: '16px' }} /> 
              {t("Save")}
            </Button>
          </div>
        </Flex>
        <Row gutter={[10, 0]} style={{ margin: "20px 0 15px" }}>
          <Col span={24}>
            <FormGroup>
              <Label htmlFor="old_password">{t("Current password")} *</Label>
              <PasswordInput
                required
                name="old_password"
                id="old_password"
                value={old_password}
                autoComplete="current-password"
                onChange={this.handleInput}
              />
              <InputErrors name={"old_password"} errors={errors} />
            </FormGroup>
          </Col>
          <Col span={24}>
            <FormGroup>
              <Label htmlFor="new_password">{t("New password")} *</Label>
              <PasswordInput
                required
                name="new_password"
                id="new_password"
                value={new_password}
                autoComplete="new-password"
                onChange={this.handleInput}
              />
              {new_password && new_password.length < 8 && (
                <FormError>{t("At least 8 characters")}</FormError>
              )}
              <InputErrors name={"new_password"} errors={errors} />
            </FormGroup>
          </Col>
          <Col span={24}>
            <FormGroup>
              <Label htmlFor="confirmPassword">{t("Confirm new password")} *</Label>
              <PasswordInput
                required
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={this.handleInput}
              />
              {confirmPassword &&
                new_password &&
                confirmPassword !== new_password && (
                  <FormError>{t("Password does not match")}</FormError>
                )}
              <InputErrors name={"new_password"} errors={errors} />
            </FormGroup>
          </Col>
        </Row>
      </ProfileEditPage>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.auth });
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ authUpdate, signOutAction }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withLocale(withToast(PasswordEdit))));
