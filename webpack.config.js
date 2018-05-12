const webpack = require('webpack');

module.exports = function(webpackConfig, env) {
  webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
    if (!rule.use) return rule;
    rule.use = rule.use.map((loaderOption) => {
      if (loaderOption.loader && loaderOption.loader.indexOf('/css-loader/') > -1) {
        return {
          loader: require.resolve('typings-for-css-modules-loader'),
          options: {
            modules: true,
            namedExport: true,
            camelCase: true,
            minimize: true,
            localIdentName: '[local]_[hash:base64:5]',
            ...loaderOption.options,
          },
        };
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
  webpackConfig.plugins.push(new webpack.WatchIgnorePlugin([/less\.d\.ts$/]));
  // console.log(webpackConfig);
  // sleep(11000000);
  // function sleep(milliseconds) {
  //   var start = new Date().getTime();
  //   for (var i = 0; i < 1e7; i++) {
  //     if (new Date().getTime() - start > milliseconds) {
  //       break;
  //     }
  //   }
  // }
  return webpackConfig;
};
