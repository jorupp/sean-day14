// run webpack in watch mode, updating the package with each build 

var webpack = require('webpack');
var exec = require('child_process').exec;
var configuration = require('./webpack.config.js');
var SimpleProgressPlugin = require('webpack-simple-progress-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');

configuration.plugins.push(new SimpleProgressPlugin());
configuration.plugins.push(new WriteFilePlugin({ log: true }));
configuration.plugins.push(new WebpackBuildNotifierPlugin({ sound: false }));

var compiler = webpack(configuration);
var outputOptions = {
    colors: require("supports-color"),
};

// load local settings
var local = {};
try {
    local = require('./local.config.js');
} catch (e) {
    // ignore errors
}

var WebpackDevServer = require('webpack-dev-server');
var server = new WebpackDevServer(compiler, {
    contentBase: './src',
    stats: { colors: true },
    https: true
});
server.listen(15052, '127.0.0.1', function() {
    console.log('server running');
});

/*
// setup proxy
var httpProxy = require('http-proxy');
var fs = require('fs');
var proxy = httpProxy.createServer({
  target: {
    host: 'localhost',
    port: 15050
  },
  ssl: {
    // key: fs.readFileSync('privateKey.pem', 'utf8'),
    // cert: fs.readFileSync('publicCert.pem', 'utf8')
  },
  ws: true,
  secure: true
}).listen(15051);
*/
/*
var lastHash = null;
compiler.watch(configuration.watch, function(err, stats) {
    if(err) {
        lastHash = null;
        console.error(err.stack || err);
        if(err.details) console.error(err.details);
        return;
    }
    if(outputOptions.json) {
        process.stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + "\n");
    } else if(stats.hash !== lastHash) {
        lastHash = stats.hash;
        process.stdout.write(stats.toString(outputOptions) + "\n");
    }
});
*/