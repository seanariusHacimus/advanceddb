import React, { Component, lazy, Suspense, createRef } from 'react';
import { connect } from 'react-redux';
import {
  Table, Menu, Dropdown, Divider, Popconfirm, message,
} from 'antd';
import {MoreOutlined} from '@ant-design/icons';
import Axios from '../../utils/axios';
import {FETCH_REFORMS, DELETE_REFORM} from '../../graphql/reforms';
import {
  TitleH1, Flex, ButtonPrimary, TitleH3,
} from '../../styles';
import Printer from '../../components/UI/Printer';

import ReformPage from '../../styles/reform';
import iconAdd from '../../assets/reform/add.svg';
import {ReactComponent as IconDelete} from '../../assets/reform/delete.svg';
import {ReactComponent as IconEdit} from '../../assets/reform/edit.svg';
import {ReactComponent as IconChevronDown} from '../../assets/startBusiness/chevron-down.svg';
import {ReactComponent as IconChevronUp} from '../../assets/startBusiness/chevron-up.svg';

import columns from './table';
import {ErrorAlerts, parseErrors} from "../../utils";
import {withLocale} from "../../utils/locale";

const NewReform = lazy(() => import('./ReformNew'));
const EditReform = lazy(() => import('./ReformEdit'));

export const errorsConfig = {
  reform_id: {
    "should be existing": {
      alert: "Reform update was already deleted",
      msg: false
    },
    "should be deleted by coordinator or superuser": {
      alert: "Insufficient permissions",
      msg: false
    }
  }
}


class Reform extends Component {
  state = {
    editModalVisible: false,
    newModalVisible: false,
    reforms: [],
    currentPage: 1,
    selectedReform: {},
    alerts: []
  }

  parentRef = createRef()

  async componentDidMount() {
    this.fetchReforms();
  }

  fetchReforms = async () => {
    this.setState({ loading: true });
    try {
      const res = await Axios.post('/graphql', {
        query: FETCH_REFORMS,
        variables:{
          order: {
            key: 'id',
            direction: 'desc',
          }
        }
      });
      if (res?.data) {
        const { nodes } = res.data.data.reforms;
        this.setState({ reforms: nodes, loading: false });
      }
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
      this.setState({ loading: false });
    }
  }

  showMessage = (type = 'error', content = 'salom') => {
    message[type]({
      content,
      duration: 10,
      style: {
        right: 30,
        bottom: 30,
        position: 'fixed',
        fontSize: 16,
      },
    });
  }

  showModal = (name) => {
    this.setState({ [name]: true });
  };

  hideModal = (name) => {
    this.setState({ [name]: false });
  };

  removeReform = async (id) => {
    const {t} = this.props
    this.setState({ loading: true });
    try {
      const res = await Axios.post('/graphql', {
        query: DELETE_REFORM,
        variables: {
          reform_id: id,
        },
      });
      if (res?.data) {
        this.showMessage('success', t('The action has been removed successfully'));
      }
    } catch (err) {
      if (err.message.includes('422')) {
        const {alerts, errors} = parseErrors(errorsConfig, err.response.data.errors[0].extensions?.validation);
        this.setState({alerts, errors})
      }
    } finally {
      this.setState({ loading: false });
      this.fetchReforms();
    }
  }

  beforePrint = () => {
    this.setState({ printActive: true });
  }

  afterPrint = () => {
    this.setState({ printActive: false });
  }

  render() {
    const {t} = this.props
    const {
      editModalVisible, newModalVisible, reforms, loading, currentPage, printActive, alerts
    } = this.state;
    const { user: { role } } = this.props;

    const moreActionsBtn = {
      title: '',
      dataIndex: '',
      key: 'actions',
      render: (item) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown.Button
            className="more-action-btn"
            trigger={['click']}
            getPopupContainer={(trigger) => trigger.parentNode}
            overlay={(
              <>
                <Menu
                  className="more-action-btn-table"
                >
                  <Menu.Item
                    key="1"
                    onClick={() => {
                      this.setState({ selectedReform: item });
                      this.showModal('editModalVisible');
                    }}
                    icon={<IconEdit style={{ marginRight: 5 }} />}
                  >
                    {t("Edit")}
                  </Menu.Item>
                  {
                    ['superuser', 'coordinator'].includes(role)
                    && (
                      <Menu.Item
                        key="2"
                      >
                        <Popconfirm
                          title={t("Are you sure you want to delete this reform?")}
                          onConfirm={() => this.removeReform(item.id)}
                          okText={t("Yes")}
                          cancelText={t("Cancel")}
                        >
                          <IconDelete style={{ marginRight: 5 }} />
                          {' '}
                          {t("Delete")}
                        </Popconfirm>
                      </Menu.Item>
                    )
                  }

                </Menu>
              </>
            )}
            icon={<MoreOutlined />}
          />
        </div>
      ),
    };

