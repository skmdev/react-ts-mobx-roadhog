import * as React from 'react';
import * as pathToRegexp from 'path-to-regexp';

import { getMenuData } from './menu';
import { getRouterConfig } from './config';
import dynamic from '../utils/dynamic';

let routerDataCache: DataMap<IRouterConfig>;

export const dynamicWrapper = (component: Tasync<any>) => {
  if (component.toString().indexOf('.then(') < 0) {
    if (!routerDataCache) {
      routerDataCache = getRouterData();
    }
    return (props: any) => {
      return React.createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  return dynamic(() => {
    return component().then((raw: any) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData();
      }
      const Component = raw.default || raw;
      return (props: any) =>
        React.createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
    });
  });
};

function getFlatMenuData(menus: IMenuConfig[]): DataMap<IMenuConfig> {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (): DataMap<IRouterConfig> => {
  const routerConfig = getRouterConfig();

  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData: DataMap<IRouterConfig> = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    routerConfig[path].component = dynamicWrapper(routerConfig[path].component);

    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find((key) => pathRegexp.test(`${key}`));
    let menuItem: IMenuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];

    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id

    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
