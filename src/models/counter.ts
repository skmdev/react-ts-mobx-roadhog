import { observable, action } from 'mobx';

class User {
  @observable public number: number = 0;
  @action
  public increment = () => {
    this.number++;
  };
  @action
  public decrement = () => {
    this.number--;
  };
}

export default User;
