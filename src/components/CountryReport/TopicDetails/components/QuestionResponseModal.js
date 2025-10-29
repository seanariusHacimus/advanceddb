import React from "react";
import { Modal, Typography } from "antd";
import PropTypes from "prop-types";
import { QuestionOutlined } from "@ant-design/icons";
import {
  ModalContent,
  QuestionContainer,
  QuestionText,
  ResponseContainer,
  EconomyResponse,
} from "./QuestionResponseModal.style";

const { Title, Text } = Typography;

const QuestionResponseModal = ({ visible, onClose, data, indicatorId }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Get the first item (there should only be one per indicator)
  const questionData = data[0];

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <QuestionOutlined style={{ color: "#527bdd" }} />
          <span>Questions and Responses for {indicatorId}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <ModalContent>
        <QuestionContainer>
          <Title level={5}>Question:</Title>
          <QuestionText>{questionData.questionText}</QuestionText>
        </QuestionContainer>

        <ResponseContainer>
          <Title level={5}>Economy Response:</Title>
          <EconomyResponse $hasDisagreement={questionData.hasDisagreement}>
            {questionData.economyResponse}
          </EconomyResponse>
        </ResponseContainer>

        {/* HIDE the data source and the expert responses for now */}
        {/* {questionData.respondents && questionData.respondents.length > 0 && (
          <ResponseContainer>
            <Title level={5}>Expert Responses:</Title>
            {questionData.respondents.map((respondent, index) => (
              <RespondentItem key={index}>
                <RespondentName>{respondent.respondent}:</RespondentName>
                <RespondentAnswer
                  $isAgreeing={respondent.answer === "Yes" ? true : false}
                >
                  {respondent.answer}
                </RespondentAnswer>
              </RespondentItem>
            ))}
          </ResponseContainer>
        )}

        <ResponseContainer>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Title level={5} style={{ margin: 0 }}>
              Consensus:
            </Title>
            <ConsensusBadge $consensus={questionData.consensus}>
              {questionData.consensus === "full" && "✓ Full Agreement"}
              {questionData.consensus === "majority" && "⚠ Majority Agreement"}
              {questionData.consensus === "no-data" && "⊘ No Data"}
              {questionData.consensus === "split" && "⊘ Split"}
            </ConsensusBadge>
          </div>
        </ResponseContainer>

        <DataSource>
          <Text type="secondary">
            <strong>Data Source:</strong> {questionData.dataSource}
          </Text>
        </DataSource> */}
      </ModalContent>
    </Modal>
  );
};

QuestionResponseModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.array,
  indicatorId: PropTypes.string.isRequired,
};

export default QuestionResponseModal;
