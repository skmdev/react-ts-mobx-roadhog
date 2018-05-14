const webpack = require('webpack');

module.exports = function(webpackConfig) {
  // if (process.env.NODE_ENV === 'development') {
  webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
    if (!rule.use) return rule;

    rule.use = rule.use.map((loaderOption) => {
      if (loaderOption.loader && loaderOption.loader.indexOf('/css-loader/') > -1) {
        if (loaderOption.options.modules) {
          return {
            loader: require.resolve('typings-for-css-modules-loader'),
            options: {
              modules: true,
              namedExport: true,
              camelCase: true,
              minimize: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          };
        }
        return loaderOption;
      }
      if (typeof loaderOption === 'string' && loaderOption.indexOf('/style-loader/') > -1) {
        return {
          loader: require.resolve('style-loader'),
        };
      }
      return loaderOption;
    });
    return rule;
  });

  if (process.env.NODE_ENV === 'development') {
    webpackConfig.plugins.push(new webpack.WatchIgnorePlugin([/less\.d\.ts$/]));
  }

  return webpackConfig;
};
