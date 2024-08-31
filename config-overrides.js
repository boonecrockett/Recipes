module.exports = function override(config, env) {
  config.externals = {
    ...config.externals,
    'child_process': 'require("child_process")',
    'fs': 'require("fs")',
    'google-auth-library': 'require("google-auth-library")',
  };
  return config;
};
