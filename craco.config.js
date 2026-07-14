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

      // Allow .js imports from ESM packages (canvg/jspdf) without full specifiers
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      return webpackConfig;
    },
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.transformIgnorePatterns = [
        "[/\\\\]node_modules[/\\\\](?!date-fns|react-day-picker).+\\.(js|jsx|mjs|cjs|ts|tsx)$",
      ];
      jestConfig.moduleNameMapper = {
        ...jestConfig.moduleNameMapper,
        // Mock CSS imports from react-day-picker
        '^react-day-picker/style.css$': '<rootDir>/node_modules/react-day-picker/src/style.css',
        '^react-day-picker/dist/style.css$': '<rootDir>/node_modules/react-day-picker/src/style.css',
      };
      return jestConfig;
    },
  },
};
