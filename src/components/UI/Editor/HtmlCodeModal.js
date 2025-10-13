import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

// HTML Code Modal Component
const HtmlCodeModal = ({ isOpen, htmlContent, onClose, onHtmlChange }) => {
  const [copied, setCopied] = useState(false);
  const [editedHtml, setEditedHtml] = useState(htmlContent);

  // Update edited HTML when htmlContent prop changes
  useEffect(() => {
    setEditedHtml(htmlContent);
  }, [htmlContent]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = editedHtml;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [editedHtml]);

  const handleApply = useCallback(() => {
    onHtmlChange(editedHtml);
    onClose();
  }, [editedHtml, onHtmlChange, onClose]);

  const handleCancel = useCallback(() => {
    setEditedHtml(htmlContent); // Reset to original content
    onClose();
  }, [htmlContent, onClose]);

  const handleModalClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleModalClick}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "600px",
          maxWidth: "800px",
          maxHeight: "80vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h3 style={{ margin: 0 }}>HTML Code</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              padding: "5px",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <textarea
            value={editedHtml}
            onChange={(e) => setEditedHtml(e.target.value)}
            style={{
              width: "100%",
              height: "300px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "12px",
              resize: "vertical",
              backgroundColor: "#ffffff",
            }}
            placeholder="Edit HTML content here..."
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              padding: "8px 16px",
              border: "none",
              backgroundColor: copied ? "#28a745" : "#007bff",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {copied ? "✓ Copied!" : "Copy HTML"}
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            style={{
              padding: "8px 16px",
              border: "none",
              backgroundColor: "#28a745",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes
HtmlCodeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  htmlContent: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onHtmlChange: PropTypes.func.isRequired,
};

export default HtmlCodeModal;
