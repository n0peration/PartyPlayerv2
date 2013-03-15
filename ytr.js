// load the modules
var youtube = require('youtube-feeds');
var open = require('open');

// export functions videos
module.exports = {
	searchYoutube: function(searchterm,maxresults, cb){
		  youtube.feeds.videos({q: searchterm,
								'max-results':  maxresults,
								 orderby: 'relevance'},
								 function( err, data ) {
														    if( err instanceof Error ) {
														        console.log( err )
														    } else {
														        cb( data );
														    }
														}
												  );
	},
	open: function(dest) {
		open(dest);
	}
};

