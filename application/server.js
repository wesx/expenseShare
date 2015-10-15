var application_root = __dirname;

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var httpProxy = require('http-proxy');

var path = require('path');
var _ = require('underscore');
var Q = require('q');



var server, app, sessionStore, cookieParser;

var config = {
	port: 1337,
	staticDir: 'static_dist',
	sessionSecret: Math.round(Math.random() * 1e200).toString(36)
};

_.extend(config, require('./config.json'));


// create express server
app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
	secret: config.sessionSecret,
	saveUninitialized: false,
	resave: false,
	rolling: true,
	cookie: { 
		path: '/', 
		httpOnly: true, 
		secure: false,
		maxAge: new Date(Date.now() + 3600000),
	},
}));

app.use(express.static(path.join(application_root, config.staticDir)));

//Show all errors in development
app.use(errorhandler({
	dumpExceptions: true, 
	showStack: true 
}));

// respond to login requests
app.get('/auth', function (req, res) {
	res.send(!!req.session.loggedIn);
});
app.post('/auth', function (req, res) {
	if (
		req.session.loggedIn || 
		(req.body.username === config.user && req.body.password === config.password)
	) {
		req.session.loggedIn = true;
		res.send(true);
	} else {
		res.send(false);
	}
});

var proxy = httpProxy.createProxyServer({});

app.all('/sync*', function(req, res) {
	if (req.session.loggedIn) {
		proxy.web(req, res, { 
			target: 'http://127.0.0.1:5984/expense_share' 
		});
	} else {
		res.status(403).end();
	}

});

// serve index file to all other requests
app.get('*', function (req, res) {
	res.sendfile(path.join(application_root, config.staticDir + '/index.html'));
});

app.listen(config.port, function() {
	console.log('Express server listening on port %d in %s mode', config.port, app.settings.env);
});
