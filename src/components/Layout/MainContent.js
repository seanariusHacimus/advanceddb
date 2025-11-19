import { Link, withRouter } from "react-router-dom";
import { Alert } from "../UI/shadcn";
import { useSelector } from "react-redux";
import { colors } from "../../constants";
import { useLocale } from "../../utils/locale";

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
    <main
      style={{
        ...styles.content,
        background: pathname.includes("/home") ? "hsl(var(--card))" : "hsl(var(--background))",
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
            <Alert variant="warning" style={{ marginBottom: 20 }}>
              {t("Please change your password")}
            </Alert>
          </Link>
        )}
      {props.children}
    </main>
  );
}

const styles = {
  content: {
    padding: "93px 40px 25px",
  },
};

export default withRouter(MainContent);
