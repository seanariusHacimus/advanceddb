import React, { Component } from 'react'
import { Modal, Select } from 'antd';
import { WorkingGroup } from '../../styles/workingGroup';
import { TitleH3, InputWrapper, Flex, Button, ButtonPrimary, } from '../../styles';
import { ReactComponent as IconCheck } from '../../assets/list-icon.svg';
import iconAddSubaction from '../../assets/startBusiness/add-primary.svg';
import { FETCH_WORKING_GROUPS, ADD_MEMBERS_MUTATION } from '../../graphql/workingGroups';
import Axios from '../../utils/axios';
import {withLocale} from "../../utils/locale";

class AddMember extends Component {
  state = {
    visible: false,
    title: '',
    selectedUsers: [],
  };

  async componentDidMount() {
    try {
      const res = await Axios.post('/graphql', { query: FETCH_WORKING_GROUPS });
      if (res?.data) {
        console.log(res.data);
      }
    }
    catch (err) {
      console.log(err.response);
    }

  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  selectHandler = (value) => {
    this.setState({ selectedUsers: value });
  }

  addMembers = async () => {
    const { members, id } = this.state;
    try {
      const res = Axios.post('/graphql', {
        query: ADD_MEMBERS_MUTATION,
        variables: {
          group_id: id,
          members,
        }
      });
      if (res?.data) {
        console.log(res.data);
      }
    }
    catch (err) {
      console.log(err.response);
    }
  }

  render() {
    const { selectedUsers } = this.state;
    const {members = []} = this.props;
    const {t} = this.props
    return (
      <WorkingGroup>
        <Flex margin="-20px 0 20px" className="action-btn-group">
          <TitleH3>{t("All members")}</TitleH3>
          <ButtonPrimary padding="0 5px" className="small add-new-action" onClick={this.showModal}>
            <img src={iconAddSubaction} alt={t("add subaction")} />
            {t("New member")}
          </ButtonPrimary>
        </Flex>
        <Modal
          title={null}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          zIndex={1080}
        >
          <h2 style={styles.title}>{t("Add member")}</h2>
          <form action="">
            <InputWrapper>
              <Select
                mode="multiple"
                size='large'
                placeholder={t("Working Group Members")}
                defaultValue={selectedUsers}
                onChange={this.selectHandler}
                style={{ width: '100%' }}
                optionFilterProp={'children'}
                allowClear={true}
                getPopupContainer={node => node.parentNode}
                menuItemSelectedIcon={<IconCheck className="check-icon" />}
                dropdownStyle={{ backgroundColor: '#535263', padding: 10, }}
              >
                {
                  members.map(item => <Select.Option key={item.id} className="select-item" value={item.id}>{item.first_name}</Select.Option>)
                }
              </Select>
            </InputWrapper>
            <Flex>
              <Button type="reset" onClick={this.handleCancel} style={{ height: 51, marginRight: 12 }}>{t("Cancel")}</Button>
              <ButtonPrimary>{t("Apply")}</ButtonPrimary>
            </Flex>
          </form>
        </Modal>
      </WorkingGroup>
    );
  }
}

const styles = {
  title: {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: '30px',
    color: '#252A32',
  }
}
export default withLocale(AddMember);
