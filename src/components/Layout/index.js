import { useMemo, useCallback, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import { colors } from "../../constants";
import Style from "../../styles/header";
import useInterval from "@use-it/interval";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MainContent from "./MainContent";

import { useDispatch, useSelector } from "react-redux";
import { fetchWorkingGroupsAction } from "../../store/WorkingGroups/actions";
import { fetchCurrentIndicatorGroupAction } from "../../store/SelectedIndicator/actions";
import { FETCH_APPROVAL_ACTIONS_NUMBER } from "../../graphql/approvals";
import { refreshMyAccount } from "../../store/Auth/actions";
import { useLocale } from "../../utils/locale";
import Axios from "../../utils/axios";

function LayoutComponent(props) {
  const links = props.location.pathname.split("/");
  const sidebar = useMemo(
    () => links.slice(1, 3).reduce((acc, str) => `${acc}/${str}`, ""),
    [links]
  );

  const dispatch = useDispatch();
  const myAccount = useSelector((state) => state.auth.account || {});
  const leaderGroups = useMemo(
    () => myAccount.leader_groups.map((i) => i.id),
    [myAccount.leader_groups]
  );
  const [t] = useLocale();

  const fetchApprovals = useCallback(async () => {
    try {
      let filter = { status: "on_review" };
      if (myAccount.role === "participant") {
        filter = {
          status: "on_review",
          group_id: leaderGroups,
        };
      }
      const res = await Axios.post("/graphql", {
        query: FETCH_APPROVAL_ACTIONS_NUMBER,
        variables: {
          filter,
          filterSubAction: filter,
        },
      });
      if (res?.data) {
        const { actions, sub_actions } = res.data.data;
        setApprovalsCount(actions.total + sub_actions.total);
      }
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
    }
  }, []);

  useInterval(() => {
    dispatch(refreshMyAccount({ hideSpinner: true }));
    fetchApprovals();
    const links = pathname.split("/");
    if (links[1] === "working-group") {
      dispatch(
        fetchCurrentIndicatorGroupAction(links[2] || defaultWorkingGroup, true)
      );
    }
  }, 30000);

  useEffect(() => {
    dispatch(refreshMyAccount({ hideSpinner: true }));
    dispatch(fetchWorkingGroupsAction({ hideSpinner: true }));
    fetchApprovals();
    if (links[1] === "working-group") {
      dispatch(
        fetchCurrentIndicatorGroupAction(links[2] || defaultWorkingGroup, true)
      );
    }
  }, []);

  const pathname = props.location.pathname;
  useEffect(() => {
    const links = pathname.split("/");
    if (links[1] === "working-group") {
      dispatch(
        fetchCurrentIndicatorGroupAction(links[2] || defaultWorkingGroup)
      );
    }
  }, [pathname]);

  return (
    <Style style={{ minHeight: "100vh" }} hasSider id="main-content">
      <Sidebar sidebar={sidebar} />
      <Layout style={styles.wrapper}>
        <Header />
        <MainContent children={props.children} />
      </Layout>
    </Style>
  );
}

const styles = {
  wrapper: {
    background: colors.background,
  },
};

export default withRouter(LayoutComponent);
