import { configure } from 'mobx';
import Counter from './counter';

configure({ enforceActions: true });

export default {
  counter: new Counter(),
};
