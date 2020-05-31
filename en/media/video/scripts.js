/*
{
 "kind": "youtube#playlistItemListResponse",
 "etag": "\"fpJ9onbY0Rl_LqYLG6rOCJ9h9N8/8ceyfUXJYRd3XoS7BRDEkSQhfkE\"",
 "pageInfo": {
  "totalResults": 5,
  "resultsPerPage": 5
 },
 "items": [
  {
   "kind": "youtube#playlistItem",
   "etag": "\"fpJ9onbY0Rl_LqYLG6rOCJ9h9N8/H0blC1TB_yZRHp0QX3WUruTHV3U\"",
   "id": "PLGT1KBeZ7z1ZIFJzQS7NkXWiTBd7CAYdCej53IyV3DIk",
   "snippet": {
    "publishedAt": "2014-11-30T01:21:18.000Z",
    "channelId": "UCGP1Y5PXovO6-3p0Ts6af3g",
    "title": "Chopin Etude No.1, Op.10",
    "description": "",
    "thumbnails": {
     "default": {
      "url": "https://i.ytimg.com/vi/xnSuxX4hqoA/default.jpg",
      "width": 120,
      "height": 90
     },
     "medium": {
      "url": "https://i.ytimg.com/vi/xnSuxX4hqoA/mqdefault.jpg",
      "width": 320,
      "height": 180
     },
     "high": {
      "url": "https://i.ytimg.com/vi/xnSuxX4hqoA/hqdefault.jpg",
      "width": 480,
      "height": 360
     }
    },
    "channelTitle": "Qi Xu",
    "playlistId": "PLcwiC_r7CN9hGClORCxu4oPjKgdLrlbo2",
    "position": 0,
    "resourceId": {
     "kind": "youtube#video",
     "videoId": "xnSuxX4hqoA"
    }
   }
}]}
*/
var scope;
var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '100%',
          width: '100%',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }
      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        if(scope.items.length!=0){
        	player.cueVideoById(scope.items[0].id);
        }
      }
      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
    }
(function(){
    var app = angular.module('app', []).config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
    app.controller('main_controller',function($scope){
        scope = $scope;
        $scope.items = [];
        $scope.play_video = function(item){
            player.loadVideoById(item.id);
            document.body.scrollTop=0;
        }
    })
    var apiKey="AIzaSyCghYGR6hhS41DOWOhTiLqFoZkO7O8o4bg";
    var playlistId="PLOXLWMGl_RzY3YbUs8rZVxPFhEWwYHeKc";
    getPlaylistSnippet("");
    function YTDurationToOutput(dur) {
    	reg0 = /PT(\d+)H(\d+)M(\d+)S/;
    	reg1 = /PT(\d+)M(\d+)S/;
    	reg2 = /PT(\d+)M/;
    	reg3 = /PT(\d+)S/;
    	if (reg0.test(dur)) {
    		dur = dur.replace(reg0, function(m, a, b, c) {
    			return (a.length < 2 ? "0" : "") + a + ":" + (b.length < 2 ? "0" : "") + b + ":" + (c.length < 2 ? "0" : "") + c;
    		});
    	} else if (reg1.test(dur)) {
    		dur = dur.replace(reg1, function(m, a, b) {
    			return (a.length < 2 ? "0" : "") + a + ":" + (b.length < 2 ? "0" : "") + b;
    		});
    	} else if (reg2.test(dur)) {
    		dur = dur.replace(reg2, function(m, a) {
    			return (a.length < 2 ? "0" : "") + a + ":00";
    		});
    	} else if (reg3.test(dur)) {
    		dur = dur.replace(reg3, function(m, a) {
    			return "00:" + (a.length < 2 ? "0" : "") + a;
    		});
    	}
    	return dur;
    }



    function getPlaylistSnippet(nextPageToken) {
    	var x = new XMLHttpRequest();
    	x.open("GET", "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=" + playlistId + "&maxResults=50&key=" + apiKey + "&pageToken=" + nextPageToken, true);
    	x.onload = function() {
    		var json = JSON.parse(this.response);
    		var items = json.items;
    		var nextPageToken = json.nextPageToken;
    		if (nextPageToken != null) {
    			getPlaylistSnippet(nextPageToken);
    		}
    		getContentDetails(items);
    	}
    	x.send();
    }

    function getContentDetails(items) {
    	var queryString = "";
    	for (var i = 0; i < items.length; i++) {
    		i == items.length - 1 ? queryString += items[i].contentDetails.videoId : queryString += items[i].contentDetails.videoId + ",";
    	}
    	var x = new XMLHttpRequest();
    	x.open("GET", "https://content.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics%2CcontentDetails&id=" + queryString + "&key=" + apiKey, true);
    	x.onload = function() {
    		extractInfo( JSON.parse(this.response).items);
    	}
    	x.send();
    }

    function extractInfo(input) {
    	for (var i = 0; i < input.length; i++) {
    		try {
    			var temp = {};
    			temp.thumbnail = input[i].snippet.thumbnails.high.url;
    			temp.publishDate = input[i].snippet.publishedAt.split("T")[0];
    			temp.duration = YTDurationToOutput(input[i].contentDetails.duration);
    			temp.viewCount = input[i].statistics.viewCount;
    			temp.description = input[i].snippet.description;
    			temp.title = input[i].snippet.title;
                temp.id=input[i].id;
                scope.items.push(temp);
    			scope.$apply();
    		} catch (e) {
                console.log(e);
            }
    	}
    	if(player.cueVideoById){
    		player.cueVideoById(scope[0].id);
    	}
    }

})();
