type Tasync<T> = T | (() => T | Promise<T>);

interface DataMap<T> {
  [key: string]: T;
}

interface IMenuItem {
  name?: string;
  authority?: string | string[];
  hideInBreadcrumb?: boolean;
}

interface IMenuConfig extends IMenuItem {
  key?: any;
  icon?: string;
  path: string;
  children?: IMenuConfig[];
  hideInMenu?: boolean;
  target?: string;
}

interface IRouterConfig extends IMenuItem {
  component: any;
}
