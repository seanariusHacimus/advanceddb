import React, { useCallback, useMemo, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocale } from "../../../utils/locale";
import PropTypes from "prop-types";

// Import components and utilities
import ImageModal from "./ImageModal";
import HtmlCodeModal from "./HtmlCodeModal";
import CharacterCounter from "./CharacterCounter";
import { DEFAULT_TOOLBAR, QUILL_FORMATS } from "./constants";
import { StyledEditor } from "../../../styles";
import { useEditorState } from "./hooks";

// Main Editor Component
const Editor = ({
  height = 200,
  value = "",
  placeholder = "Type here ...",
  maxChars = null,
  customText = "",
  onChange,
}) => {
  const [t] = useLocale();

  // Use custom hook for state management
  const {
    quillRef,
    showImageModal,
    setShowImageModal,
    imageUrl,
    setImageUrl,
    cursorPosition,
    setCursorPosition,
    showHtmlModal,
    setShowHtmlModal,
    handleImageClick,
    handleImageCancel,
    handleHtmlModalClose,
  } = useEditorState();

  // Register custom HTML icon once
  useEffect(() => {
    try {
      const icons = Quill.import("ui/icons");
      icons["html"] =
        '<svg viewBox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"/><path class="ql-stroke" d="M5,7 L13,7"/><path class="ql-stroke" d="M5,9 L13,9"/><path class="ql-stroke" d="M5,11 L11,11"/></svg>';
    } catch (err) {
      // Ignore if Quill isn't available yet
    }
  }, []);

  // Memoized modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: DEFAULT_TOOLBAR,
        handlers: {
          image: handleImageClick,
          html: () => setShowHtmlModal(true),
        },
      },
      history: {
        delay: 1000,
        maxStack: 50,
        userOnly: true,
      },
    }),
    [handleImageClick, setShowHtmlModal]
  );

  // Memoized formats
  const formats = useMemo(() => QUILL_FORMATS, []);

  // Optimized content change handler
  const handleChanges = useCallback(
    (content) => {
      const html = content || "";

      if (maxChars && html.length > maxChars) {
        const quill = quillRef.current?.getEditor();
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

  // Image insertion handler
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

    // Apply responsive styling
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
  }, [
    imageUrl,
    cursorPosition,
    setImageUrl,
    setCursorPosition,
    setShowImageModal,
  ]);

  // HTML change handler
  const handleHtmlChange = useCallback(
    (newHtml) => {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(newHtml);
        onChange?.(newHtml);
      }
    },
    [onChange]
  );

  return (
    <StyledEditor height={height}>
      <ReactQuill
        ref={quillRef}
        id="quill-editor"
        value={value}
        placeholder={placeholder}
        onChange={handleChanges}
        modules={modules}
        formats={formats}
        bounds="#quill-editor"
        style={{
          maxHeight: height,
          minHeight: height,
        }}
      />

      <CharacterCounter
        maxChars={maxChars}
        currentLength={value?.length}
        customText={customText}
        t={t}
      />

      <ImageModal
        isOpen={showImageModal}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        onInsert={handleImageInsert}
        onCancel={handleImageCancel}
      />

      <HtmlCodeModal
        isOpen={showHtmlModal}
        htmlContent={value || ""}
        onClose={handleHtmlModalClose}
        onHtmlChange={handleHtmlChange}
      />
    </StyledEditor>
  );
};

// PropTypes
Editor.propTypes = {
  height: PropTypes.number,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxChars: PropTypes.number,
  customText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default Editor;
