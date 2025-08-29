import React, { useEffect, useMemo } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import SignUp from './Auth/SignUp';
import SignIn from './Auth/SignIn';
import MainContent from './Header/Header';
import AllComponents from '../routes';
import { ConfirmationExtended } from './Auth/Confirmation';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import Spinner from './UI/Spinner';
import { refreshLocales } from "../store/Locale/actions";
import 'moment/locale/es'
import 'moment/locale/ru'
import 'moment/locale/fr'

function App(props) {
  const { auth } = props;
  let components = AllComponents;
  const coordinatorComponents = useMemo(() => AllComponents.filter(item => !item.props.admin));
  const memberComponents = useMemo(() => AllComponents.filter(item => !item.props.secret));
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(refreshLocales())
  }, [])

  if (auth?.account?.role === 'coordinator') {
    components = coordinatorComponents
  } else if (auth?.account?.role !== 'superuser') {
    components = memberComponents;
  }

  return (
    <div id="app-container">
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Spinner />
          {
            auth.isLogged && auth.access_token
              ? (
                <MainContent>
                  <Switch>
                    {components}
                  </Switch>
                </MainContent>
              )
              : (
                <Switch>
                  <Route path="/request-access" exact component={SignUp} />
                  <Route path="/forgot-password" exact component={ForgotPassword} />
                  <Route path="/confirmation" exact component={ConfirmationExtended} />
                  <Route path="/reset-password" exact component={ResetPassword} />
                  <Route path="/sign-in" component={SignIn} />
                  <Route component={SignIn} />
                </Switch>
              )
          }
        </QueryParamProvider>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = (state) => ({ auth: state.auth, spinner: state.spinner });

export default connect(mapStateToProps)(App);
