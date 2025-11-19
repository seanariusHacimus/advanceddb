import React, { useState } from "react";
import { Modal, Row, Col, Badge, PieChart } from "../../../UI/shadcn";
import { Button as AntButton, Tabs } from "antd";
import {
  Calendar,
  ChevronDown,
  Download,
  LayoutDashboard,
  List,
  FileText,
} from "lucide-react";
import moment from "moment-timezone";
import { withLocale } from "../../../../utils/locale";
import { indicatorStatus } from "../../../../constants";
import {
  ModalContainer,
  Section,
  InfoRow,
  TagContainer,
  TagBadge,
  AttachmentRow,
  SubActionListItem,
} from "./ViewActionModal.styles";
import { getDonutChartData } from "../../../../utils/statisticsCalculator";

const ViewActionModal = ({
  visible,
  onClose,
  action,
  t,
  isSubaction = false,
  parentAction,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!action) return null;

  const {
    name,
    start_at,
    end_at,
    status,
    description,
    responsive_accounts = [],
    responsive_tags = [],
    pillar_number,
    category,
    sub_category,
    attachments = [],
    sub_actions = [],
    sub_action_stats = {},
  } = action;

  const classification =
    isSubaction && parentAction
      ? {
          pillar_number: parentAction.pillar_number,
          category: parentAction.category,
          sub_category: parentAction.sub_category,
        }
      : {
          pillar_number,
          category,
          sub_category,
        };

  const getStatusLabel = (status) => {
    return indicatorStatus[status] || status;
  };

  const getStatusVariant = (status) => {
    const statusMap = {
      'not_started': 'secondary',
      'in_progress': 'default',
      'completed': 'success',
      'overdue': 'destructive',
      'on_hold': 'outline',
    };
    return statusMap[status] || 'default';
  };

  const categoryInfo = [
    classification.pillar_number,
    classification.category,
    classification.sub_category,
  ]
    .filter(Boolean)
    .join(" • ");

  const donutChartData = getDonutChartData(sub_action_stats);
  
  // Transform data for shadcn PieChart
  const pieChartData = donutChartData.map(item => ({
    label: t(item.title),
    value: item.value || 0,
    color: item.color
  }));

  const tabItems = [
    {
      key: "overview",
      label: (
        <span>
          <LayoutDashboard style={{ marginRight: 6 }} size={16} />
          {t("Overview")}
        </span>
      ),
      children: (
        <>
          <Row gutter={[16, 16]}>
            {!isSubaction && (
              <Col xs={24} md={12}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  padding: '20px'
                }}>
                  <PieChart data={pieChartData} size={200} />
                </div>
              </Col>
            )}

            <Col xs={24} md={isSubaction ? 12 : 12}>
              <Section>
                <div className="section-content">
                  <div className="section-title">
                    <Calendar className="section-icon" size={16} />
                    <span>{t("Project Timeline")}</span>
                  </div>
                  <InfoRow>
                    <div className="info-label">{t("Start")}</div>
                    <div className="info-value">
                      {moment(start_at).format("MMM D, YYYY")}
                    </div>
                  </InfoRow>
                  <InfoRow>
                    <div className="info-label">{t("End")}</div>
                    <div className="info-value">
                      {moment(end_at).format("MMM D, YYYY")}
                    </div>
                  </InfoRow>
                  <InfoRow>
                    <div className="info-label">{t("Action Period")}</div>
                    <div className="info-value">
                      {moment(start_at).format("MMM D")} -{" "}
                      {moment(end_at).format("MMM D, YYYY")}
                    </div>
                  </InfoRow>
                </div>
              </Section>
            </Col>

            <Col xs={24} md={isSubaction ? 12 : 24}>
              <Section>
                <div className="section-content">
                  <div className="section-title">
                    <span>{t("Classification")}</span>
                  </div>
                  <InfoRow>
                    <div className="info-label">{t("Pillar")}</div>
                    <div className="info-value">
                      {classification.pillar_number || "N/A"}
                    </div>
                  </InfoRow>
                  <InfoRow>
                    <div className="info-label">{t("Category")}</div>
                    <div className="info-value">
                      {classification.category || "N/A"}
                    </div>
                  </InfoRow>
                  <InfoRow>
                    <div className="info-label">{t("Sub-category")}</div>
                    <div className="info-value">
                      {classification.sub_category || "N/A"}
                    </div>
                  </InfoRow>
                </div>
              </Section>
            </Col>

            {attachments.length > 0 && (
              <Col xs={24} md={12}>
                <Section>
                  <div className="section-content">
                    <div className="section-title">
                      <span>
                        {t("Action Attachments")} ({attachments.length})
                      </span>
                    </div>
                    {attachments.map((attachment) => (
                      <AttachmentRow key={attachment.id}>
                        <div className="attachment-info">
                          <div className="file-icon">
                            <FileText size={16} />
                          </div>
                          <a
                            href={attachment.file.download_url}
                            target="_blank"
                            download
                            rel="noopener noreferrer"
                            className="file-name"
                          >
                            {attachment.filename}
                          </a>
                        </div>
                        <div
                          className="download-btn"
                          onClick={() => {
                            window.open(attachment.file.download_url, "_blank");
                          }}
                        >
                          <Download size={16} />
                          {t("Download")}
                        </div>
                      </AttachmentRow>
                    ))}
                  </div>
                </Section>
              </Col>
            )}
            {(responsive_accounts.length > 0 || responsive_tags.length > 0) && (
              <Col xs={24} md={12}>
                <Section>
                  <div className="section-content">
                    <div className="section-title">
                      <span>{t("Assigned Tags")}</span>
                    </div>
                    <TagContainer>
                      {responsive_tags.map((tag) => (
                        <TagBadge key={tag.title}>{tag.title}</TagBadge>
                      ))}
                      {responsive_accounts.map((acc) => (
                        <TagBadge key={acc.id}>
                          {acc.first_name} {acc.last_name || ""}
                        </TagBadge>
                      ))}
                    </TagContainer>
                  </div>
                </Section>
              </Col>
            )}

            {description && (
              <Col xs={24}>
                <Section>
                  <div className="section-content">
                    <div className="section-title">
                      <span>{t("Description")}</span>
                    </div>
                    <div
                      style={{
                        paddingTop: 8,
                        lineHeight: "1.6",
                        color: "#262626",
                      }}
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                </Section>
              </Col>
            )}
          </Row>
        </>
      ),
    },
    {
      key: "subactions",
      isHidden: isSubaction,
      label: (
        <span>
          <List style={{ marginRight: 6 }} size={16} />
          {t("Sub-Actions")} ({sub_actions.length})
        </span>
      ),
      children: (
        <div style={{ marginTop: 16 }}>
          {sub_actions.length > 0 ? (
            sub_actions.map((subAction, index) => (
              <SubActionListItem key={subAction.id}>
                <div className="subaction-header">
                  <div
                    style={{ display: "flex", alignItems: "center", flex: 1 }}
                  >
                    <span className="subaction-number">
                      #{subAction.number ?? index}
                    </span>
                    <Badge variant={getStatusVariant(subAction.status)}>
                      {getStatusLabel(subAction.status)}
                    </Badge>
                  </div>
                  <ChevronDown className="expand-icon" size={16} />
                </div>
                <div className="subaction-description">{subAction.name}</div>
                <div className="subaction-date">
                  <Calendar size={14} />
                  {moment(subAction.start_at).format("MMM D")} -{" "}
                  {moment(subAction.end_at).format("MMM D, YYYY")}
                </div>
              </SubActionListItem>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#8c8c8c",
              }}
            >
              {t("No sub-actions available")}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      zIndex={1080}
      styles={{
        content: {
          padding: "32px",
        },
      }}
    >
      <ModalContainer className="view-action-modal">
        <div className="modal-header">
          <div className="header-left">
            <h1>{name}</h1>
            {categoryInfo && <div className="subtitle">{categoryInfo}</div>}
          </div>
          <div className="header-right">
            <Badge variant={getStatusVariant(status)}>
              {getStatusLabel(status)}
            </Badge>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.filter((item) => !item.isHidden)}
          style={{ marginTop: 24 }}
        />
      </ModalContainer>
    </Modal>
  );
};

export default withLocale(ViewActionModal);
