import React, { useState } from 'react';
import { StyledOverdue } from '../../../styles/startBusiness';
import moment from 'moment-timezone';
import { List, Collapse, Button } from 'antd';
import { TitleH3, ButtonSecondary } from '../../../styles';
import constants from '../../../constants';
import { useLocale, withLocale } from "../../../utils/locale";

const { Panel } = Collapse;

function OverdueActions(props) {
  const { actions = [] } = props;
  const [collapseActive, setCollapseActive] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);
  const [t] = useLocale();
  return (
    <StyledOverdue classNam="overdue">
      <TitleH3 className="sub-title">{t("Overdue tasks")}</TitleH3>
      <List
        itemLayout="horizontal"
        dataSource={actions.slice(0, showAllActions ? actions.length : constants.defaultListSize)}
        className={`progress-toggle ${showAllActions ? 'show' : 'hide'}`}
        renderItem={(item) => {
          return (
            <List.Item key={item.id} className={`overdue__item ${item.isParent ? 'action' : 'sub-action'}`}>
              <h5 className="overdue__item__date"><b>{moment().diff(item.end_at, 'days')}</b> days</h5>
              <h5 className="overdue__item__title">{item.name}</h5>
              <div className="overdue__item__deadline">{new Date(item.end_at).toLocaleDateString()}</div>
            </List.Item>
          );
        }}
      />

      <Collapse
        activeKey={[collapseActive ? 'statistics' : null]}
        bordered={false}
        className="custom-collapse"
      >
        <Panel key={'statistics'} showArrow={false}>
          <List
            itemLayout="horizontal"
            dataSource={actions.slice(4, actions.length)}
            className={`progress-toggle`}
            renderItem={(item) => {
              return (
                <List.Item key={item.id} className={`overdue__item ${item.isParent ? 'action' : 'sub-action'}`}>
                  <h5 className="overdue__item__date"><b>{moment().diff(item.end_at, 'days')}</b> days</h5>
                  <h5 className="overdue__item__title">{item.name}</h5>
                  <div className="overdue__item__deadline">{new Date(item.end_at).toLocaleDateString()}</div>
                </List.Item>
              );
            }}
          />
        </Panel>
      </Collapse>
      {
        actions.length > 4
        && (
          <div className="text-center pb-30" style={{ marginTop: 10, }}>
            <ButtonSecondary
              type="text"
              className="transparent small"
              style={{ width: 'auto', margin: 'auto', fontWeight: '400' }}
              onClick={() => setCollapseActive(state => !state)}
            >
              {collapseActive ? t('Show Less') : t('Show all')}
            </ButtonSecondary>
          </div>
        )
      }
    </StyledOverdue>
  )
}

export default withLocale(OverdueActions)
