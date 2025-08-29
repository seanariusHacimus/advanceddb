import React, { useRef, useState, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useLocale } from "./locale";
import PropTypes from 'prop-types';

const TinymceEditor = (props) => {
  const [t] = useLocale();
  const editorRef = useRef('');
  const {
    height,
    width,
    value,
    advanced,
    placeholder,
    toolbar_location,
    maxChars,
    customText,
  } = props;

  const handleChanges = useCallback((contect, editor) => {
    const summary = editor.getContent();
    console.log(maxChars);
    if (summary.length > maxChars || Number.MAX_SAFE_INTEGER) {
      editor.setContent(summary.substring(0, maxChars || Number.MAX_SAFE_INTEGER));
      editor.selection.select(editor.getBody(), true); // ed is the editor instance
      editor.selection.collapse(false);
      props.onChange(editor.getContent());
      return false;
    }
    props.onChange(editor.getContent());

  }, [maxChars, value]);


  return (
    <div className="custom-tiyn-editor" style={{ width }}>
      <Editor
        value={value}
        ref={editorRef}
        placeholder={placeholder}
        // apiKey="9big5kymg8sqsd137w6i6asb9cy5hzmra5frfwufdpjy3jxc"
        init={{
          height,
          width,
          menubar: advanced,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist',
          toolbar_location,
          placeholder,
          setup: function (editor) {
            editor.on('init', function (e) {
              console.log('The Editor has initialized.');
            });
          }
        }}
        onEditorChange={handleChanges}
      />
      {
        maxChars ? <p>{t('Maximum character size: ')}{`${maxChars - value.length}/${maxChars}`}</p> : <p>{customText || ''}</p>
      }
      <p>{customText || ''}</p>
    </div>
  );
}

TinymceEditor.defaultProps = {
  height: 200,
  width: '100%',
  value: "",
  advanced: false,
  placeholder: 'Type here ...',
  toolbar_location: 'bottom',
  maxChars: null,
  customText: ''
}

TinymceEditor.propTypes = {
  height: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  advanced: PropTypes.bool,
  placeholder: PropTypes.string,
  toolbar_location: PropTypes.string,
  maxChars: PropTypes.number,
  customText: PropTypes.string,
}

export default TinymceEditor;
