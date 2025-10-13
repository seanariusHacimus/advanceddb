import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Menu, Row, Col, Switch } from "antd";
import { Link } from "react-router-dom";
import { fetchWorkingGroupsAction } from "../../store/WorkingGroups/actions";
// ------- ASSETS & STYLING ---------
import { IndicatorsPage } from "../../styles/indicators";
import { Flex, Button, ButtonPrimary } from "../../styles";
import { ReactComponent as IconSettings } from "../../assets/header/settings.svg";
import { updateWorkingGroups } from "../../graphql/workingGroups";
import { withLocale } from "../../utils/locale";

class Indicators extends Component {
  state = {
    visible: false,
    title: "",
    indicators: [],
    selectedUsers: [],
  };

  componentDidMount() {
    this.props.fetchWorkingGroupsAction();
    this.setState({ indicators: this.props.indicators });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.indicators !== this.props.indicators) {
      window.scrollTo(0, 0);
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleSwitch = (value, event) => {
    const { dataset } = event.currentTarget;
    const { indicators } = this.state;

    const updatedIndicators = indicators.map((item) => {
      if (item.id == dataset.id) {
        item.visible = value;
      }
      return item;
    });
    this.setState({ indicators: updatedIndicators });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { indicators } = this.state;
    const updatedData = indicators.reduce((obj, item) => {
      const currentData = this.props.indicators.find(
        (prop) => prop.id === item.id
      );
      if (item.visible !== currentData.visible) {
        obj.push(item);
        return obj;
      }
      return obj;
    }, []);

    const bulkUpdate = updatedData.map((item) => {
      const { id, visible, title } = item;
      return updateWorkingGroups({ id, group: { visible, title } });
    });

    Promise.all(bulkUpdate)
      .then((data) => {
        this.props.fetchWorkingGroupsAction();
        this.props.modalHandler();
        this.props.fetchDashboardReport();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { indicators } = this.state;
    const { t } = this.props;
    return (
      <IndicatorsPage ref={(el) => (this.parentRef = el)}>
        <Menu
          theme="light"
          className="side-bar-menu"
          mode="inline"
          defaultSelectedKeys={[""]}
        >
          <Menu.Item
            key="indicator"
            icon={<IconSettings className="menu-icon" />}
          >
            <Link to="/#indicators" onClick={this.showModal}>
              {t("Indicator settings")}
            </Link>
          </Menu.Item>
        </Menu>
        <Modal
          title={null}
          visible={this.props.modalVisible}
          onCancel={this.props.modalHandler}
          footer={null}
          zIndex={1080}
          width="80%"
          style={{ maxWidth: 800 }}
        >
          <h2 className="title">{t("Customize Dashboard Reports")}</h2>
          <h4 className="sub-title">
            {t("Select the working groups to include in your report")}
          </h4>
          <Row gutter={[20, 20]}>
            {indicators.map((item) => (
              <Col span={24} md={12} key={item.id}>
                <Flex
                  jc="space-between"
                  className={`switch ${item.visible && "checked"}`}
                >
                  <div className="switch-item-title">{t(item.title)}</div>
                  <Switch
                    size="small"
                    data-id={item.id}
                    onChange={this.handleSwitch}
                    checked={item.visible}
                  />
                </Flex>
              </Col>
            ))}
            <Col span={24}>
              <Flex>
                <Button
                  type="reset"
                  onClick={this.props.modalHandler}
                  style={{ height: 51, marginRight: 12 }}
                >
                  {t("Cancel")}
                </Button>
                <ButtonPrimary onClick={this.handleSubmit}>
                  {t("Apply")}
                </ButtonPrimary>
              </Flex>
            </Col>
          </Row>
        </Modal>
      </IndicatorsPage>
    );
  }
}

const mapStateToProps = (state) => ({ indicators: state.workingGroups.data });
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchWorkingGroupsAction }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocale(Indicators));
