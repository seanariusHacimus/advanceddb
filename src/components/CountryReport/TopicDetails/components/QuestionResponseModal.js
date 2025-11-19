import { Modal, Typography, Tabs, Spin } from "antd"; // Using Ant components for modal
import PropTypes from "prop-types";
import { HelpCircle } from "lucide-react";
import {
  ModalContent,
  QuestionContainer,
  QuestionText,
  ResponseContainer,
  EconomyResponse,
  RespondentItem,
  RespondentName,
  RespondentAnswer,
  ConsensusBadge,
  DataSource,
} from "./QuestionResponseModal.style";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const QuestionResponseDetails = ({ questionData }) => {
  return (
    <>
      <QuestionContainer>
        <Title level={5}>Question:</Title>
        <QuestionText>
          {questionData.questionText || "No question text available"}
        </QuestionText>
      </QuestionContainer>

      <ResponseContainer>
        <Title level={5}>Economy Response:</Title>
        <EconomyResponse
          $hasDisagreement={questionData.hasDisagreement || false}
        >
          {questionData.economyResponse || "No response available"}
        </EconomyResponse>
      </ResponseContainer>

      {/* {questionData.respondents && questionData.respondents.length > 0 && (
        <ResponseContainer>
          <Title level={5}>Expert Responses:</Title>
          {questionData.respondents.map((respondent, index) => (
            <RespondentItem key={index}>
              <RespondentName>{respondent.respondent}:</RespondentName>
              <RespondentAnswer $isAgreeing={respondent.answer === "Yes"}>
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
      </ResponseContainer> */}

      <DataSource>
        <Text type="secondary">
          <strong>Data Source:</strong> {questionData.dataSource}
        </Text>
      </DataSource>
    </>
  );
};

const QuestionResponseModal = ({
  visible,
  onClose,
  data,
  loading,
  indicatorId,
  countryName,
}) => {
  if (loading) {
    return (
      <Modal
        title={`Expert Responses for ${indicatorId}`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p>Loading expert responses...</p>
        </div>
      </Modal>
    );
  }

  if (!data || !data.questions || data.questions.length === 0) {
    return (
      <Modal
        title={`Expert Responses for ${indicatorId}`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>No expert responses available for this indicator.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <HelpCircle style={{ color: "hsl(var(--primary))" }} size={16} />
          <span>
            Questions and Responses for {indicatorId} in {countryName}
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      zIndex={1080}
      centered
    >
      <ModalContent>
        <Tabs defaultActiveKey="0">
          {data.questions.map((questionData, index) => (
            <TabPane key={index} tab={`Question ${index + 1}`}>
              <QuestionResponseDetails questionData={questionData} />
            </TabPane>
          ))}
        </Tabs>
      </ModalContent>
    </Modal>
  );
};

QuestionResponseDetails.propTypes = {
  questionData: PropTypes.shape({
    technicalId: PropTypes.string,
    originalIndicatorId: PropTypes.string,
    questionText: PropTypes.string,
    economyResponse: PropTypes.string,
    consensus: PropTypes.string,
    hasDisagreement: PropTypes.bool,
    dataSource: PropTypes.string,
    respondents: PropTypes.arrayOf(
      PropTypes.shape({
        respondent: PropTypes.string,
        answer: PropTypes.string,
      })
    ),
  }).isRequired,
};

QuestionResponseModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    indicatorId: PropTypes.string,
    indicatorName: PropTypes.string,
    country: PropTypes.string,
    totalQuestions: PropTypes.number,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        technicalId: PropTypes.string,
        originalIndicatorId: PropTypes.string,
        questionText: PropTypes.string,
        economyResponse: PropTypes.string,
        consensus: PropTypes.string,
        hasDisagreement: PropTypes.bool,
        dataSource: PropTypes.string,
        respondents: PropTypes.arrayOf(
          PropTypes.shape({
            respondent: PropTypes.string,
            answer: PropTypes.string,
          })
        ),
      })
    ),
  }),
  loading: PropTypes.bool,
  indicatorId: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
};

QuestionResponseModal.defaultProps = {
  data: null,
  loading: false,
};

export default QuestionResponseModal;
