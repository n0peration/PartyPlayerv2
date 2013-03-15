var config = require('./config.js')
  , app = require('express')()
  , express = require('express')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , ytr = require('./ytr.js')
  , playlist = require('./playlist.js')


server.listen(config.port);
console.log('Server is up and running: http://'+config.ip+':'+config.port);

app.use('/swfobject', express.static(__dirname + '/web/swfobject' ));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/web/app.html');
});

app.get('/video', function (req, res) {
  res.sendfile(__dirname + '/web/video.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('playlist', playlist.getList());
  socket.on('command', function (data) {
    if(data.search){
    	console.log("search for "+data.search);
    	ytr.searchYoutube(data.search, 1, function(data){
				if(data.items != undefined && data.items.length > 0){
					playlist.addItem({								
									"id": data.items[0].id,
									"duration": data.items[0].duration,
									"title": data.items[0].title
								});
          io.sockets.emit('playlist', playlist.getList()); // update playlist to all clients
					if(playlist.status === "ready"){	
						playlist.play( function(result){
							console.log(result);
						});
					}
				}
				else {
					console.log("no results!")
				}
			});      
    }
    if(data.url){
    	console.log("open url "+data.url);
      if(data.url.substr(0,4) === "http"){
        ytr.open(data.url);
      }
    	else {
        ytr.open("http://"+data.url);
      }
    }
    if(data.fin){
    	playlist.finished(data.fin, function(result) {
				console.log(result);
        io.sockets.emit('playlist', playlist.getList()); // update playlist to all clients
			});
    }
    if(data.del){
    	console.log("deleting "+data.del);
    	playlist.remItem(data.del);
    }
  });
});