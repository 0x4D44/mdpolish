const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // When deploying to GitHub Pages, we need to set the public path
  if (process.env.NODE_ENV === 'production') {
    // Update this to match your repo name
    config.output.publicPath = '/polish-timer/';
  }

  return config;
};