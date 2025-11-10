import { Tag } from "antd";
import { Popconfirm } from "../UI/shadcn";
import iconUser from "../../assets/header/user.png";
import icons from "../../constants/icons";
import { ReactComponent as IconCommon } from "../../assets/header/indicatorIcons/common.svg";
import { groupTitleToUrl } from "../../utils";
import EditableArea from "./EditableArea";

const DEFAULT_LOGO = (
  <IconCommon className="user-icon" color="rgb(122, 125, 129)" />
);

export const columns = ({ t, ...props }) => [
  {
    key: "title",
    title: t("Indicator Name"),
    dataIndex: "title",
    className: "drag-visible title",
    render: (val, data) => {
      const url = groupTitleToUrl(data.title);
      const { id } = data;
      return (
        <div className="icons-set">
          {data.removable ? (
            data.icon ? (
              <img
                src={data.icon.url || iconUser}
                className="user-icon"
                onError={(e) => (e.target.src = iconUser)}
                alt={data.title}
              />
            ) : (
              DEFAULT_LOGO
            )
          ) : (
            icons[url] || DEFAULT_LOGO
          )}
          <div className="item-title">
            {data.removable ? (
              <EditableArea title={val} id={id} />
            ) : (
              <div>{val}</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: "members",
    title: t("Members"),
    dataIndex: "members",
    align: "center",
    className: "drag-visible",
    render: (value) => value.length,
    width: "10%",
  },
  {
    key: "sidebar_visible",
    title: t("Status"),
    dataIndex: "sidebar_visible",
    align: "center",
    className: "drag-visible",
    width: "20%",
    render: (val, data) =>
      val ? (
        <Popconfirm
          icon={null}
          okText={t("Yes")}
          cancelText={t("Cancel")}
          title={t("Are you sure to disable this working group?")}
          onConfirm={() => props.updateWorkingGroupStatus(data.id, false)}
        >
          <Tag
            className="clickable active"
            style={{ padding: "4px 16px", width: "90%", maxWidth: 150 }}
          >
            {t("Active")}
          </Tag>
        </Popconfirm>
      ) : (
        <Popconfirm
          icon={null}
          okText={t("Yes")}
          title={t("Are you sure to enable this working group?")}
          onConfirm={() => props.updateWorkingGroupStatus(data.id, true)}
          cancelText={t("Cancel")}
        >
          <Tag
            className="clickable disabled not_started"
            style={{
              padding: "4px 16px",
              width: "90%",
              maxWidth: 150,
              pointerEvents: "all",
            }}
          >
            {t("Disabled")}
          </Tag>
        </Popconfirm>
      ),
  },
];
