import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { useLocale } from '../../../utils/locale';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { ButtonPrimary } from '../../../styles';

function PicturesWall({ setAttachments, accept = 'image/png, image/jpeg, .doc, .docx, .pdf', isDisabled = false }) {
  const [t] = useLocale()
  const [data, setData] = useState({
    attachments: [],
    fileList: [],
  });

  const handleChange = (req) => {
    console.log(req)
    const attachments = req.fileList.map(i => i.originFileObj);
    setData(state => ({ ...state, attachments, fileList: req.fileList.map(i => ({ ...i, status: 'done' })) }));
  };

  const handleRemove = file => {
    console.log(file)

    Swal.fire({
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
      text: t("Do you want to delete this file?"),
      cancelButtonColor: '#E7E9EB',
      confirmButtonColor: '#e70563',
      showCancelButton: true,
      customClass: 'swal-danger',
    }).then(async ({ value }) => {
      if (value) {
        const fileList = data.fileList.filter(item => item.uid !== file.uid);
        const attachments = fileList.map(i => i.originFileObj);
        setData(state => ({ ...state, fileList, attachments }));
      } else {
        return false;
      }
    });
    return false;
  }

  const uploadButton = (
    <ButtonPrimary className="mt-4 default focusable" style={{ padding: '8px 40px', height: 41 }} tabIndex="0" disabled={isDisabled}>
      {t("Upload")}
      <PaperClipOutlined style={{ marginLeft: 5, fontSize: 20, verticalAlign: 'middle' }} />
    </ButtonPrimary>
  );

  const { fileList, } = data;

  useEffect(() => {
    setAttachments(data.attachments);
  }, [data.attachments]);

  return (
    <>
      <Upload
        action={() => console.log('test')}
        listType={""}
        fileList={fileList}
        onPreview={undefined}
        onChange={handleChange}
        accept={accept}
        onRemove={handleRemove}
        showUploadList={{ showDownloadIcon: true }}
        data={(file) => ({ name: file.name, content_type: file.type })}
        disabled={isDisabled}
      >
        {uploadButton}
      </Upload>
    </>
  );
}

export default PicturesWall;