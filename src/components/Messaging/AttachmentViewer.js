import * as React from 'react';
import Lightbox from "react-awesome-lightbox";
// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";

function AttachmentViewer(props) {
  const { data = { title_link: '', title: '' }, visible, setVisible } = props;

  return (
    <div>
      <Lightbox
        visible={visible}
        onClose={() => { setVisible(false); }}
        image={process.env.REACT_APP_ROCKET_BASE_URL + data.title_link}
        title={data.title}
      />
    </div>
  );
}

export default AttachmentViewer;