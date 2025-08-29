import React from 'react';
import {
  Table, Skeleton, Row, Col,
} from 'antd';
import { MeetingMinutesEmpty } from '../../../styles/startBusiness';
import { TitleH3 } from '../../../styles';
import { ReactComponent as IconArrow } from '../../../assets/startBusiness/arrow.svg';
import AddMeetingMinutes from './AddMeetingMinutes';

import { columns } from './table';
import {useLocale} from "../../../utils/locale";

export default (props) => {
  const [t] = useLocale();
  return (
    <MeetingMinutesEmpty>
      <AddMeetingMinutes
        {...props}
      />
      <Table
        columns={columns({ currentPage: 1, t })}
      />
      <div id="empty-table-wrapper">
        <Row gutter={[40]} style={{ opacity: 0.3, position: 'relative' }}>
          <Col span={10}>
            <Skeleton paragraph={{ rows: 4 }} round title={null} />
          </Col>
          <Col span={4}>
            <Skeleton paragraph={{ rows: 4 }} round title={null} />
          </Col>
          <Col span={4}>
            <Skeleton paragraph={{ rows: 4 }} round title={null} />
          </Col>
          <Col span={4}>
            <Skeleton paragraph={{ rows: 4 }} round title={null} />
          </Col>
          <Col span={2}>
            <Skeleton paragraph={{ rows: 4 }} round title={null} />
          </Col>
        </Row>
        <div id="empty-data-wrapper">
          <TitleH3>{t("Meeting minutes is empty.")}</TitleH3>
          <p>{t("Create your first meeting minutes")}</p>
        </div>
        {
          props.meetingMinutesPermissions.create && <IconArrow id="arrow-icon"/>
        }
      </div>
    </MeetingMinutesEmpty>
  )
}
;
