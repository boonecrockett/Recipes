const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add fallback for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "buffer": require.resolve("buffer/"),
    "process": require.resolve("process/browser"),
  };

  // Add plugin to provide global variables
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  // Ensure Babel plugins and presets are correctly configured
  if (!config.module) config.module = {};
  if (!config.module.rules) config.module.rules = [];
  
  config.module.rules.push({
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        [require.resolve('@babel/preset-react'), { runtime: 'automatic' }]
      ],
      plugins: [
        [
          require.resolve('@babel/plugin-proposal-private-property-in-object'),
          { loose: true }
        ]
      ],
      babelrc: false,
      configFile: false,
      compact: false,
      cacheDirectory: true,
      cacheCompression: false,
    },
  });

  return config;
};