    return (
      <ReformPage ref={this.parentRef}>
        <TitleH1>{t("Reform update for DB team")}</TitleH1>
        <Flex margin="41px 0 24px" jc="flex-end">
          <TitleH3>{t("All reforms update")}</TitleH3>
          <Printer
            ref={this.parentRef.current}
            afterPrint={this.afterPrint}
            beforePrint={this.beforePrint}
          />
          <ButtonPrimary onClick={() => this.showModal('newModalVisible')} className="add-reform-btn small">
            <img src={iconAdd} alt="added btn" />
            {' '}
            {t("Add reform update")}
          </ButtonPrimary>
        </Flex>
        <ErrorAlerts alerts={alerts}/>
        <Table
          dataSource={reforms}
          expandedRowKeys={printActive && reforms.map(i => i.id)}
          columns={[...columns({ currentPage, t }), moreActionsBtn]}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            hideOnSinglePage: true,
            currentPage,
            onChange: (page) => this.setState({ currentPage: page }),
            position: ['bottomCenter'],
            showLessItems: true,
            size: 'small',
          }}
          rowKey={(item) => item.id}
          className="custom-table"
          onRow={(record) => ({
            onClick: (event) => {
              const row = event.currentTarget;
              row.classList.toggle('bg-white');
            },
          })}
          geo_impact
          description
          suggested_date
          suggested_data_modification
          date_of_entry
          legal_basis
          expandable={{
            expandRowByClick: true,
            indentSize: 0,
            expandIcon: ({expanded, onExpand, record}) => (expanded ?
              <IconChevronUp onClick={(e) => onExpand(record, e)}/> :
              <IconChevronDown onClick={(e) => onExpand(record, e)}/>),
            expandedRowRender: (item) => (
              <table>
                <tbody>
                {item.geo_impact &&
                (<>
                  <tr>
                    <th>{t("Geographic Impact")}:</th>
                    <td className="custom-table-td">{item.geo_impact}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}><Divider/></td>
                  </tr>
                </>)}
                {item.description &&
                (<>
                  <tr>
                    <th>{t("Description of the data update")}:</th>
                    <td dangerouslySetInnerHTML={{__html: item.description}} className="custom-table-td"/>
                  </tr>
                  <tr>
                    <td colSpan={2}><Divider/></td>
                  </tr>
                </>)}
                {item.sub_index_impacted &&
                (<>
                  <tr>
                    <th>{t("Sub-index or question impacted")}:</th>
                    <td className="custom-table-td">{item.sub_index_impacted}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}><Divider/></td>
                  </tr>
                </>)}
                {item.suggested_data_modification && (
                  <>
                    <tr>
                      <th>{t("Suggested data modification")}:</th>
                      <td className="custom-table-td">{item.suggested_data_modification}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}><Divider/></td>
                    </tr>
                  </>
                )}

                {item.date_of_entry && (
                  <>
                    <tr>
                      <th>{t("Date of entry into force (if applicable):")}</th>
                      <td className="custom-table-td">{new Date(item.date_of_entry).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}><Divider/></td>
                    </tr>
                  </>
                )}
                {item.legal_basis && (
                  <tr>
                    <th>{t("Legal basis (if applicable)")}:</th>
                    <td className="custom-table-td">{item.legal_basis}</td>
                  </tr>
                )}
                </tbody>
              </table>
            ),
          }}
        />
        {
          newModalVisible &&
          (
            <Suspense fallback={<div>{t("loading....")}</div>}>
              <NewReform
                modalVisible={newModalVisible}
                fetchReforms={this.fetchReforms}
                showMessage={this.showMessage}
                hideModal={() => this.hideModal('newModalVisible')}
              />
            </Suspense>
          )}
        {
          editModalVisible && (
            <Suspense fallback={<div>{t("loading....")}</div>}>
              <EditReform
                modalVisible={editModalVisible}
                fetchReforms={this.fetchReforms}
                showMessage={this.showMessage}
                selectedReform={this.state.selectedReform}
                hideModal={() => this.hideModal('editModalVisible')}
              />
            </Suspense>
          )
        }

      </ReformPage>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.account,
});


export default connect(mapStateToProps)(withLocale(Reform));
