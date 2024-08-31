const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add fallback for 'require'
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "assert": require.resolve("assert"),
    "buffer": require.resolve("buffer"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util"),
    "process": require.resolve("process/browser"),
  };

  // Add plugins
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
}
