var ytr = require('./ytr.js');
var config = require('./config.js');

module.exports = {
				songs: [ 	
						]

              , status: "ready" // ready or playing
			  , getList: function() {
                    return this.songs
                    }

              , addItem: function(item) { 
					this.songs.push(item);
              		}
              , outputList: function() {
            	  console.log("Array Length:"+this.songs.length);
            	  	for(var i=0;i<this.songs.length;i++){
            	  		if(typeof this.songs[i] != 'undefined'){
	            		    console.log(i+": "+this.songs[i].id); 
	            			}
            	  		}
              		}
              , remItem: function(id) {
	            	for(var key in this.songs){
	          		    if(this.songs[key].id === id){
	          		    	this.songs.splice(key,1);
	          		    	}
	          			}
              		}
              , play: function(callback){ 
            		if(this.songs.length > 0){ 
						        ytr.open("http://"+config.ip+":"+config.port+"/video?videoID="+this.songs[0].id+"&videoTitle="+this.songs[0].title);
						        callback("playing:"+this.songs[0].id); // [0] always top of stack!
						        this.status = "playing";
            		}
            		else {
						this.status = "ready";
            			callback("no songs to play!");
            		}
            	}
              , finished: function(id, callback){
            		this.remItem(id);
            		callback("finished:"+id);
            		this.play( function(result){
            			console.log(result);
            		});
            	}
};