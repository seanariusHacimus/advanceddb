import styled from "styled-components";

export const ModalContent = styled.div`
  padding: 10px 0;
`;

export const QuestionContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #527bdd;
`;

export const QuestionText = styled.p`
  color: #252a32;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
`;

export const ResponseContainer = styled.div`
  margin-bottom: 20px;
`;

export const RespondentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 8px;
`;

export const RespondentName = styled.span`
  color: #527bdd;
  font-weight: 600;
  font-size: 14px;
  min-width: 120px;
`;

export const RespondentAnswer = styled.span`
  color: ${(props) => (props.$isAgreeing ? "#52c41a" : "#ff4d4f")};
  font-weight: ${(props) => (props.$isAgreeing ? "500" : "600")};
  font-size: 14px;
`;

export const EconomyResponse = styled.div`
  padding: 12px 16px;
  background: ${(props) => (props.$hasDisagreement ? "#fff7e6" : "#f6ffed")};
  border: 1px solid
    ${(props) => (props.$hasDisagreement ? "#ffe58f" : "#b7eb8f")};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => (props.$hasDisagreement ? "#d46b08" : "#389e0d")};
`;

export const ConsensusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;

  ${(props) => {
    if (props.$consensus === "full") {
      return `
        background: #f6ffed;
        color: #389e0d;
        border: 1px solid #b7eb8f;
      `;
    } else if (props.$consensus === "majority") {
      return `
        background: #fff7e6;
        color: #d46b08;
        border: 1px solid #ffe58f;
      `;
    } else {
      return `
        background: #fff2e8;
        color: #d4380d;
        border: 1px solid #ffd8bf;
      `;
    }
  }}
`;

export const DataSource = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e4ed;
  font-size: 13px;
`;
