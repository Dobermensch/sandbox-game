const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  const isProduction = env.NODE_ENV === 'production';
  const endpointURL = isProduction ? 'http://localhost:3001' : 'http://localhost:3001';
  const leaderBoardURL = isProduction ? 'http://localhost:3002' : 'http://localhost:3002';
  return {
    mode: env.NODE_ENV,
    entry: './src/app.js',
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'public/dist'),
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        ENDPOINT_URL: endpointURL,
        LEADERBOARD_URL: leaderBoardURL
      })
    ]
  }
};