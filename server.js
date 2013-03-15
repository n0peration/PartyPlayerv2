var config = require('./config.js');
var express = require('express');
var server = express();
var ytr = require('./ytr.js');
var playlist = require('./playlist.js');

  
server.configure(function(){
  server.use(express.methodOverride());
  server.use(express.bodyParser());
  server.use("/css", express.static(__dirname + '/web/css'));
  server.use("/js", express.static(__dirname + '/web/js'));
  server.use(express.static(__dirname + '/web'));
  server.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  server.use(server.router);
});

server.get('/client', function(req, res){
  res.redirect("/client.html");
});

server.get('/playlist', function(req, res){
  res.send(playlist.getList());
});

server.post('/callback', function(req, res) {
	switch(req.body.cmd){
		case "play":
			ytr.searchYoutube(req.body.param, 1, function(data){
				if(data.items.length > 0){
					playlist.addItem({								
									"id": data.items[0].id,
									"duration": data.items[0].duration,
									"title": data.items[0].title
								});
					if(playlist.status === "ready"){	
						playlist.play( function(result){
							console.log(result);
						});
					}
				}
			});
			console.log("search and play on yt:"+req.body.param);
		break;
		case "url":
			console.log("open url:"+req.body.param+" in browser");
			ytr.open(req.body.param);
		break;
		case "fin":
			console.log("finished playing:"+req.body.param);
			playlist.finished(req.body.param, function(result) {
				console.log(result);
			});
		break;
		case "del":
			playlist.remItem(req.body.param);
			console.log("delete from playlist:"+req.body.param);
		break;
		default:
		break;
	}
	
    res.send({success: true});
});

server.listen(config.port);
console.log('Listening on port '+config.port);