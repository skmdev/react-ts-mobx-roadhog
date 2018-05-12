import { observer } from 'mobx-react';

import * as React from 'react';

import Model from './models';

import * as styles from './App.less';

import logo from './logo.svg';

@observer
class App extends React.Component {
  public render() {
    return (
      <div className={styles.App}>
        <header className={styles.appHeader}>
          <img src={logo} className={styles.appLogo} alt="logo" />
          <h1 className={styles.appTitle}>Welcome to React</h1>
        </header>
        <p className={styles.appTitle}>
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div style={{ fontSize: '40px' }}>{Model.counter.number}</div>
        <button onClick={Model.counter.increment}>increment</button>
        <button onClick={Model.counter.decrement}>decrement</button>
      </div>
    );
  }
}

export default App;
