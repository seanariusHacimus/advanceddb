import React, { Component } from 'react';
import { Divider } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MY_ACCOUNT_QUERY } from '../../graphql/profile';

// -------- ASSETS & STYLES ------------
import {
  TitleH1, Text, TitleH3, Flex,
} from '../../styles';
import { ProfilePage } from '../../styles/profile';
import iconEdit from '../../assets/profile/edit.svg';
import iconUser from '../../assets/startBusiness/user.svg';
import iconOffice from '../../assets/profile/house.svg';
import iconEmail from '../../assets/profile/email.svg';
import iconPhone from '../../assets/profile/phone.svg';
import Axios from '../../utils/axios';
import { groupTitleToUrl } from "../../utils";
import {withLocale} from "../../utils/locale";

class UserProfile extends Component {
  state = {
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: '',
    organization: { title: '' },
    job_position: '',
    photo: '',
    groups: [],
  }

  async componentDidMount() {
    try {
      const res = await Axios.post('/graphql', { query: MY_ACCOUNT_QUERY });
      if (res?.data) this.setState({ ...res.data.data.my_account });
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
    }
  }

  handleInputs = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const {
      first_name, last_name, email, role, organization, photo, phone, job_position, groups
    } = this.state;
    const {t} = this.props
    return (
      <ProfilePage id="profile-page">
        <Flex>
          <TitleH1>{t("Profile")}</TitleH1>
          <div className="btn-group">
            <Link to="/profile/edit" className="transparent small edit-btn">
              <img src={iconEdit} alt="Profile" />
              {' '}
              {t("Edit")}
            </Link>
          </div>
        </Flex>
        <div className="profile-img">
          <div className="user-avatar" style={{ background: `url(${photo ? photo.url : iconUser}) no-repeat center` }}>

          </div>
          {/* <img src={photo ? photo.url : iconUser} alt="user avatar" className="user-avatar" /> */}
          <div className="user-name">
            <TitleH3 className="title">{`${first_name} ${last_name}`}</TitleH3>
            <Text className="sub-title">{t(role)}</Text>
          </div>
        </div>
        {(organization?.title || job_position) ?
          (<>
            <Divider style={{ borderColor: 'var(--border-grey)' }} />
            <TitleH3 className="section-title">{t("Personal data")}</TitleH3>
            <div>
              {organization?.title && (<p className="info-wrapper">
                <img src={iconOffice} alt={t("work office")} />
                <span className="label">{t("Organization")}:</span>
                {organization?.title}
              </p>)}
              {job_position && (<p className="info-wrapper">
                <img src={iconOffice} alt={t("work office")} />
                <span className="label">{t("Position")}:</span>
                {job_position}
              </p>)}
            </div>
          </>
          ) : null}
        <Divider style={{ borderColor: 'var(--border-grey)' }} />
        <TitleH3 className="section-title">{t("Contact data")}</TitleH3>
        <div>
          <p className="info-wrapper">
            <img src={iconEmail} alt={t("work office")} />
            <span className="label">{t("Email")}:</span>
            {email}
          </p>
          <p className="info-wrapper">
            <img src={iconPhone} alt={t("work office")} />
            <span className="label">{t("Phone")}:</span>
            {phone}
          </p>
        </div>
        {groups.length > 0 && (
          <>
            <Divider style={{ borderColor: 'var(--border-grey)' }} />
            <TitleH3 className="section-title">{t("My Working groups")}</TitleH3>
            <div>
              {groups.map((group, index) => (
                <p className="info-wrapper" key={group.id}>
                  <Link to={`/working-group/${groupTitleToUrl(group.title)}`}>{group.title}</Link>
                </p>
              ))}
            </div>
          </>
        )}
      </ProfilePage>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

export default connect(mapStateToProps)(withLocale(UserProfile));
