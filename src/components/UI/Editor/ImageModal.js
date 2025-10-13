import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { validateImageUrl } from "./validation";

// Image Modal Component
const ImageModal = ({
  isOpen,
  imageUrl,
  onImageUrlChange,
  onInsert,
  onCancel,
}) => {
  const [validationState, setValidationState] = useState({
    isValidating: false,
    isValid: null,
    error: null,
  });

  // Validate URL when it changes
  useEffect(() => {
    if (!imageUrl.trim()) {
      setValidationState({ isValidating: false, isValid: null, error: null });
      return;
    }

    const validateUrl = async () => {
      setValidationState({ isValidating: true, isValid: null, error: null });

      const result = await validateImageUrl(imageUrl);
      setValidationState({
        isValidating: false,
        isValid: result.isValid,
        error: result.error,
      });
    };

    // Debounce validation
    const timeoutId = setTimeout(validateUrl, 500);
    return () => clearTimeout(timeoutId);
  }, [imageUrl]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && validationState.isValid) {
        onInsert();
      }
    },
    [validationState.isValid, onInsert]
  );

  // Handle modal click outside
  const handleModalClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onCancel();
      }
    },
    [onCancel]
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
          minWidth: "400px",
          maxWidth: "500px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Insert Image URL</h3>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Image URL:
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            placeholder="Enter image URL..."
            onKeyPress={handleKeyPress}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${
                validationState.isValidating
                  ? "#ffc107"
                  : validationState.isValid === false
                  ? "#dc3545"
                  : validationState.isValid === true
                  ? "#28a745"
                  : "#ccc"
              }`,
              borderRadius: "4px",
            }}
          />

          {/* Validation feedback */}
          {validationState.isValidating && (
            <div
              style={{ marginTop: "5px", fontSize: "12px", color: "#ffc107" }}
            >
              <span>🔄 Validating image URL...</span>
            </div>
          )}

          {validationState.isValid === true && (
            <div
              style={{ marginTop: "5px", fontSize: "12px", color: "#28a745" }}
            >
              <span>✅ Valid image URL</span>
            </div>
          )}

          {validationState.isValid === false && (
            <div
              style={{ marginTop: "5px", fontSize: "12px", color: "#dc3545" }}
            >
              <span>❌ {validationState.error}</span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onCancel}
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
            onClick={onInsert}
            disabled={!validationState.isValid || validationState.isValidating}
            style={{
              padding: "8px 16px",
              border: "none",
              backgroundColor:
                validationState.isValid && !validationState.isValidating
                  ? "#007bff"
                  : "#6c757d",
              color: "white",
              borderRadius: "4px",
              cursor:
                validationState.isValid && !validationState.isValidating
                  ? "pointer"
                  : "not-allowed",
              opacity:
                validationState.isValid && !validationState.isValidating
                  ? 1
                  : 0.6,
            }}
          >
            {validationState.isValidating ? "Validating..." : "Insert Image"}
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes
ImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  onImageUrlChange: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ImageModal;
