
/**
 * Module dependencies.
 */

//require('./db');

var http = require('http'),
    express = require('express'),
    socketio = require('socket.io'),
    path = require('path'),
    dust_engine = require('dustjs-linkedin'),
    cons = require('consolidate'),
    routes = require('../routes'),
    config = require('../config/config'),
    template_enging = config['template-engine'];

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// all environments
//app.set('port', process.env.PORT || config);
app.set('views', path.join(__dirname, '../views'));

app.set('view engine', template_enging);
app.engine(template_enging, cons[template_enging]);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

config.routes.forEach(function (route) {
	var method = route.method;
	route.settings.forEach(function (setting) {
		app[method](setting.path, routes[setting.value]);
	});
});

server.listen(config.port || process.env.PORT || 3000);

io.sockets.on('connection', function (socket) {
	socket.on('play', function (data) {
		console.log(data);
	});
});

module.exports = app;