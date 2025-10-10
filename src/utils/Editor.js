import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocale } from "./locale";
import PropTypes from "prop-types";

// Image validation
const VALID_IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
];

const VALID_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
];

// URL validation utilities
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidImageUrl = (url) => {
  if (!isValidUrl(url)) return false;

  const urlObj = new URL(url);
  const pathname = urlObj.pathname.toLowerCase();
  const extension = pathname.split(".").pop();

  // Check file extension
  if (extension && VALID_IMAGE_EXTENSIONS.includes(extension)) {
    return true;
  }

  // Check for common image hosting services that don't use extensions
  const imageHosts = [
    "imgur.com",
    "i.imgur.com",
    "images.unsplash.com",
    "pixabay.com",
    "pexels.com",
    "unsplash.com",
    "flickr.com",
    "photobucket.com",
  ];

  return imageHosts.some((host) => urlObj.hostname.includes(host));
};

const validateImageUrl = async (url) => {
  if (!isValidImageUrl(url)) {
    return { isValid: false, error: "Invalid image URL or unsupported format" };
  }

  try {
    // Test if the image can be loaded
    const img = new Image();
    // img.crossOrigin = "anonymous";

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ isValid: false, error: "Image load timeout" });
      }, 10000); // 10 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        resolve({ isValid: true, error: null });
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve({
          isValid: false,
          error: "Image not found or cannot be loaded",
        });
      };

      img.src = url;
    });
  } catch (error) {
    return { isValid: false, error: "Error validating image URL" };
  }
};

const QUILL_MODULES = {
  toolbar: { container: "#custom-quill-toolbar" },
  history: {
    delay: 1000,
    maxStack: 50,
    userOnly: true,
  },
};

const QUILL_FORMATS = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "direction",
  "link",
  "image",
  "blockquote",
  "code-block",
  "clean",
];

