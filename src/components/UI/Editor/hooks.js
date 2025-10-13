import { useState, useCallback, useRef } from "react";

// Custom hook for Editor state management
export const useEditorState = () => {
  const quillRef = useRef(null);

  // Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [cursorPosition, setCursorPosition] = useState(null);
  const [showHtmlModal, setShowHtmlModal] = useState(false);

  // Image handlers
  const handleImageClick = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      setCursorPosition(range ? range.index : quill.getLength());
    }
    setShowImageModal(true);
  }, []);

  const handleImageCancel = useCallback(() => {
    setImageUrl("");
    setCursorPosition(null);
    setShowImageModal(false);
  }, []);

  // HTML handlers
  const handleHtmlModalClose = useCallback(() => {
    setShowHtmlModal(false);
  }, []);

  return {
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
  };
};
