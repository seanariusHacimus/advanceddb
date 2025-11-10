import { useMemo, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import constants, { colors } from "../../constants";
import Style from "../../styles/header";
import useInterval from "@use-it/interval";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MainContent from "./MainContent";

import { useDispatch } from "react-redux";
import { fetchWorkingGroupsAction } from "../../store/WorkingGroups/actions";
import { fetchCurrentIndicatorGroupAction } from "../../store/SelectedIndicator/actions";
import { refreshMyAccount } from "../../store/Auth/actions";
import { useLocale } from "../../utils/locale";
import { fetchApprovalsActionNumber } from "../../store/Approvals/actions";

function LayoutComponent(props) {
  const pathname = props.location.pathname;
  const links = pathname.split("/");
  const sidebar = useMemo(
    () => links.slice(1, 3).reduce((acc, str) => `${acc}/${str}`, ""),
    [links]
  );

  const dispatch = useDispatch();
  const [t] = useLocale();

  useInterval(() => {
    dispatch(refreshMyAccount({ hideSpinner: true }));
    dispatch(fetchApprovalsActionNumber());
    const links = pathname.split("/");
    if (links[1] === "working-group") {
      dispatch(
        fetchCurrentIndicatorGroupAction(links[2] || defaultWorkingGroup, true)
      );
    }
  }, constants.autoRefreshInterval);

  useEffect(() => {
    dispatch(refreshMyAccount({ hideSpinner: true }));
    dispatch(fetchWorkingGroupsAction({ hideSpinner: true }));
    dispatch(fetchApprovalsActionNumber());
    if (links[1] === "working-group") {
      dispatch(
        fetchCurrentIndicatorGroupAction(links[2] || defaultWorkingGroup, true)
      );
    }
  }, []);

  useEffect(() => {
    const links = pathname.split("/");
    if (links[1] === "working-group") {
      dispatch(
        fetchCurrentIndicatorGroupAction(links[2] || defaultWorkingGroup)
      );
    }
  }, [pathname]);

  const isMessagingPage = pathname?.includes("messaging");

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }} id="main-content">
      {!isMessagingPage && <Sidebar sidebar={sidebar} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: isMessagingPage ? 0 : 256, width: isMessagingPage ? "100%" : "calc(100% - 256px)" }}>
        <Header />
        <MainContent children={props.children} />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: colors.background,
  },
};

export default withRouter(LayoutComponent);
