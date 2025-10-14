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

// Route filtering logic
const getVisibleRoutes = (userRole) => {
  const visibleRoutes = ROUTES.filter(
    (item) => !HIDDEN_ROUTES.includes(item.key)
  );

  if (userRole === "coordinator") {
    return visibleRoutes.filter(
      (item) => !item.admin && !HIDDEN_ROUTES.includes(item.key)
    );
  } else if (userRole !== "superuser") {
    return visibleRoutes.filter(
      (item) => !item.secret && !HIDDEN_ROUTES.includes(item.key)
    );
  }
  return visibleRoutes;
};

// Route rendering logic
const renderRoute = (routeConfig) => {
  if (routeConfig.redirectTo) {
    return <Redirect key={routeConfig.key} to={routeConfig.redirectTo} />;
  }

  const routeProps = {
    key: routeConfig.key,
    path: routeConfig.path,
    exact: routeConfig.exact,
  };

  if (routeConfig.component) {
    return (
      <Route
        {...routeProps}
        key={routeConfig.key}
        component={routeConfig.component}
      />
    );
  }
  if (routeConfig.render) {
    return (
      <Route
        {...routeProps}
        key={routeConfig.key}
        render={routeConfig.render}
      />
    );
  }
  return null;
};

function App(props) {
  const { auth } = props;
  const dispatch = useDispatch();

  // Memoized visible routes based on user role
  const visibleRoutes = useMemo(
    () => getVisibleRoutes(auth?.account?.role),
    [auth?.account?.role]
  );

  // Initialize locales on app start
  useEffect(() => {
    dispatch(refreshLocales());
  }, [dispatch]);

  useEffect(async () => {
    if (process.env.NODE_ENV === "production") {
      await Userback("A-UPsXeP9CLLn76dCRx4hcumpHP");
    }
  }, []);

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
