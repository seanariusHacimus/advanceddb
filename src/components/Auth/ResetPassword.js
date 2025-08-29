import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {
  Row, Col, Button,
} from 'antd';
import { CANCEL_RESET_PASSWORD, FETCH_RESET_PASSWORD_INFO, RESET_PASSWORD_MUTATION } from '../../graphql/auth';
import Axios from '../../utils/axios';
// -------------- STYLES -----------
import { RequestAccessPage } from '../../styles/auth';
import {
  ButtonPrimary,
  Flex,
  Input,
  InputWrapper,
  Title,
} from '../../styles';
// -------------- ASSETS -----------
import { ReactComponent as IconLogin } from '../../assets/auth/login.svg';
import iconlogo from '../../assets/logo.png';
import ellipse from '../../assets/auth/shapes/ellipse.svg';
import ellipse2 from '../../assets/auth/shapes/ellipse2.svg';
import cubic from '../../assets/auth/shapes/cubics.svg';
import rectangle from '../../assets/auth/shapes/rectangle.svg';
import rectangle2 from '../../assets/auth/shapes/rectangle2.svg';
import { colors } from '../../constants';
import { dissoc, ErrorAlerts, InputErrors, parseErrors } from "../../utils";
import { withLocale } from "../../utils/locale";


const errorsConfig = {
  reset_token: {
    "should be existing": {
      msg: false,
      alert: "Token is wrong"
    },
    "was canceled": {
      msg: false,
      alert: "This password reset request was canceled"
    },
    "was already used": {
      msg: false,
      alert: "This password reset request is already used"
    },
    "is expired": {
      msg: false,
      alert: "This password reset request is expired, create new one"
    }
  },
  password: {
    "should have more than 7 characters": {
      msg: "should be more than 7 characters",
      alert: "Invalid input",
    },
  },
  confirm_password: {
    "passwords should match": {
      msg: "Password does not match",
      alert: "Invalid input",
    }
  }
}


class SignIn extends Component {
  state = {
    email: '',
    reset_token: '',
    password: '',
    confirm_password: '',
    errorMsg: '',
    status: '',
    resetPasswordCanceled: false,
    alerts: [],
    errors: {},
    showPassword: true,
  }

