import { Link, withRouter } from "react-router-dom";
import { Layout, Alert } from "antd";
import { useSelector } from "react-redux";
import { colors } from "../../constants";
import { useLocale } from "../../utils/locale";

const { Content } = Layout;

function MainContent(props) {
  const [t] = useLocale();

  const {
    user: { request_password_change },
  } = useSelector((state) => ({
    user: state.auth.account,
  }));

  const pathname = props.location.pathname;
  const links = pathname.split("/");

  return (
    <Content
      style={{
        ...styles.content,
        background: pathname.includes("/home") ? "#f5f8fc" : colors.background,
      }}
    >
      {request_password_change &&
        !["profile", "notification-settings", "password-change"].includes(
          links[1]
        ) && (
          <Link
            to="/profile/security"
            style={{ display: "block", margin: "0 -20px" }}
          >
            <Alert
              message={t("Please change your password")}
              type="warning"
              style={{ marginBottom: 20 }}
            />
          </Link>
        )}
      {props.children}
    </Content>
  );
}

const styles = {
  content: {
    padding: "93px 40px 25px",
  },
};

export default withRouter(MainContent);
