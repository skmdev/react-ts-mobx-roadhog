import { isUrl } from '../utils/utils';
import { MenuConfig } from './config';

const menuData: IMenuConfig[] = MenuConfig;

function formatter(
  data: IMenuConfig[],
  parentPath = '/',
  parentAuthority?: string | string[],
): IMenuConfig[] {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
