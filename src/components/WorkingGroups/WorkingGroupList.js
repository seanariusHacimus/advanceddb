import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import getQuery from './queryGenerator';
import Axios from '../../utils/axios';
import { Flex, ButtonPrimary, ButtonSecondary, TitleH3 } from '../../styles';
import { fetchWorkingGroupsAction } from '../../store/WorkingGroups/actions';
import {withLocale} from "../../utils/locale";

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class SortableTable extends Component {
  state = {
    dataSource: [],
    onDragEndActive: false,
    isDragCanceled: true,
  };

  componentDidMount() {
    this.setState({ dataSource: this.props.data });
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ dataSource: this.props.data });
    }
  }

  cancelDraggedRow = () => {
    this.setState(prevState => ({ onDragEndActive: false, isDragCanceled: true, dataSource: prevState.oldData }));
  }

  saveDraggedRow = async () => {
    this.setState({ onDragEndActive: false });
    const query = `mutation update_indicator_group($group: UpdateIndicatorGroupInput!, $id:Uuid!) {${getQuery(this.state.comapredData)}}`;

    try {
      const res = await Axios.post('/graphql', {
        query,
      });
      if (res?.data) {
        await this.props.fetchWorkingGroupsAction();
      }
    }
    catch (err) {
      console.error('[Custom Catch Error]-->', err);
      this.setState({ loading: false });
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      const comapredData = []
      newData.forEach((newItem, index) => {
        if (newItem.id !== this.state.dataSource[index].id) {
          const result = { ...newItem, index, };
          comapredData.push(result);
        }
      });
      this.setState({ dataSource: newData, oldData: dataSource, comapredData, onDragEndActive: true });
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { dataSource, onDragEndActive } = this.state;
    const {t} = this.props;
    const DraggableContainer = props => {
      return (
        <SortableContainer
          useDragHandle
          helperClass="row-dragging"
          hideSortableGhost={false}
          onSortEnd={this.onSortEnd}
          helperContainer={() => document.getElementsByClassName(props.className)[0]}
          {...props}
        />
      )
    };

    return (
      <>
        <Table
          pagination={false}
          dataSource={dataSource}
          scroll={{ x: true }}
          className="custom-dragable-table"
          columns={[{
            title: t('Sort'),
            dataIndex: 'sort',
            width: 20,
            className: 'drag-visible sort-icon',
            render: () => <DragHandle />,
          }, ...this.props.columns]}
          rowKey="index"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: this.DraggableBodyRow,
            },
          }}
        />
        {
          onDragEndActive && (
            <Flex id="dragable-move">
              <TitleH3 color="#fff">{t("Are you sure you want to save the result?")}</TitleH3>
              <ButtonSecondary className="medium cancel" onClick={this.cancelDraggedRow}>{t("Cancel")}</ButtonSecondary>
              <ButtonPrimary className="medium" onClick={this.saveDraggedRow}>{t("Save")}</ButtonPrimary>
            </Flex>
          )
        }
      </>
    );
  }
}

const mapStateToProps = state => ({ indicators: state.workingGroups.data });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchWorkingGroupsAction }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withLocale(SortableTable));
