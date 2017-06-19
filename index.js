var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var sessions = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var session;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var a =0;
// must use cookieParser before expressSession
app.use(cookieParser());

app.use(sessions({secret:'somesecrettokenhere'}));


mongoose.connect('mongodb://localhost/demo', function(err){
	if(err){
		console.log(err);
	} else{
		console.log('connect to mongodbnewe ');
	}
	});

var chatSchema = mongoose.Schema({
	nick:String,
	msg:String,
	created: {type: Date, default: Date.now}
});

var Demo = mongoose.model('Message',chatSchema);





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
  session.flag =0;
  session.fla =0;
  session.ms = '';
  res.redirect('/');
});

 app.get('/', function(req,res){
 	   	session = req.session;

 		if(session.uniqueID){
 			console.log(session.uniqueID);
 			res.sendfile(__dirname +'/chat.html');
 			var counter = 1;
 			io.on('connection', function(socket){
 			
 			if(session.flag ==0){session.flag=session.flag+1;


				Demo.find({}, function(err, docs){
				if(err) throw err;
				console.log('sending old msgs');
				socket.emit('load old msgs',docs);

				});
}

      

  		socket.on('chat message', function(msg){
  			if ((session.ms == '') || (session.ms != msg))
  			{
  		var newMsg = new Demo({msg:msg,nick:session.uniqueID});
  		newMsg.save(function(err){

 		if (err) throw err;
 	
 	

 		console.log(a);
    	io.emit('chat message',{msg:msg,nick:session.uniqueID});
   
   
    	console.log("hereits"+session.uniqueID);
  			});
  		session.ms = msg;}
		});
 			});
 	}
 	else{
 		console.log(session.id);
 		res.send(session.uniqueID);
 	}
 	
 }

);



http.listen(8080,'192.168.3.37',function(){
  console.log('listening on *:' + 8080);
});

