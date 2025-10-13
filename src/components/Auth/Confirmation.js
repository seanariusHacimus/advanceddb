import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";
import { useQueryParam, StringParam } from "use-query-params";
import useInterval from "@use-it/interval";
import { ReactComponent as IconLock } from "../../assets/auth/lock.svg";
import { ReactComponent as IconCheck } from "../../assets/auth/check.svg";
import { ReactComponent as IconEmail } from "../../assets/auth/email.svg";
import { ReactComponent as IconReset } from "../../assets/auth/reset.svg";
import { ReactComponent as IconError } from "../../assets/auth/error.svg";
import iconLogo from "../../assets/logo.svg";
import { Confirmation } from "../../styles/auth";
import Axios from "../../utils/axios";
import {
  ACCOUNT_INFO,
  ACTIVATE_ACCOUNT_BY_INVITE,
  CONFIRM_ACCOUNT,
  FETCH_RESET_PASSWORD_INFO,
  RESEND_EMAIL_CONFIRM,
  RESEND_NOT_EXPIRED_INVITATION,
} from "../../graphql/auth";
import { BooleanParam } from "serialize-query-params";
import { useLocale } from "../../utils/locale";

export function ConfirmationBase({ title, subTitle, extras, icon }) {
  const [t] = useLocale();
  return (
    <Confirmation>
      <Link to="/" id="logo">
        <img src={iconLogo} alt={t("AdvancedDB logo")} style={{ width: 150 }} />
      </Link>
      <Result
        status="success"
        icon={icon}
        title={title}
        subTitle={subTitle}
        extra={extras}
      />
    </Confirmation>
  );
}

