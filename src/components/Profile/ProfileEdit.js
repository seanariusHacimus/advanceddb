import React, { Component } from 'react';
import {
  Row, Col, AutoComplete, Divider,
} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from '../../utils/axios';
import { MY_ACCOUNT_EDIT_QUERY, UPDATE_MY_ACCOUNT_MUTATION } from '../../graphql/profile';
import { authUpdate } from '../../store/Auth/actions';

// -------- ASSETS & STYLES ------------
import {
  TitleH1, TitleH3, Flex, ButtonPrimary, Input, InputWrapper,
} from '../../styles';
import { ProfileEditPage } from '../../styles/profile';
import iconSave from '../../assets/profile/save.svg';
import iconUser from '../../assets/startBusiness/user.svg';
import iconCamera from '../../assets/profile/camera.svg';
import { pick } from "../../utils";
import {withLocale} from "../../utils/locale";

class UserProfile extends Component {
  state = {
    email: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    prefix: '',
    phone: '',
    company: '',
    job_position: '',
    role: '',
    organizations: [],
    organization: '',
  }

  async componentDidMount() {
    try {
      const res = await Axios.post('/graphql', { query: MY_ACCOUNT_EDIT_QUERY });
      console.log(res.data);
      if (res?.data) {
        const account = res?.data.data.my_account;
        this.setState({
          ...account,
          organization: account.organization?.title,
          organizations: res?.data.data.organizations.nodes,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  selectHandler = (val) => {
    const selectedOrganization = val.length > 1 ? val[1] : val[0];
    this.setState({ organization: selectedOrganization });
  }

  handleImage = (e) => {
    this.setState({ photo: { url: URL.createObjectURL(this.fileRef.files[0]) } });
  }

  handleSubmit = async (e) => {
    const {t} = this.props
    const account = this.state;
    let filteredAccount =
      pick(account, [
        'email',
        'phone',
        'first_name',
        'middle_name',
        'last_name',
        'prefix',
        'job_position',
        'organization',
        'comment',
        'notification_settings',
        'storage',
      ]);
    filteredAccount = Object.keys(filteredAccount).reduce((acc, name) => {
      const val = filteredAccount[name];
      return {
        ...acc,
        [name]: val || null,
      };
    }, {});

    const file = this.fileRef.files[0];
    let formData = new FormData();
    if (file) {
      // If file exist use this section
      const request = {
        query: UPDATE_MY_ACCOUNT_MUTATION,
        variables: {
          account: { ...filteredAccount, photo: null },
        },
      };
      const map = {
        0: ['variables.account.photo'],
      };
      formData.append('operations', JSON.stringify(request));
      formData.append('map', JSON.stringify(map));
      formData.append('0', file);
    } else {
      formData = {
        query: UPDATE_MY_ACCOUNT_MUTATION,
        variables: {
          account: filteredAccount,
        },
      };
    }

    try {
      const res = await Axios.post('/graphql', formData);
      if (res?.data.data) {
        this.props.authUpdate({ account: res.data.data.update_my_account });
        Swal.fire({
          title: t('Updated'),
          text: t('Your profile has been updated successfully'),
          icon: 'success',
        }).then((result) => {
          this.props.history.push('/profile');
        });
      }
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
    }
  }

  render() {
    const {t} = this.props
    const {
      first_name, last_name, organizations, photo, middle_name, prefix, organization, job_position, email, phone,
    } = this.state;
    return (
      <ProfileEditPage id="profile-page">
        <Flex>
          <TitleH1>{t("Profile")}</TitleH1>
          <div className="btn-group">
            <Link to="/profile" className="edit-btn transparent small">{t("Cancel")}</Link>
            <ButtonPrimary className="small" onClick={this.handleSubmit}>
              <img src={iconSave} alt={t("Profile")} />
              {' '}
              {t("Save")}
            </ButtonPrimary>
          </div>
        </Flex>
        <div className="profile-img">
          <img
            src={photo ? photo.url : iconUser}
            ref={(el) => this.avatarRef = el}
            alt={t("user avatar")}
            className="user-avatar"
          />
          <img
            src={iconCamera}
            alt={t("camera icon")}
            id="camera-icon"
            onClick={() => this.fileRef.click()}
          />

          <input type="file" ref={(el) => this.fileRef = el} onChange={this.handleImage} name="img" />
        </div>
        <span style={{ fontSize: 9, marginLeft: 6 }}>100x100px</span>

        <Row gutter={[10, 0]}>
          <Col span={24} md={12}>
            <InputWrapper>
              <Input
                required
                type="text"
                name="first_name"
                value={first_name}
                ref={(el) => this.first_nameRef = el}
                autoComplete="new-name"
                id="new-name"
                className={`dynamic-input ${first_name ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.first_nameRef.focus()}>{t("First name")}</label>
            </InputWrapper>
          </Col>

          <Col span={24} md={12}>
            <InputWrapper>
              <Input
                required
                type="text"
                name="last_name"
                value={last_name}
                ref={(el) => this.last_nameRef = el}
                autoComplete="new-name"
                id="new-last-name"
                className={`dynamic-input ${last_name ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.last_nameRef.focus()}>{t("Last name")}</label>
            </InputWrapper>
          </Col>
          <Col span={24} md={12}>
            <InputWrapper>
              <Input
                // required
                type="text"
                name="middle_name"
                value={middle_name}
                ref={(el) => this.middle_nameRef = el}
                autoComplete="new-name"
                id="new-middle-name"
                className={`dynamic-input ${middle_name ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.middle_nameRef.focus()}>{t("Middle name")}</label>
            </InputWrapper>
          </Col>
          <Col span={24} md={12}>
            <InputWrapper>
              <Input
                // required
                type="text"
                name="prefix"
                value={prefix || ''}
                ref={(el) => this.prefixRef = el}
                autoComplete="new-name"
                id="new-prefix"
                className={`dynamic-input ${prefix ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.prefixRef.focus()}>{t("Suffix")}</label>
            </InputWrapper>
          </Col>
          <Col span={24}>
            <Divider style={{ borderColor: 'var(--border-grey)' }} />
            <TitleH3 className="section-title">{t("Occupation data")}</TitleH3>
          </Col>
          <Col span={24} md={12}>
            <InputWrapper>
              <AutoComplete
                options={organizations.map((item) => ({
                  value: item.title,
                }))}
                className="custom-select"
                style={{ width: '100%', maxWidth: 420 }}
                filterOption={(inputValue, option) => option.value
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1}
                onSelect={(value) => {
                  this.setState({ organization: value });
                }}
              >
                <InputWrapper margin="0">
                  <Input
                    type="text"
                    name="organization"
                    value={organization || ''}
                    onChange={this.handleInput}
                    ref={(ref) => this.organizationRef = ref}
                    className={`dynamic-input ${organization ? 'has-value' : ''}`}
                  />
                  <label
                    htmlFor=""
                    onClick={() => this.organizationRef.focus()}
                  >
                    {t("Organization name")}
                  </label>
                </InputWrapper>
              </AutoComplete>
            </InputWrapper>
          </Col>
          <Col span={24} md={12}>
            <InputWrapper>
              <Input
                // required
                type="text"
                name="job_position"
                value={job_position || ''}
                ref={(el) => this.job_positionRef = el}
                autoComplete="new-name"
                id="new-job-position"
                className={`dynamic-input ${job_position ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.job_positionRef.focus()}>{t("Position")}</label>
            </InputWrapper>
          </Col>
          <Col span={24}>
            <Divider style={{ borderColor: 'var(--border-grey)' }} />
            <TitleH3 className="section-title">{t("Contact data")}</TitleH3>

          </Col>
          <Col span={24} md={12}>
            <InputWrapper>
              <Input
                required
                type="phone"
                name="phone"
                value={phone || ''}
                ref={(el) => this.phoneRef = el}
                autoComplete="new-name"
                id="phone"
                className={`dynamic-input ${phone ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.phoneRef.focus()}>{t("Phone")}</label>
            </InputWrapper>
          </Col>
          <Col span={24} md={12}>
            <InputWrapper>
              <Input
                required
                type="email"
                name="email"
                value={email}
                id="email"
                ref={(el) => this.emailRef = el}
                autoComplete="new-email"
                className={`dynamic-input ${email ? 'has-value' : ''}`}
                onChange={this.handleInput}
              />
              <label htmlFor="" onClick={() => this.emailRef.focus()}>{t("Email")}</label>
            </InputWrapper>
          </Col>
        </Row>

      </ProfileEditPage>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.auth });
const mapDispatchToProps = (dispatch) => bindActionCreators({ authUpdate }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocale(UserProfile)));
