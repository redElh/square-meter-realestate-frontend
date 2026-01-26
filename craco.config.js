const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for Node.js built-in modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "process": require.resolve("process/browser"),
        "path": false,
        "fs": false,
        "crypto": false,
        "stream": false,
        "http": false,
        "https": false,
        "zlib": false,
        "url": false,
        "buffer": false,
        "util": false,
        "assert": false,
        "os": false,
        "net": false,
        "tls": false,
        "child_process": false,
      };

      // Provide process polyfill
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        })
      );

      return webpackConfig;
    },
  },
};
