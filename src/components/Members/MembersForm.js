import React, { Component } from 'react'
import { Modal, Select } from 'antd'; // Using Ant components for forms
import { WorkingGroup } from '../../styles/workingGroup';
import { InputWrapper, Flex } from '../../styles';
import { Button, PageHeader, PageHeaderTitle, PageHeaderActions } from '../UI/shadcn';
import { Plus } from 'lucide-react';
import { ReactComponent as IconCheck } from '../../assets/list-icon.svg';
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
        <PageHeader style={{ marginTop: '-20px' }}>
          <PageHeaderTitle>{t("All members")}</PageHeaderTitle>
          <PageHeaderActions>
            <Button size="sm" onClick={this.showModal}>
              <Plus size={16} />
              {t("New member")}
            </Button>
          </PageHeaderActions>
        </PageHeader>
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
              <Button variant="outline" type="reset" onClick={this.handleCancel} style={{ marginRight: 12 }}>{t("Cancel")}</Button>
              <Button type="submit">{t("Apply")}</Button>
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
