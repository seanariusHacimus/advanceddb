import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from '../../utils/axios';
import { UPDATE_MY_PASSWORD } from '../../graphql/profile';
import { authUpdate } from '../../store/Auth/actions';
import { InputErrors, parseErrors } from "../../utils";

// -------- ASSETS & STYLES ------------
import {
  TitleH1, Flex, ButtonPrimary, Input, InputWrapper,
} from '../../styles';
import { ProfileEditPage } from '../../styles/profile';
import iconSave from '../../assets/profile/save.svg';
import iconError from '../../assets/auth/error.svg';
import {withLocale} from "../../utils/locale";

const errorsConfig = {
  "old_password": {
    "should match old password": {
      alert: "You have entered a wrong password",
      msg: "You have entered a wrong password"
    },
  },
  "new_password": {
    "should not match old password": {
      alert: "You can't use your current password",
      msg: "You can't use your current password"
    },
    "should have more than 7 characters": {
      alert: "Your password must be at least 7 characters or more",
      msg: "Your password must be at least 7 characters or more"
    },
    "should be string": {
      alert: "Password must be string",
      msg: "Password must be string"
    },
  }
};

class PasswordEdit extends Component {
  state = {
    new_password: '',
    old_password: '',
    confirmPassword: '',
    errors: { new_password: [], old_password: [] },
    alerts: [],
    oldPasswordType: true,
    newPasswordType: true,
  }

  handleSubmit = async (e) => {
    const {t} = this.props
    const { old_password, new_password } = this.state;
    const formData = {
      query: UPDATE_MY_PASSWORD,
      variables: {
        new_password,
        old_password,
      },
    };

    try {
      const res = await Axios.post('/graphql', formData);
      if (res?.data.data) {
        Swal.fire({
          title: t('Updated'),
          text: t('Your password has been updated successfully.'),
          icon: 'success',
        }).then((result) => {
          // TODO signout
          this.props.history.push('/profile');
        });
      }
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
      const { alerts, errors } = parseErrors(errorsConfig, err.response.data.errors[0].extensions?.validation);
      this.setState({ alerts, errors })
    }
  }

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const {t} = this.props
    const {
      new_password, confirmPassword, errors, old_password, oldPasswordType, newPasswordType
    } = this.state;

    return (
      <ProfileEditPage id="profile-page">
        <Flex>
          <TitleH1>{t("Set a new password")}</TitleH1>
          <div className="btn-group">
            <Link to="/profile" className="edit-btn transparent small">{t("Cancel")}</Link>
            <ButtonPrimary className="small" onClick={this.handleSubmit}
              disabled={new_password?.length < 8 || new_password !== confirmPassword}>
              <img src={iconSave} alt={t("Profile")} />
              {' '}
              {t("Save")}
            </ButtonPrimary>
          </div>
        </Flex>
        <Row gutter={[10, 0]} style={{ margin: '20px 0 15px' }}>
          <Col span={24}>
            <InputWrapper className="has-input-icon">
              <Input
                required
                type={oldPasswordType ? 'password' : 'text'}
                name="old_password"
                value={old_password}
                ref={(el) => this.oldPasswordRef = el}
                autoComplete="new-password"
                className={`dynamic-input ${errors?.old_password?.length ? 'input-error' : ''} ${old_password ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.oldPasswordRef.focus()}>{t("Current password")}</label>
              <span
                className="password-toggler"
                onClick={() => this.setState(prevState => ({ oldPasswordType: !prevState.oldPasswordType }))}
              >{oldPasswordType ? <EyeTwoTone twoToneColor="#527bdd" /> : <EyeInvisibleOutlined />}</span>
              <InputErrors name={'old_password'} errors={errors} />
            </InputWrapper>
          </Col>
          <Col span={24}>
            <InputWrapper className="has-input-icon">
              <Input
                required
                type={newPasswordType ? 'password' : 'text'}
                name="new_password"
                value={new_password}
                ref={(el) => this.new_passwordRef = el}
                autoComplete="new-password"
                className={`dynamic-input ${errors.new_password?.length ? 'input-error' : ''} ${new_password ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.new_passwordRef.focus()}>{t("New password")}</label>
              <span
                className="password-toggler"
                onClick={() => this.setState(prevState => ({ newPasswordType: !prevState.newPasswordType }))}
              >{newPasswordType ? <EyeTwoTone twoToneColor="#527bdd" /> : <EyeInvisibleOutlined />}</span>
              {
                new_password && new_password.length < 8
                && (
                  <>
                    <img src={iconError} alt={t("tick")} className="input-icon error" />
                    <span className="input-msg">{t("At least 8 characters")}</span>
                  </>
                )
              }
              <InputErrors name={'new_password'} errors={errors} />
            </InputWrapper>
          </Col>
          <Col span={24}>
            <InputWrapper className="has-input-icon">
              <Input
                required
                type={newPasswordType ? 'password' : 'text'}
                name="confirmPassword"
                value={confirmPassword}
                ref={(el) => this.confirmPasswordRef = el}
                autoComplete="new-password"
                className={`dynamic-input ${errors.new_password?.length ? 'input-error' : ''} ${confirmPassword ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.confirmPasswordRef.focus()}>{t("Confirm new password")}</label>
              <span
                className="password-toggler"
                onClick={() => this.setState(prevState => ({ newPasswordType: !prevState.newPasswordType }))}
              >{newPasswordType ? <EyeTwoTone twoToneColor="#527bdd" /> : <EyeInvisibleOutlined />}</span>
              {
                confirmPassword && new_password && confirmPassword !== new_password
                && (
                  <>
                    <img src={iconError} alt={t("tick")} className="input-icon error" />
                    <span className="input-msg">{t("Password does not match")}</span>
                  </>
                )
              }
              <InputErrors name={'new_password'} errors={errors} />
            </InputWrapper>
          </Col>
        </Row>

      </ProfileEditPage>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.auth });
const mapDispatchToProps = (dispatch) => bindActionCreators({ authUpdate }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocale(PasswordEdit)));
