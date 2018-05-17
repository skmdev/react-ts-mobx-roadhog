import * as React from 'react';
import { Router, Switch } from 'react-router';
import { createHashHistory } from 'history';

import { setDefaultLoadingComponent } from '../utils/dynamic';
import { getRouterData } from './router';
import Authorized from '../utils/Authorized';

const { AuthorizedRoute } = Authorized;
const browserHistory = createHashHistory();

setDefaultLoadingComponent(() => {
  return <div>Loading...</div>;
});

function RouterConfig() {
  const routerData = getRouterData();
  // const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <Router history={browserHistory}>
      <Switch>
        {/* <Route path="/user" component={UserLayout} /> */}
        <AuthorizedRoute
          path="/"
          render={(props: any) => <BasicLayout {...props} />}
          authority={['admin', 'user']}
          redirectPath="/login"
        />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
