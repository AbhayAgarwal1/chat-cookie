var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var sessions = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var session;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// must use cookieParser before expressSession
app.use(cookieParser());

app.use(sessions({secret:'somesecrettokenhere'}));

app.use(bodyParser());

app.get('/login', function(req, res){
	session = req.session;
	if(session.uniqueID){
		res.redirect('/');
	}
	else{
    res.sendfile(__dirname + '/login.html');
}
});

app.post('/login', function(req, res){
	session = req.session;
	console.log("abcdef");
  session.uniqueID = req.body.username;
  res.redirect('/');
});

 app.get('/', function(req,res){
 	session = req.session;
 	if(session.uniqueID){
 		console.log(session.uniqueID);
 		res.sendfile(__dirname +'/chat.html');
 	}
 	else{
 		console.log(session.id);
 		res.send(session.uniqueID);
 	}
 	
 });



io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(8080,'192.168.3.37',function(){
  console.log('listening on *:' + 8080);
});

