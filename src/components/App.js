import { useEffect, useMemo } from "react";
import { connect, useDispatch } from "react-redux";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ToastContainer } from "react-toastify";
import Userback from "@userback/widget";

import SignUp from "./Auth/SignUp";
import SignIn from "./Auth/SignIn";
import Layout from "./Layout";
import { ROUTES, HIDDEN_ROUTES } from "../routes";
import { ConfirmationExtended } from "./Auth/Confirmation";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import Spinner from "./UI/Spinner";
import { refreshLocales } from "../store/Locale/actions";
import "moment/locale/es";
import "moment/locale/ru";
import "moment/locale/fr";
import { USER_ROLES } from "../constants/userRoles";

// Route filtering logic
const getVisibleRoutes = (userRole) => {
  const visibleRoutes = ROUTES.filter(
    (item) => !HIDDEN_ROUTES.includes(item.key)
  );

  if (userRole === USER_ROLES.COORDINATOR) {
    return visibleRoutes.filter(
      (item) => !item.admin && !HIDDEN_ROUTES.includes(item.key)
    );
  } else if (userRole !== USER_ROLES.SUPERUSER) {
    return visibleRoutes.filter(
      (item) => !item.secret && !HIDDEN_ROUTES.includes(item.key)
    );
  }
  return visibleRoutes;
};

function App(props) {
  const { auth } = props;
  const dispatch = useDispatch();

  // Memoized visible routes based on user role
  const visibleRoutes = useMemo(
    () => getVisibleRoutes(auth?.account?.role),
    [auth?.account?.role]
  );

  useEffect(() => {
    dispatch(refreshLocales());
  }, [dispatch]);

  useEffect(() => {
    const initializeUserback = async () => {
      if (process.env.NODE_ENV !== "development") {
        const userback = await Userback("A-UPsXeP9CLLn76dCRx4hcumpHP");
        console.log("Userback initialized:", userback);
      }
    };

    initializeUserback();
  }, []);

  const renderRoute = (rc) => {
    if (rc.redirectTo) {
      return <Redirect key={rc.key} to={rc.redirectTo} />;
    }

    const props = {
      path: rc.path,
      exact: rc.exact,
    };

    if (rc.component)
      return <Route key={rc.key} {...props} component={rc.component} />;
    if (rc.render) return <Route key={rc.key} {...props} render={rc.render} />;
    return null;
  };

  return (
    <div id="app-container">
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <ToastContainer position="top-right" />
          <Spinner />
          {auth.isLogged && auth.access_token ? (
            <Layout>
              <Switch>{visibleRoutes.map(renderRoute)}</Switch>
            </Layout>
          ) : (
            <Switch>
              <Route path="/request-access" exact component={SignUp} />
              <Route path="/forgot-password" exact component={ForgotPassword} />
              <Route
                path="/confirmation"
                exact
                component={ConfirmationExtended}
              />
              <Route path="/reset-password" exact component={ResetPassword} />
              <Route path="/sign-in" component={SignIn} />
              <Route component={SignIn} />
            </Switch>
          )}
        </QueryParamProvider>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  spinner: state.spinner,
});

export default connect(mapStateToProps)(App);
