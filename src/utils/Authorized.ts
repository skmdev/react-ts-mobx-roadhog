import RenderAuthorized from 'ant-design-pro/lib/Authorized';
import { getAuthority } from './authority';

let userAuthority = getAuthority();
let Authorized = RenderAuthorized(userAuthority); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  userAuthority = getAuthority();
  Authorized = RenderAuthorized(getAuthority());
};

const checkAuth = (authority: string[] | string = '') => {
  return authority.indexOf(userAuthority) > -1;
};

export { reloadAuthorized, checkAuth };
export default Authorized;
