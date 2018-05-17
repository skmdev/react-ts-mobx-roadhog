export const getRouterConfig = (): DataMap<IRouterConfig> => ({
  '/': {
    component: () => import('../layouts/BasicLayout'),
    // hideInBreadcrumb: true,
    // name: 'test',
    authority: 'user',
  },
  '/app': {
    component: () => import('../App'),
    authority: 'user',
  },
});

export const MenuConfig: IMenuConfig[] = [];