// Color options for text and background
const COLOR_OPTIONS = [
  { value: "", label: "Default" },
  { value: "#e60000", label: "Red" },
  { value: "#ff9900", label: "Orange" },
  { value: "#ffff00", label: "Yellow" },
  { value: "#008a00", label: "Green" },
  { value: "#0066cc", label: "Blue" },
  { value: "#9933ff", label: "Purple" },
  { value: "#ffffff", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#888888", label: "Gray" },
];

// Custom Toolbar Component
const EditorToolbar = ({ onImageClick, onHtmlCodeClick, toolbarLocation }) => (
  <div
    className={`quill-toolbar-container ${
      toolbarLocation === "bottom" ? "toolbar-bottom" : "toolbar-top"
    }`}
  >
    <div id="custom-quill-toolbar">
      {/* Headings and Text Format */}
      <span className="ql-formats">
        <select className="ql-header" defaultValue="">
          <option value="">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>
        <select className="ql-size">
          <option value="small">Small</option>
          <option value="">Normal</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
        </select>
      </span>

      {/* Text Formatting */}
      <span className="ql-formats">
        <button className="ql-bold" title="Bold" />
        <button className="ql-italic" title="Italic" />
        <button className="ql-underline" title="Underline" />
        <button className="ql-strike" title="Strikethrough" />
      </span>

      {/* Text Color and Background */}
      <span className="ql-formats">
        <select className="ql-color" title="Text Color">
          {COLOR_OPTIONS.map((color) => (
            <option key={color.value} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>
        <select className="ql-background" title="Background Color">
          {COLOR_OPTIONS.map((color) => (
            <option key={color.value} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>
      </span>

      {/* Lists and Indentation */}
      <span className="ql-formats">
        <button className="ql-list" value="ordered" title="Numbered List" />
        <button className="ql-list" value="bullet" title="Bullet List" />
        <button className="ql-indent" value="-1" title="Decrease Indent" />
        <button className="ql-indent" value="+1" title="Increase Indent" />
      </span>

      {/* Text Alignment */}
      <span className="ql-formats">
        <button className="ql-align" value="" title="Align Left" />
        <button className="ql-align" value="center" title="Align Center" />
        <button className="ql-align" value="right" title="Align Right" />
        <button className="ql-align" value="justify" title="Justify" />
      </span>

      {/* Links and Media */}
      <span className="ql-formats">
        <button className="ql-link" title="Insert Link" />
        <button
          className="ql-image-custom"
          onClick={onImageClick}
          title="Insert Image URL"
        >
          <svg viewBox="0 0 18 18">
            <rect className="ql-stroke" height="10" width="12" x="3" y="4" />
            <circle className="ql-fill" cx="6" cy="7" r="1" />
            <polyline
              className="ql-even ql-fill"
              points="5,12 5,11 7,9 8,10 11,7 13,9 13,12 5,12"
            />
          </svg>
        </button>
      </span>

      {/* Additional Formatting */}
      <span className="ql-formats">
        <button className="ql-blockquote" title="Quote" />
        <button className="ql-code-block" title="Code Block" />
        <button className="ql-clean" title="Remove Formatting" />
      </span>

      {/* HTML Code Button */}
      <span className="ql-formats">
        <button
          className="ql-html-code"
          onClick={onHtmlCodeClick}
          title="Show and Copy HTML Code"
        >
          <svg viewBox="0 0 18 18">
            <rect className="ql-stroke" height="10" width="12" x="3" y="4" />
            <path className="ql-stroke" d="M5,7 L13,7" />
            <path className="ql-stroke" d="M5,9 L13,9" />
            <path className="ql-stroke" d="M5,11 L11,11" />
          </svg>
        </button>
      </span>
    </div>
  </div>
);

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
      onClick={onCancel}
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
            onKeyPress={(e) => {
              if (e.key === "Enter" && validationState.isValid) {
                onInsert();
              }
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

// HTML Code Modal Component
const HtmlCodeModal = ({ isOpen, htmlContent, onClose, onHtmlChange }) => {
  const [copied, setCopied] = useState(false);
  const [editedHtml, setEditedHtml] = useState(htmlContent);

  // Update edited HTML when htmlContent prop changes
  useEffect(() => {
    setEditedHtml(htmlContent);
  }, [htmlContent]);

  const handleCopy = async () => {
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
  };

  const handleApply = () => {
    onHtmlChange(editedHtml);
    onClose();
  };

  const handleCancel = () => {
    setEditedHtml(htmlContent); // Reset to original content
    onClose();
  };

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
      onClick={onClose}
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

// Character Counter Component
const CharacterCounter = ({ maxChars, currentLength, customText, t }) => {
  if (maxChars) {
    return (
      <p>
        {t("Maximum character size: ")}
        {`${maxChars - (currentLength || 0)}/${maxChars}`}
      </p>
    );
  }
  return <p>{customText || ""}</p>;
};

// Main Editor Component
const TinymceEditor = ({
  height = 200,
  width = "100%",
  value = "",
  advanced = false,
  placeholder = "Type here ...",
  toolbar_location = "bottom",
  maxChars = null,
  customText = "",
  onChange,
}) => {
  const [t] = useLocale();
  const quillRef = useRef(null);

  // Image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [cursorPosition, setCursorPosition] = useState(null);

  // HTML code modal state
  const [showHtmlModal, setShowHtmlModal] = useState(false);

  // Memoized modules and formats for performance
  const modules = useMemo(() => QUILL_MODULES, []);
  const formats = useMemo(() => QUILL_FORMATS, []);

  // Handle content changes with character limit
  const handleChanges = useCallback(
    (content, delta, source, editor) => {
      const html = content || "";
      const quill = quillRef.current?.getEditor();

      if (maxChars && html.length > maxChars) {
        const truncated = html.substring(0, maxChars);
        if (quill?.clipboard?.dangerouslyPasteHTML) {
          quill.clipboard.dangerouslyPasteHTML(truncated);
          onChange?.(quill.root.innerHTML || truncated);
        } else {
          onChange?.(truncated);
        }
        return;
      }

      onChange?.(html);
    },
    [maxChars, onChange]
  );

  // Image insertion handlers
  const handleImageClick = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      setCursorPosition(range ? range.index : quill.getLength());
    }
    setShowImageModal(true);
  }, []);

  const handleImageInsert = useCallback(() => {
    if (!imageUrl.trim()) return;

    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    let index = cursorPosition;
    if (index === null) {
      const range = quill.getSelection(true);
      index = range ? range.index : quill.getLength();
    }

    // Insert the image
    quill.insertEmbed(index, "image", imageUrl);

    // Apply default styling after insertion
    setTimeout(() => {
      const images = quill.root.querySelectorAll("img");
      const lastImage = images[images.length - 1];
      if (lastImage && lastImage.src === imageUrl) {
        Object.assign(lastImage.style, {
          maxWidth: "100%",
          height: "auto",
          objectFit: "contain",
        });
      }
    }, 50);

    // Move cursor and focus
    quill.setSelection(index + 1);
    quill.focus();

    // Reset state
    setImageUrl("");
    setCursorPosition(null);
    setShowImageModal(false);
  }, [imageUrl, cursorPosition]);

  const handleImageCancel = useCallback(() => {
    setImageUrl("");
    setCursorPosition(null);
    setShowImageModal(false);
  }, []);

  // HTML code handlers
  const handleHtmlCodeClick = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      setShowHtmlModal(true);
    }
  }, []);

  const handleHtmlModalClose = useCallback(() => {
    setShowHtmlModal(false);
  }, []);

  const handleHtmlChange = useCallback(
    (newHtml) => {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        // Set the HTML content directly in Quill
        quill.clipboard.dangerouslyPasteHTML(newHtml);
        // Trigger the onChange callback to update the parent component
        onChange?.(newHtml);
      }
    },
    [onChange]
  );

  return (
    <div className="custom-tiyn-editor" style={{ width }}>
      {/* Top Toolbar */}
      {toolbar_location !== "bottom" && (
        <EditorToolbar
          onImageClick={handleImageClick}
          onHtmlCodeClick={handleHtmlCodeClick}
          toolbarLocation={toolbar_location}
        />
      )}

      {/* Quill Editor */}
      <ReactQuill
        ref={quillRef}
        value={value}
        placeholder={placeholder}
        onChange={handleChanges}
        style={{ height }}
        modules={modules}
        formats={formats}
      />

      {/* Bottom Toolbar */}
      {toolbar_location === "bottom" && (
        <EditorToolbar
          onImageClick={handleImageClick}
          onHtmlCodeClick={handleHtmlCodeClick}
          toolbarLocation={toolbar_location}
        />
      )}

      {/* Character Counter */}
      <CharacterCounter
        maxChars={maxChars}
        currentLength={value?.length}
        customText={customText}
        t={t}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        onInsert={handleImageInsert}
        onCancel={handleImageCancel}
      />

      {/* HTML Code Modal */}
      <HtmlCodeModal
        isOpen={showHtmlModal}
        htmlContent={value || ""}
        onClose={handleHtmlModalClose}
        onHtmlChange={handleHtmlChange}
      />
    </div>
  );
};

// PropTypes
TinymceEditor.propTypes = {
  height: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  advanced: PropTypes.bool,
  placeholder: PropTypes.string,
  toolbar_location: PropTypes.string,
  maxChars: PropTypes.number,
  customText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TinymceEditor;