export function ConfirmationExtended() {
  const [t] = useLocale();
  const [account, setAccount] = useState({});
  const [reset, setReset] = useState({});
  const [accountId] = useQueryParam("account_id", StringParam);
  const [confirmToken] = useQueryParam("confirm_token", StringParam);
  const [inviteToken] = useQueryParam("invite_token", StringParam);
  const [resetId] = useQueryParam("reset_id", StringParam);
  const [showSuccess] = useQueryParam("show_success", BooleanParam);
  const fetchAccount = () => {
    if (accountId) {
      Axios.post("/graphql", {
        query: ACCOUNT_INFO,
        variables: { id: accountId },
      }).then((res) => {
        const accountInfo = res?.data.data.account_info;
        if (res.status === 200 && accountInfo) {
          setAccount(accountInfo);
        }
      });
    } else if (resetId) {
      Axios.post("/graphql", {
        query: FETCH_RESET_PASSWORD_INFO,
        variables: { id: resetId },
      }).then((res) => {
        const resetInfo = res?.data.data.password_reset_info;
        console.log("res?.data", res?.data);
        if (res.status === 200 && resetInfo) {
          setReset(resetInfo);
        }
      });
    }
  };

  useEffect(() => {
    if (account.status === "unconfirmed" && confirmToken) {
      Axios.post("/graphql", {
        query: CONFIRM_ACCOUNT,
        variables: { confirm_token: confirmToken },
      }).then((res) => {
        const accountInfo = res?.data.data.confirm_account;
        if (res.status === 200 && accountInfo) {
          setAccount({ ...account, ...accountInfo });
        } else {
          fetchAccount();
        }
      });
    }
  }, [account, confirmToken]);

  useEffect(() => {
    if (account.status === "invite_sent" && inviteToken) {
      Axios.post("/graphql", {
        query: ACTIVATE_ACCOUNT_BY_INVITE,
        variables: { token: inviteToken },
      }).then((res) => {
        const accountInfo = res?.data.data.activate_account_by_invitation;
        if (res.status === 200 && accountInfo) {
          setAccount({ ...account, ...accountInfo });
        } else {
          fetchAccount();
        }
      });
    }
  }, [account, inviteToken]);

  const resendConfirm = () => {
    Axios.post("/graphql", {
      query: RESEND_EMAIL_CONFIRM,
      variables: { id: accountId },
    }).then((res) => {
      const accountInfo = res?.data.data.resend_account_confirm;
      if (res.status === 200 && accountInfo) {
        setAccount({ ...account, ...accountInfo });
      } else {
        fetchAccount();
      }
    });
  };

  const resendInvitation = () => {
    Axios.post("/graphql", {
      query: RESEND_NOT_EXPIRED_INVITATION,
      variables: { id: accountId },
    }).then((res) => {
      const accountInfo = res?.data.data.resend_account_not_expired_invite;
      if (res.status === 200 && accountInfo) {
        setAccount({ ...account, ...accountInfo });
      } else {
        fetchAccount();
      }
    });
  };
  useEffect(fetchAccount, []);
  useInterval(fetchAccount, 10000);

  let title = "";
  let subTitle = "";
  let extra = "";
  let icon = "";
  if (resetId && !reset.status) {
    title = t("Reset not found");
    subTitle = "";
    icon = <IconError style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Link key="request-access" to="/request-access" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Request Access")}
      </Link>
    );
  } else if (resetId && reset.status === "created") {
    title = t("Password Reset was sent");
    subTitle = t("Expect an email with instructions");
    icon = <IconEmail style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Link key="login" to="/sign-in" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Login")}
      </Link>
    );
  } else if (resetId && reset.status === "canceled") {
    title = t("Password Reset link was canceled");
    subTitle = t("Create a new password reset");
    icon = <IconError style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Link key="forgot-password" to="/forgot-password" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Forgot password")}
      </Link>
    );
  } else if (resetId && showSuccess && reset.status === "confirmed") {
    title = t("Password reset was successful");
    subTitle = "";
    icon = <IconCheck />;
    extra = (
      <Link key="login" to="/sign-in" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Login")}
      </Link>
    );
  } else if (resetId && !showSuccess && reset.status === "confirmed") {
    title = t("The password reset link is already used");
    subTitle = "";
    icon = <IconError style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Link key="login" to="/sign-in" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Login")}
      </Link>
    );
  } else if (resetId && reset.status === "expired") {
    title = t("Password Reset link is expired");
    subTitle = t("Create a new password reset");
    icon = <IconError style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Link key="forgot-password" to="/forgot-password" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Forgot password")}
      </Link>
    );
  } else if (!account.id && inviteToken) {
    title = t("Invitation is not found or canceled");
    subTitle = t("Request for new invitation or proceed with request access");
    icon = <IconError style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Link key="request-access" to="/request-access" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Request Access")}
      </Link>
    );
  } else if (!account.id && confirmToken) {
    title = t("A user is not found");
    subTitle = t("Proceed with request access");
    icon = <IconError style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Link key="request-access" to="/request-access" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Request Access")}
      </Link>
    );
  } else if (account.status === "pending") {
    title = t(
      "Thank you for verifying your email. You will receive a notification email when your request has been approved."
    );
    subTitle = t("Expect an email once review is completed");
    icon = <IconCheck style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Link key="sign-in" to="/sign-in" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Login")}
      </Link>
    );
  } else if (account.status === "active") {
    title = t("Your account has been activated successfully");
    subTitle = t("Expect a welcome email");
    icon = <IconCheck />;
    extra = (
      <Link key="login" to="/sign-in" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Login")}
      </Link>
    );
  } else if (account.status === "invite_sent") {
    title = t("Invitation was resent");
    subTitle = t("Expect an email invitation");
    icon = <IconEmail style={{ minWidth: 50, minHeight: 50 }} />;
    extra = accountId ? (
      <Button key="resend" onClick={resendInvitation} className="btn small">
        <IconReset
          style={{ verticalAlign: "middle", marginRight: 7, maxHeight: 50 }}
        />
        {t("Resend Invite")}
      </Button>
    ) : (
      <Link key="request-access" to="/request-access" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Request Access")}
      </Link>
    );
  } else if (account.status === "invite_expired") {
    title = t("Invitation is expired");
    subTitle = t("Request for new invitation or proceed with request access");
    icon = <IconError style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Link key="request-access" to="/request-access" className="btn small">
        <IconLock style={{ marginRight: 7 }} />
        {t("Request Access")}
      </Link>
    );
  } else if (account.status === "unconfirmed") {
    title = t("Your request has been successfully submitted.");
    subTitle = t(
      "Please check your email to validate your email address. Please check your spam folder to be sure that our emails are not being detected as spam."
    );
    icon = <IconEmail style={{ minWidth: 50, minHeight: 50 }} />;
    extra = (
      <Button key="resend" onClick={resendConfirm} className="btn small">
        <IconReset
          style={{ verticalAlign: "middle", marginRight: 7, maxHeight: 50 }}
        />
        {t("Resend Email")}
      </Button>
    );
  }

  return (
    <ConfirmationBase
      title={title}
      subTitle={subTitle}
      icon={icon}
      extras={[extra]}
    />
  );
}
