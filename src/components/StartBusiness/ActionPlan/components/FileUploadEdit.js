import React, { useState } from "react";
import { Upload, Modal as AntModal, Button as AntButton } from "antd";
import { toast } from "react-toastify";
import { PlusOutlined, PaperClipOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocale } from "../../../../utils/locale";
import Swal from "sweetalert2";
import { useEffect } from "react";
import {
  ADD_ATTACHMENTS,
  DELETE_ATTACHMENTS,
} from "../../../../graphql/actions";
import Axios from "../../../../utils/axios";
import { ButtonPrimary } from "../../../../styles";

const getFilesToAttache = (data) => {
  return data.reduce((acc, item) => {
    if (item.deleted_at === null) {
      acc.push({
        ...item,
        uid: `${item.id}`,
        status: "done",
        url: item.file.download_url,
        name: item.filename,
      });
    }
    return acc;
  }, []);
};

function PicturesWall({
  setAttachments,
  id,
  attachments = [],
  accept = "image/png, image/jpeg, .doc, .docx, .pdf",
  isDisabled = false,
}) {
  const [t] = useLocale();
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    attachments: [],
    fileList: getFilesToAttache(attachments),
  });

  const handleRemove = (file) => {
    Swal.fire({
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
      text: t("Do you want to delete this file?"),
      cancelButtonColor: "#E7E9EB",
      confirmButtonColor: "#e70563",
      showCancelButton: true,
      customClass: "swal-danger",
    }).then(async ({ value }) => {
      if (value) {
        console.log(file);
        removeAttachments(file.uid);
      } else {
        return false;
      }
    });
    return false;
  };

  const addAttachments = async (file) => {
    const { originFileObj, ...uploadFile } = file.file;
    let formData = new FormData();
    const request = {
      query: ADD_ATTACHMENTS,
      variables: {
        action_id: id,
        attachments: [null],
      },
    };

    // ------ Create map for FormData -------
    let map = {};
    Array(1)
      .fill("")
      .forEach((item, index) => {
        map[index] = [`variables.attachments.${index}`];
      });

    // ------ APPEND data to FormDate -------
    formData.append("operations", JSON.stringify(request));
    formData.append("map", JSON.stringify(map));

    Array(1)
      .fill("")
      .forEach((item, index) => {
        formData.append([index], originFileObj);
      });

    try {
      const { data } = await Axios.post("/graphql", formData);

      if (data) {
        console.log(data);
        setData((state) => ({
          ...state,
          fileList: getFilesToAttache(data.data.add_attachments),
        }));
      }
    } catch (err) {
      console.log(err);
      setError(t("The file could not be uploaded"));
      toast.error(t("The file could not be uploaded"));
    }
  };

  const removeAttachments = async (attachmentId) => {
    try {
      const res = await Axios.post("/graphql", {
        query: DELETE_ATTACHMENTS,
        variables: {
          action_id: id,
          attachments: [attachmentId],
        },
      });
      if (res?.data) {
        console.log(res.data.data);
        const fileList = data.fileList.filter(
          (item) => item.id !== attachmentId
        );
        console.log(fileList);
        setData((state) => ({ ...state, fileList }));
      }
    } catch (err) {
      console.log(err);
      setError(t("The file could not be uploaded"));
      toast.error(t("The file could not be uploaded"));
    }
  };

  const uploadButton = (
    <ButtonPrimary
      type="button"
      className="mt-4 default focusable"
      style={{ padding: "8px 40px", height: 41 }}
      tabIndex="0"
      disabled={isDisabled}
    >
      {t("Upload")}
      <PaperClipOutlined
        style={{ marginLeft: 5, fontSize: 20, verticalAlign: "middle" }}
      />
    </ButtonPrimary>
  );

  const { fileList } = data;

  useEffect(() => {
    setAttachments(data.attachments);
  }, [data.attachments]);

  return (
    <>
      <Upload
        action={() => console.log("test")}
        listType={""}
        fileList={fileList}
        onPreview={undefined}
        onChange={addAttachments}
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
