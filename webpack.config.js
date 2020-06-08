var path = require('path');

module.exports = {
    entry: './_javascript/main',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    watch: true
};