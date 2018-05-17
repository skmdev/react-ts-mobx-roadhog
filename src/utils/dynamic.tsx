import * as React from 'react';

let defaultLoadingComponent: any = (props: any) => null;

interface IState {
  AsyncComponent?: typeof React.Component | null;
}

interface IConfig {
  resolve: Tasync<any>;
  LoadingComponent?: typeof React.Component;
}

export function asyncComponent(config: IConfig) {
  const { resolve } = config;

  class DynamicComponent extends React.Component<any, IState> {
    private mounted: boolean;
    private LoadingComponent: typeof React.Component | ((props: any) => null);

    constructor(props: DynamicComponent['props']) {
      super(props);
      this.LoadingComponent = config.LoadingComponent || defaultLoadingComponent;
      this.state = {
        AsyncComponent: null,
      };
      this.load();
    }

    public componentDidMount() {
      this.mounted = true;
    }

    public componentWillUnmount() {
      this.mounted = false;
    }

    private load() {
      resolve().then((m: any) => {
        const AsyncComponent = m.default || m;

        if (this.mounted) {
          this.setState({ AsyncComponent });
        } else {
          this.state = { ...this.state, AsyncComponent };
        }
      });
    }

    public render() {
      const { AsyncComponent } = this.state;
      const { LoadingComponent } = this;
      if (AsyncComponent) {
        return <AsyncComponent {...this.props} />;
      }
      return <LoadingComponent {...this.props} />;
    }
  }
  return DynamicComponent;
}

function dynamic(component: Tasync<any>) {
  return asyncComponent({
    resolve: async () => component(),
  });
}

const setDefaultLoadingComponent = (LoadingComponent: any) => {
  defaultLoadingComponent = LoadingComponent;
};

export default dynamic;
export { setDefaultLoadingComponent };
