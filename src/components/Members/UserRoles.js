import { Modal, Table } from "antd";
import { USER_PERMISSIONS } from "../../constants/userRoles";
import { StyledMembersTable } from "../../styles/startBusiness";
import { roleColumns } from "./table";
import { useLocale } from "../../utils/locale";

const UserRoles = (props) => {
  const [t] = useLocale();
  return (
    <Modal
      visible={true}
      title={null}
      footer={null}
      onCancel={props.hideModal}
      width={"80%"}
      style={{ maxWidth: 1200 }}
      zIndex={1080}
    >
      <StyledMembersTable>
        <h2 className="text-center">{t("User types and roles")}</h2>
        <Table
          rowKey="title"
          bordered
          columns={roleColumns(t)}
          dataSource={USER_PERMISSIONS}
          pagination={{
            hideOnSinglePage: true,
            pageSize: USER_PERMISSIONS.length,
          }}
        />
      </StyledMembersTable>
    </Modal>
  );
};

export default UserRoles;
