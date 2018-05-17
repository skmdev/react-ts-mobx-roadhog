import * as React from 'react';
import * as pathToRegexp from 'path-to-regexp';
import DocumentTitle from 'react-document-title';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router';

import { getMenuData } from '../../router/menu';

import { getRoutes } from '../../utils/utils';
import Authorized, { checkAuth } from '../../utils/Authorized';

import * as styles from './index.less';

const { AuthorizedRoute } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData: any[] = [];
const getRedirect = (item: IMenuConfig) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach((children: any) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);
// const isMobile: boolean = false;
// enquireScreen((b: boolean) => {
//   isMobile = b;
// });

interface IProps<T> {
  routerData: DataMap<IRouterConfig>;
  location: RouteComponentProps<T>['location'];
  match: RouteComponentProps<T>['match'];
}

interface IState {
  collapsed: boolean;
}

class BasicLayout extends React.Component<IProps<any>, IState> {
  // protected static childContextTypes = {
  //   breadcrumbNameMap: PropTypes.object,
  //   location: PropTypes.object,
  // };

  public state = {
    collapsed: true,
  };

  public componentWillUnmount() {
    // unenquireScreen(this.enquireHandler);
  }

  private getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        (item) => checkAuth(routerData[item].authority) && item !== '/',
      );

      return authorizedPath;
    }
    return redirect;
  };

  public getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Test';
    let currRouterData: any = null;
    // match params path
    Object.keys(routerData).forEach((key) => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - Test`;
    }
    return title;
  }

  public render() {
    const { routerData, match } = this.props;
    const bashRedirect = String(this.getBashRedirect());
    const layout = (
      <div className={styles.basicLayout}>
        <Switch>
          {getRoutes(match.path, routerData).map((item) => (
            <AuthorizedRoute
              key={item.key}
              path={item.path}
              component={item.component}
              exact={item.exact}
              authority={item.authority || ''}
              // redirectPath="/exception/403"
            />
          ))}
          <Redirect exact from="/" to={bashRedirect} />
          <Route render={() => <div>Not Found</div>} />
        </Switch>
      </div>
    );

    return <DocumentTitle title={this.getPageTitle()}>{layout}</DocumentTitle>;
  }
}

export default BasicLayout;
