import React, { useEffect, useMemo } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import SignUp from "./Auth/SignUp";
import SignIn from "./Auth/SignIn";
import MainContent from "./Header/Header";
import routeConfigs from "../routes";
import { ConfirmationExtended } from "./Auth/Confirmation";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import Spinner from "./UI/Spinner";
import { refreshLocales } from "../store/Locale/actions";
import "moment/locale/es";
import "moment/locale/ru";
import "moment/locale/fr";

function App(props) {
  const { auth } = props;
  // routeConfigs is an array of plain objects. Build mapped route elements
  // when rendering while keeping the original filtering behavior.
  const components = useMemo(() => routeConfigs, []);
  const coordinatorComponents = useMemo(
    () => components.filter((item) => !item.admin),
    [components]
  );
  const memberComponents = useMemo(
    () => components.filter((item) => !item.secret),
    [components]
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refreshLocales());
  }, []);

  let visibleRoutes = components;
  if (auth?.account?.role === "coordinator") {
    visibleRoutes = coordinatorComponents;
  } else if (auth?.account?.role !== "superuser") {
    visibleRoutes = memberComponents;
  }

  const renderRoute = (rc) => {
    if (rc.redirectTo) {
      return <Redirect key={rc.key} to={rc.redirectTo} />;
    }

    const props = {
      key: rc.key,
      path: rc.path,
      exact: rc.exact,
    };

    if (rc.component) return <Route {...props} component={rc.component} />;
    if (rc.render) return <Route {...props} render={rc.render} />;
    return null;
  };

  return (
    <div id="app-container">
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Spinner />
          {auth.isLogged && auth.access_token ? (
            <MainContent>
              <Switch>{visibleRoutes.map(renderRoute)}</Switch>
            </MainContent>
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
