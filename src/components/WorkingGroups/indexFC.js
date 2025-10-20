import React, { Suspense, lazy, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Menu, Popconfirm, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Axios from "../../utils/axios";
import { StyledWorkingGroup } from "../../styles/workingGroup";
import {
  UPDATE_WORKING_GROUP,
  DELETE_WORKING_GROUP,
} from "../../graphql/workingGroups";
import { TitleH3 } from "../../styles";
import { ReactComponent as IconEdit } from "../../assets/reform/edit.svg";
import { ReactComponent as IconDelete } from "../../assets/indicator/delete.svg";
import { fetchWorkingGroupsAction } from "../../store/WorkingGroups/actions";
import DraggableList from "./WorkingGroupList";
import { columns } from "./table";
import { useLocale } from "../../utils/locale";

const EditWorkingGroup = lazy(() => import("./EditWorkingGroup"));

function WorkingGroupList(props) {
  const dispatch = useDispatch();
  const [t] = useLocale();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkingGroupsAction()).then((action) =>
      setGroups(action.payload)
    );
  }, [dispatch]);

  const deleteWorkingGroup = async (id) => {
    try {
      setLoading(true);
      await Axios.post("/graphql", {
        query: DELETE_WORKING_GROUP,
        variables: { id },
      });
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
    } finally {
      dispatch(fetchWorkingGroupsAction());
      setLoading(false);
    }
  };

  const moreActionsBtn = {
    title: "",
    dataIndex: "",
    key: "id",
    width: 5,
    className: "drag-visible",
    render: (val, props) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Dropdown.Button
          className="users more-action-btn"
          trigger={["click"]}
          getPopupContainer={(el) => el.parentNode}
          overlay={
            <Menu className="more-action-btn-table">
              <Menu.Item
                key="1"
                onClick={() => {
                  setEdit(true);
                  setSelectedItem(props);
                }}
                icon={<IconEdit className="has-icon" />}
              >
                {t("Edit")}
              </Menu.Item>
              {props.removable && (
                <Menu.Item key="4" icon={<IconDelete className="has-icon" />}>
                  <Popconfirm
                    title={t("This will disable the working group")}
                    onConfirm={() => deleteWorkingGroup(props.id)}
                    okText={t("Yes, delete it")}
                    cancelText={t("Cancel")}
                  >
                    <span className="ant-dropdown-menu-title-content">
                      {t("Delete")}
                    </span>
                  </Popconfirm>
                </Menu.Item>
              )}
            </Menu>
          }
          icon={<MoreOutlined />}
        />
      </div>
    ),
  };

  return (
    <StyledWorkingGroup>
      <TitleH3 margin="20px 0">{t("All working groups")}</TitleH3>
      <DraggableList
        data={groups.map((item, index) => ({ ...item, index }))}
        columns={[...columns({ t }), moreActionsBtn]}
      />
      {edit && (
        <Suspense fallback={t("Loading...")}>
          <EditWorkingGroup
            visible={edit}
            modalHandler={() => setEdit(false)}
            selectedItem={selectedItem}
          />
        </Suspense>
      )}
    </StyledWorkingGroup>
  );
}

export default withRouter(WorkingGroupList);
