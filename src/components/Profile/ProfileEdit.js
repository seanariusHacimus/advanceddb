import { Component } from "react";
import { Row, Col, AutoComplete, Divider } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import Axios from "../../utils/axios";
import {
  MY_ACCOUNT_EDIT_QUERY,
  UPDATE_MY_ACCOUNT_MUTATION,
} from "../../graphql/profile";
import { authUpdate } from "../../store/Auth/actions";

// -------- ASSETS & STYLES ------------
import {
  TitleH1,
  TitleH3,
  Flex,
} from "../../styles";
import { ProfileEditPage } from "../../styles/profile";
import iconSave from "../../assets/profile/save.svg";
import iconUser from "../../assets/startBusiness/user.svg";
import iconCamera from "../../assets/profile/camera.svg";
import { pick } from "../../utils";
import { withLocale } from "../../utils/locale";
import { useToast } from "../UI/shadcn/toast";
import { Input, Label, FormGroup, Button } from "../UI/shadcn";

// Wrapper to use hooks with class component
const withToast = (Component) => {
  return (props) => {
    const toast = useToast();
    return <Component {...props} toast={toast} />;
  };
};

class UserProfile extends Component {
  state = {
    email: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    prefix: "",
    phone: "",
    company: "",
    job_position: "",
    role: "",
    organizations: [],
    organization: "",
  };

  async componentDidMount() {
    try {
      const res = await Axios.post("/graphql", {
        query: MY_ACCOUNT_EDIT_QUERY,
      });
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
  };

  selectHandler = (val) => {
    const selectedOrganization = val.length > 1 ? val[1] : val[0];
    this.setState({ organization: selectedOrganization });
  };

  handleImage = (e) => {
    this.setState({
      photo: { url: URL.createObjectURL(this.fileRef.files[0]) },
    });
  };

  handleSubmit = async (e) => {
    const { t } = this.props;
    const account = this.state;
    let filteredAccount = pick(account, [
      "email",
      "phone",
      "first_name",
      "middle_name",
      "last_name",
      "prefix",
      "job_position",
      "organization",
      "comment",
      "notification_settings",
      "storage",
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
        0: ["variables.account.photo"],
      };
      formData.append("operations", JSON.stringify(request));
      formData.append("map", JSON.stringify(map));
      formData.append("0", file);
    } else {
      formData = {
        query: UPDATE_MY_ACCOUNT_MUTATION,
        variables: {
          account: filteredAccount,
        },
      };
    }

    try {
      const res = await Axios.post("/graphql", formData);
      if (res?.data.data) {
        this.props.authUpdate({ account: res.data.data.update_my_account });
        this.props.toast.success(t("Your profile has been updated successfully"));
        this.props.history.push("/settings/profile");
      }
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
    }
  };

  render() {
    const { t } = this.props;
    const {
      first_name,
      last_name,
      organizations,
      photo,
      middle_name,
      prefix,
      organization,
      job_position,
      email,
      phone,
    } = this.state;
    return (
      <ProfileEditPage id="profile-page">
        <Flex>
          <TitleH1>{t("Profile")}</TitleH1>
          <div className="btn-group" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/settings/profile">
              <Button variant="outline" size="sm">
                {t("Cancel")}
              </Button>
            </Link>
            <Button size="sm" onClick={this.handleSubmit}>
              <img src={iconSave} alt={t("Profile")} style={{ marginRight: '8px', width: '16px', height: '16px' }} /> 
              {t("Save")}
            </Button>
          </div>
        </Flex>
        <div className="profile-img">
          <img
            src={photo ? photo.url : iconUser}
            ref={(el) => (this.avatarRef = el)}
            alt={t("user avatar")}
            className="user-avatar"
          />
          <img
            src={iconCamera}
            alt={t("camera icon")}
            id="camera-icon"
            onClick={() => this.fileRef.click()}
          />

          <input
            type="file"
            ref={(el) => (this.fileRef = el)}
            onChange={this.handleImage}
            name="img"
          />
        </div>
        <span style={{ fontSize: 9, marginLeft: 6 }}>100x100px</span>

        <Row gutter={[10, 0]}>
          <Col span={24} md={12}>
            <FormGroup>
              <Label htmlFor="first_name">{t("First name")} *</Label>
              <Input
                required
                type="text"
                name="first_name"
                id="first_name"
                value={first_name}
                autoComplete="given-name"
                onChange={this.handleInput}
              />
            </FormGroup>
          </Col>

          <Col span={24} md={12}>
            <FormGroup>
              <Label htmlFor="last_name">{t("Last name")} *</Label>
              <Input
                required
                type="text"
                name="last_name"
                id="last_name"
                value={last_name}
                autoComplete="family-name"
                onChange={this.handleInput}
              />
            </FormGroup>
          </Col>
          <Col span={24} md={12}>
            <FormGroup>
              <Label htmlFor="middle_name">{t("Middle name")}</Label>
              <Input
                type="text"
                name="middle_name"
                id="middle_name"
                value={middle_name}
                autoComplete="additional-name"
                onChange={this.handleInput}
              />
            </FormGroup>
          </Col>
          <Col span={24} md={12}>
            <FormGroup>
              <Label htmlFor="prefix">{t("Suffix")}</Label>
              <Input
                type="text"
                name="prefix"
                id="prefix"
                value={prefix || ""}
                autoComplete="honorific-suffix"
                onChange={this.handleInput}
              />
            </FormGroup>
          </Col>
          <Col span={24}>
            <Divider style={{ borderColor: "var(--border-grey)" }} />
            <TitleH3 className="section-title">{t("Occupation data")}</TitleH3>
          </Col>
          <Col span={24} md={12}>
            <FormGroup>
              <Label htmlFor="organization">{t("Organization name")}</Label>
              <AutoComplete
                options={organizations.map((item) => ({
                  value: item.title,
                }))}
                className="custom-select"
                style={{ width: "100%" }}
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                onSelect={(value) => {
                  this.setState({ organization: value });
                }}
              >
                <Input
                  type="text"
                  name="organization"
                  id="organization"
                  value={organization || ""}
                  autoComplete="organization"
                  onChange={this.handleInput}
                />
              </AutoComplete>
            </FormGroup>
          </Col>
          <Col span={24} md={12}>
            <FormGroup>
              <Label htmlFor="job_position">{t("Position")}</Label>
              <Input
                type="text"
                name="job_position"
                id="job_position"
                value={job_position || ""}
                autoComplete="organization-title"
                onChange={this.handleInput}
              />
            </FormGroup>
          </Col>
          <Col span={24}>
            <Divider style={{ borderColor: "var(--border-grey)" }} />
            <TitleH3 className="section-title">{t("Contact data")}</TitleH3>
          </Col>
          <Col span={24} md={12}>
            <FormGroup>
              <Label htmlFor="phone">{t("Phone")} *</Label>
              <Input
                required
                type="tel"
                name="phone"
                id="phone"
                value={phone || ""}
                autoComplete="tel"
                onChange={this.handleInput}
              />
            </FormGroup>
          </Col>
          <Col span={24} md={12}>
            <FormGroup>
              <Label htmlFor="email">{t("Email")} *</Label>
              <Input
                required
                type="email"
                name="email"
                id="email"
                value={email}
                autoComplete="email"
                onChange={this.handleInput}
              />
            </FormGroup>
          </Col>
        </Row>
      </ProfileEditPage>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.auth });
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ authUpdate }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withLocale(withToast(UserProfile))));