  async componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const reset_token = queryParams.get('reset_token');
    const reset_id = queryParams.get('reset_id');
    try {
      const res = await Axios.post('/graphql', { query: FETCH_RESET_PASSWORD_INFO, variables: { id: reset_id } });
      if (res?.data?.data) {
        const { invitation_info } = res.data.data;
        this.setState({
          ...invitation_info,
          reset_token,
        });
      }
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
    }
  }

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errors: dissoc(this.state.errors, name) });
  }

  onChange = (value) => {
    console.log(`selected ${value}`);
  }

  onCancel = async (e) => {
    try {
      const { id } = this.state;
      const res = await Axios.post('/graphql', {
        query: CANCEL_RESET_PASSWORD, variables: { id },
      });
      if (res?.data?.data) {
        this.setState({ resetPasswordCanceled: true });
        this.props.history.push('/sign-in');
      }
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
    }
  }

  submitForm = async (e) => {
    e.preventDefault();
    const { t } = this.props
    this.setState({ alerts: [], errors: {} })
    const {
      password,
      confirm_password
      // reset_token
    } = this.state;
    const queryParams = new URLSearchParams(window.location.search);
    const reset_token = queryParams.get('reset_token');
    const reset_id = queryParams.get('reset_id');
    try {
      const res = await Axios.post('/graphql', {
        query: RESET_PASSWORD_MUTATION,
        variables: { reset_token, password, confirm_password },
      });
      if (res?.data.data.password_reset) {
        window.location.href = `/confirmation?reset_id=${reset_id}&show_success=1`;
      } else {
        this.setState({ errorMsg: t('The reset password token has already been used.') });
      }
    } catch (err) {
      const { status, data } = err.response;
      if (status === 422) {
        const { alerts, errors } = parseErrors(errorsConfig, data.errors[0].extensions.validation);
        this.setState({ alerts, errors });
      }
    }
  }

  render() {
    const { t } = this.props
    const {
      alerts, errors, password, confirm_password, showPassword,
    } = this.state;
    return (
      <RequestAccessPage>
        <Row style={{ flex: 1 }}>
          <Col xs={24} lg={16}>
            <div className="inner-container">
              <Flex jc="center" className="logo-wrapper">
                <Link to="/sign-in" id="sig-in-btn">
                  <IconLogin style={{ marginRight: 5 }} />
                  {' '}
                  {t("Log in")}
                </Link>
                <a href="/sign-in" id="logo">
                  <img src={iconlogo} alt={t("AdvancedDB logo")} />
                </a>
              </Flex>
              <Title margin="0 0 40px">{t("Create new password")}</Title>
              <form action="" autoComplete="off" onSubmit={this.submitForm}>
                <ErrorAlerts alerts={alerts} />
                <input type="email" name="" hidden />
                <input type="password" name="" hidden />
                <input type="password" name="" hidden />
                <input type="password" name="" hidden />
                <Row gutter={[7, 0]}>
                  <Col xs={24} sm={12}>
                    <InputWrapper className="has-input-icon has-messages" align='flex-end' style={{ margin: '10px' }}>
                      <Input
                        required
                        type="password"
                        name="password"
                        value={password}
                        ref={(el) => this.passwordRef = el}
                        autoComplete="new-password"
                        className={`dynamic-input ${password ? 'has-value' : ''}`}
                        onChange={this.handleInput}
                        hasErrors={errors.password}
                      />
                      <label htmlFor="" onClick={() => this.passwordRef.focus()}>{t("Password")}</label>
                      <span
                        className="password-toggler"
                        onClick={() => this.setState(prevState => ({ showPassword: !prevState.showPassword }))}
                        style={{ position: 'absolute', right: 10, top: 15 }}
                      >{showPassword ? <EyeTwoTone twoToneColor="#527bdd" /> : <EyeInvisibleOutlined />}</span>
                      <InputErrors name={'password'} errors={errors} />
                    </InputWrapper>
                  </Col>
                  <Col xs={24} sm={12}>
                    <InputWrapper className="has-input-icon has-messages" align='flex-end' style={{ margin: '10px' }}>
                      <Input
                        required
                        type="password"
                        name="confirm_password"
                        value={confirm_password}
                        ref={(el) => this.confirmPasswordRef = el}
                        autoComplete="new-password"
                        className={`dynamic-input ${confirm_password ? 'has-value' : ''}`}
                        onChange={this.handleInput}
                        hasErrors={errors.confirm_password}
                      />
                      <label htmlFor="" onClick={() => this.confirmPasswordRef.focus()}>{t("Confirm Password")}</label>
                      <span
                        className="password-toggler"
                        onClick={() => this.setState(prevState => ({ showPassword: !prevState.showPassword }))}
                        style={{ position: 'absolute', right: 10, top: 15 }}
                      >{showPassword ? <EyeTwoTone twoToneColor="#527bdd" /> : <EyeInvisibleOutlined />}</span>
                      <InputErrors name={'confirm_password'} errors={errors} />
                    </InputWrapper>
                  </Col>
                  <Col span={24}>
                    <div style={{ margin: 10 }}>
                      <ButtonPrimary>{t("Submit")}</ButtonPrimary>
                    </div>
                    <div>
                      <Button type="link" onClick={this.onCancel}>{t("Cancel password")}</Button>
                    </div>
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
          <Col style={styles.backgroundImage} xs={24} lg={8} flex={5}>
            <img src={cubic} style={styles.cubic} alt={t("Cubic")} id="cubic" />
            <img src={ellipse} style={styles.ellipse} alt={t("ellipse")} id="ellipse" />
            <img src={ellipse2} style={styles.ellipse2} alt={t("ellipse2")} id="ellipse2" />
            <img src={rectangle} style={styles.rectangle} alt={t("rectangle")} id="rectangle" />
            <img src={rectangle2} style={styles.rectangle2} alt={t("rectangle2")} id="rectangle2" />
            <div style={styles.textWrapper}>
              <Title style={styles.title}>{t("Advance DB")}</Title>
              <p style={styles.subTitle}>{t("The Reform Tracking tool")}</p>
            </div>
          </Col>
        </Row>

      </RequestAccessPage>
    );
  }
}

const styles = {
  backgroundImage: {
    background: colors.primary,
    backgroundSize: 'cover',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
  },
  textWrapper: {
    width: '100%',
    maxWidth: 420,
    padding: '80px 20px',
    color: '#fff',
    margin: 'auto',
    zIndex: 2,
  },
  title: {
    fontSize: 43,
    lineHeight: 1.1,
    color: '#fff',
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: '500',
    marginTop: 21,
    textAlign: 'center',
  },
  cubic: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  ellipse: {
    position: 'absolute',
    right: 0,
    bottom: '10%',
  },
  ellipse2: {
    position: 'absolute',
    left: 0,
    transform: 'translateX(-50%)',
  },
  rectangle: {
    position: 'absolute',
    top: -7,
    left: '10%',
  },
  rectangle2: {
    position: 'absolute',
    bottom: -40,
    left: 0,
  },

};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(null, mapDispatchToProps)(withLocale(SignIn));
