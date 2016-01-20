var storyService = angular.module('storyService', []);

storyService.factory('Story', function($http){

	var storyServiceFactory = {};

	storyServiceFactory.create = function(storyData){
		return $http.post('/api', storyData);
	}

	storyServiceFactory.allStories = function(){
		return $http.get('/api');
	}

	storyServiceFactory.getAllUserStories = function(){
		console.log("Inside the allUSerStory");
		return $http.get('/api/all_stories');
	}

	return storyServiceFactory;


});

storyService.factory('socketio', function($rootScope){

	var socket = io.connect();

	return {
		on: function(eventName, callback){
			socket.on(eventName, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback){
			socket.emit(eventName, function(){
				var args = arguments;
				$rootScope.apply(function(){
					callback.apply(socket,data,args);
				});
			});
		}
	}
});








