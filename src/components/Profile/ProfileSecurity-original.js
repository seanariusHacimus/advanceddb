import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from '../../utils/axios';
import { UPDATE_MY_ACCOUNT_MUTATION } from '../../graphql/profile';
import { authUpdate } from '../../store/Auth/actions';

// -------- ASSETS & STYLES ------------
import {
  TitleH1, Flex, ButtonPrimary, Input, InputWrapper,
} from '../../styles';
import { ProfileEditPage } from '../../styles/profile';
import iconSave from '../../assets/profile/save.svg';
import iconError from '../../assets/auth/error.svg';
import {withLocale} from "../../utils/locale";

class PasswordEdit extends Component {
  state = {
    password: '',
    confirmPassword: '',
  }

  handleSubmit = async (e) => {
    const {t} = this.props
    const account = this.state;
    const formData = {
      query: UPDATE_MY_ACCOUNT_MUTATION,
      variables: {
        account: {
          password: account.password
        },
      },
    };

    try {
      const res = await Axios.post('/graphql', formData);
      if (res?.data.data) {
        this.props.authUpdate({ account: res.data.data.update_my_account });
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
    }
  }

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const {t} = this.props
    const {
      password, confirmPassword
    } = this.state;

    return (
      <ProfileEditPage id="profile-page">
        <Flex>
          <TitleH1>{t("Set a new password")}</TitleH1>
          <div className="btn-group">
            <Link to="/profile" className="edit-btn transparent small">{t("Cancel")}</Link>
            <ButtonPrimary className="small" onClick={this.handleSubmit}
              disabled={password?.length < 8 || password !== confirmPassword}>
              <img src={iconSave} alt={t("Profile")} />
              {' '}
              {t("Save")}
            </ButtonPrimary>
          </div>
        </Flex>
        <Row gutter={[10, 0]} style={{ margin: '20px 0 15px' }}>
          <Col span={24} md={12}>
            <InputWrapper className="has-input-icon">
              <Input
                required
                type="password"
                name="password"
                value={password}
                ref={(el) => this.passwordRef = el}
                autoComplete="new-password"
                className={`dynamic-input ${password ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.passwordRef.focus()}>{t("New password")}</label>
              {
                password && password.length < 8
                && (
                  <>
                    <img src={iconError} alt={t("tick")} className="input-icon error" />
                    <span className="input-msg">{t("At least 8 characters")}</span>
                  </>
                )
              }
            </InputWrapper>
          </Col>
          <Col span={24} md={12}>
            <InputWrapper className="has-input-icon">
              <Input
                required
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                ref={(el) => this.confirmPasswordRef = el}
                autoComplete="new-password"
                className={`dynamic-input ${confirmPassword ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.confirmPasswordRef.focus()}>{t("Confirm new password")}</label>
              {
                confirmPassword && password && confirmPassword !== password
                && (
                  <>
                    <img src={iconError} alt={t("tick")} className="input-icon error" />
                    <span className="input-msg">{t("Password does not match")}</span>
                  </>
                )
              }
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
