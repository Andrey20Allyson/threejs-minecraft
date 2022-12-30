const { config } = require('webpack');
const path = require('path');

const webpackConfig = config.getNormalizedWebpackOptions({
  entry: './javascript/index.js',
  mode: 'production',
  // module: {
  //   rules: [
  //     {
  //       test: /\.tsx$/,
  //       use: 'ts-loader',
  //       exclude: /node_modules/
  //     }
  //   ]
  // },
  resolve: {
    extensions: [ '.js', '.ts', '.tsx' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
});

const isDev = process.argv[process.argv.indexOf('--mode') + 1] === 'development';

if (isDev) {
  webpackConfig.devtool = 'inline-source-map';
}

module.exports = webpackConfig;