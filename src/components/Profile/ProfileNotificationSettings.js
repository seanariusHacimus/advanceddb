import React, { useEffect, useState } from "react";
import { Row, Col, Tooltip } from "../UI/shadcn";
import { Switch, Divider } from "antd"; // Keep Switch and Divider for now
import { Link, useHistory } from "react-router-dom";
// -------- ASSETS & STYLES ------------
import { ButtonPrimary, Flex, TitleH1 } from "../../styles";
import { ProfileEditPage } from "../../styles/profile";
import iconSave from "../../assets/profile/save.svg";
import Axios from "../../utils/axios";
import {
  MY_ACCOUNT_NOTIFICATION_SETTINGS_QUERY,
  UPDATE_MY_ACCOUNT_MUTATION,
} from "../../graphql/profile";
import { authUpdate } from "../../store/Auth/actions";
import { useDispatch } from "react-redux";
import { notificationsList } from "../../constants/notifications";
import { useLocale } from "../../utils/locale";
import { toast } from "react-toastify";

const verboseGatewayNames = (t) => ({
  push: {
    title: t("Advance-DB Portal"),
    description: 'Receive "%s" notification in Push and Advance-DB Portal?',
  },
  email: {
    title: t("Email"),
    description: 'Receive "%s" notification on Email',
  },
});

function NotificationSettings(props) {
  const [settings, setSettings] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();
  const [t] = useLocale();
  const onSubmit = async () => {
    try {
      const res = await Axios.post("/graphql", {
        query: UPDATE_MY_ACCOUNT_MUTATION,
        variables: { account: { notification_settings: settings } },
      });
      if (res?.data.data) {
        const account = res.data.data.update_my_account;
        dispatch(authUpdate({ account }));
        toast.success(
          t("Your notification settings have been successfully updated")
        );
        history.push("/dashboard");
      }
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.post("/graphql", {
          query: MY_ACCOUNT_NOTIFICATION_SETTINGS_QUERY,
        });

        const account = res.data.data.my_account;
        setSettings(account.notification_settings);
      } catch (err) {
        console.error("[Custom Catch Error]-->", err);
      }
    })();
  }, []);

  return (
    <ProfileEditPage id="profile-page">
      <Flex margin="0 0 30px">
        <TitleH1>{t("Notification settings")}</TitleH1>
        <div className="btn-group">
          <Link to="/profile" className="edit-btn transparent small">
            {t("Cancel")}
          </Link>
          <ButtonPrimary className="small" onClick={onSubmit}>
            <img src={iconSave} alt="Profile" /> {t("Save")}
          </ButtonPrimary>
        </div>
      </Flex>
      <form action="">
        {Object.keys(settings).map((notificationType) => {
          const setting = settings[notificationType];
          const verboseNotificationType = notificationType.split("_").join(" ");
          const disabledNotifications = [
            "action_uncompleted",
            "action_deleted",
          ];

          if (!disabledNotifications.includes(notificationType)) {
            return (
              <div key={notificationType}>
                <h4 className="sub-title">
                  {notificationsList(t)[notificationType]}
                </h4>
                <Row gutter={[20, 20]}>
                  {Object.keys(setting).map((gateway) => {
                    const isEnabled = setting[gateway];
                    const verbose = verboseGatewayNames(t)[gateway];
                    return (
                      <Col span={12} key={gateway}>
                        <Flex
                          jc="space-between"
                          className={`switch ${isEnabled && "checked"}`}
                        >
                          <Tooltip
                            title={t(
                              verbose.description,
                              verboseNotificationType
                            )}
                          >
                            <div className="switch-item-title">
                              {verbose.title}
                            </div>
                          </Tooltip>
                          <Switch
                            size="small"
                            onChange={(enabled) =>
                              setSettings({
                                ...settings,
                                [notificationType]: {
                                  ...setting,
                                  [gateway]: enabled,
                                },
                              })
                            }
                            checked={isEnabled}
                          />
                        </Flex>
                      </Col>
                    );
                  })}
                </Row>
                <Divider style={{ borderColor: "var(--border-grey)" }} />
              </div>
            );
          }
          return null;
        })}
      </form>
    </ProfileEditPage>
  );
}

export default NotificationSettings;
