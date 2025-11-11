import styled from "styled-components";

export const ModalContainer = styled.div`
  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0;
    padding-bottom: 8px;
    border-bottom: 1px solid hsl(var(--border));
    gap: 12px;
    transition: border-color 0.3s ease;

    .header-left {
      flex: 1;

      h1 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 700;
        color: hsl(var(--foreground));
        line-height: 1.2;
        transition: color 0.3s ease;
      }

      .subtitle {
        font-size: 14px;
        color: hsl(var(--muted-foreground));
        transition: color 0.3s ease;
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
    color: hsl(var(--foreground));
    margin-bottom: 16px;
    transition: color 0.3s ease;

    .section-icon {
      color: hsl(var(--primary));
      transition: color 0.3s ease;
    }
  }

  .section-content {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    padding: 16px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid hsl(var(--border) / 0.5);
  transition: border-color 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 13px;
    color: hsl(var(--muted-foreground));
    width: 140px;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 14px;
    color: hsl(var(--foreground));
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
  background: hsl(var(--muted) / 0.3);
  border: 1px solid hsl(var(--border));
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 13px;
  color: hsl(var(--foreground));
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
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
      background: hsl(var(--muted) / 0.3);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: hsl(var(--muted-foreground));
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .file-name {
      font-size: 14px;
      color: hsl(var(--foreground));
      font-weight: 500;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: hsl(var(--primary));
      }
    }
  }

  .download-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: hsl(var(--primary));
    font-size: 13px;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
  }
`;

export const SubActionListItem = styled.div`
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: hsl(var(--primary));
    box-shadow: 0 2px 8px hsl(var(--primary) / 0.1);
  }

  .subaction-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .subaction-number {
      font-size: 14px;
      font-weight: 600;
      color: hsl(var(--foreground));
      margin-right: 12px;
      transition: color 0.3s ease;
    }

    .subaction-status {
      flex: 1;
    }

    .expand-icon {
      color: hsl(var(--muted-foreground));
      font-size: 14px;
      transition: color 0.3s ease;
    }
  }

  .subaction-description {
    font-size: 14px;
    color: hsl(var(--muted-foreground));
    margin-bottom: 8px;
    transition: color 0.3s ease;
  }

  .subaction-date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: hsl(var(--muted-foreground));
    transition: color 0.3s ease;
  }
`;
