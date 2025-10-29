import styled from "styled-components";

export const ModalContainer = styled.div`
  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e8e8e8;
    gap: 12px;

    .header-left {
      flex: 1;

      h1 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 700;
        color: #262626;
        line-height: 1.2;
      }

      .subtitle {
        font-size: 14px;
        color: #595959;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-right: 24px;
    }
  }
  .status-button {
    border: none;
    width: fit-content;

    pointer-events: none;
  }
`;

export const Section = styled.div`
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 16px;

    .section-icon {
      color: #1890ff;
    }
  }

  .section-content {
    background: #ffffff;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 16px;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 13px;
    color: #8c8c8c;
    width: 140px;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 14px;
    color: #262626;
    font-weight: 500;
    flex: 1;
  }
`;

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TagBadge = styled.div`
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 13px;
  color: #262626;
`;

export const AttachmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .attachment-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;

    .file-icon {
      width: 32px;
      height: 32px;
      background: #f5f5f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #595959;
    }

    .file-name {
      font-size: 14px;
      color: #262626;
      font-weight: 500;
      text-decoration: none;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .download-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #1890ff;
    font-size: 13px;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background: #e6f7ff;
    }
  }
`;

export const SubActionListItem = styled.div`
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }

  .subaction-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .subaction-number {
      font-size: 14px;
      font-weight: 600;
      color: #262626;
      margin-right: 12px;
    }

    .subaction-status {
      flex: 1;
    }

    .expand-icon {
      color: #8c8c8c;
      font-size: 14px;
    }
  }

  .subaction-description {
    font-size: 14px;
    color: #595959;
    margin-bottom: 8px;
  }

  .subaction-date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #8c8c8c;
  }
`;
