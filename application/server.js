// Module dependencies.
var application_root = __dirname,
	express = require('express'), //Web framework
	path = require('path'), //Utilities for dealing with file paths
	mysql = require('mysql'); //Database access

//Create server
var app = express();

// Configure server

//parses request body and populates request.body
app.use(express.bodyParser());

//Where to serve static content
app.use(express.static(path.join(application_root, 'site')));

//perform route lookup based on url and HTTP method
app.use(app.router);

//Show all errors in development
app.use(express.errorHandler({
	dumpExceptions: true, 
	showStack: true 
}));

//Connect to mySQL Server
var connect = function(app){
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'expense',
		password : 'share'
	});
	console.log('Connecting to SQL - Server');
	connection.connect();
	return connection;
};

var connection = connect(this);
/*
app.get('',function(req,res){});
app.post('',function(req,res){});
app.get(':id',function(req,res){});
app.put(':id',function(req,res){});
app.delete(':id',function(req,res){});
*/
//months
//app.get('/api/months/',function(req,res){});
//app.post('/api/months/',function(req,res){});
app.get('/api/months/:id', function (req, res) {
	var monId = req.params.id;
	connection.query('select * from expense_share.expenses where month = ?',monId,function(err,results){
		if(err) throw err;
		var data = {
			id: monId,
			expenses: results
		};
		res.set('Content-type', 'application/json; charset=utf8');
		res.send(JSON.stringify(data));
	});
});
//app.put('/api/months/:id',function(req,res){});
//app.delete('/api/months/:id',function(req,res){});

//persons
app.get('/api/persons',function(req, res){
	console.log('persons');
	connection.query('select * from expense_share.persons',function(err,results){
		if(err) throw err;
		res.set('Content-type', 'application/json; charset=utf8');
		res.send(JSON.stringify(results));
	});
});
app.post('/api/months/',function(req,res){});
app.get('/api/months/:id',function(req,res){});
app.put('/api/months/:id',function(req,res){});
app.delete('/api/months/:id',function(req,res){});

//expenses
app.get('/api/expenses/',function(req,res){
	console.log('expenses');
});
app.post('/api/expenses/',function(req,res){
	console.log('expenses');
});
app.get('/api/expenses/:id',function(req, res){
	console.log("/////////////");
	var exId = req.params.id;
	connection.query('select * from expense_share.expenses where id=?',exId,function(err,results){
		if(err) throw err;
		console.log('*************');
		connection.query('select * from expense_share.participations where expense=?',exId,function(err,data){
			if(err) throw err;
			console.log('------');
			console.log(data);
			console.log('------');
		});
		res.set('Content-type', 'application/json; charset=utf8');
		res.send(JSON.stringify(results[0]));
	});
});
app.put('/api/expenses/:id',function(req,res){
	connection.query(
		'update expense_share.expenses set description=?, expenses.month=? where id=?',
		[req.body.description, req.body.month, req.body.id],
		function(err,results){
				if(err) {
					throw err;
				}
				res.set('Content-type', 'application/json; charset=utf8');
				res.send(JSON.stringify(req.body));
		}
	);
});
app.delete('/api/expenses/:id',function(req,res){
	console.log('expenses');
});

//participations
app.get('/api/participations/',function(req,res){
	console.log('participations');
});
app.post('/api/participations/',function(req,res){
	console.log('participations');
});
app.get('/api/participations/:id',function(req,res){
	console.log('participations');
});
app.put('/api/participations:/id',function(req,res){
	console.log('participations');
});
app.delete('/api/participations/:id',function(req,res){
	console.log('participations');
});

//default
app.get('*', function (req, res) {
	res.sendfile(path.join(application_root, 'site/index.html'));
});

//Start server
var port = 4242;

app.listen(port, function() {
	console.log('Express server listening on port %d in %s mode', port, app.settings.env );
	
});



var createRestInterface = function(app, name, query){
	console.log("Createing RI with query " + query + " for " + name);
	connection.query(query, function(err,data,fiedls){
		if(err) throw err;
		console.log(data);
		app.get('/api/' + name, function(res, req){
			res.set('Content-type', 'application/json; charset=utf8');
			res.send(JSON.stringify(data));
		});
	});
};









