const nodeExternals = require('webpack-node-externals');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "child_process": false
  };
  
  config.externals = [nodeExternals()];

  return config;
}
