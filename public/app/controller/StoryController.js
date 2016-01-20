var storyController = angular.module('storyController',['storyService']);


storyController.controller('StoryController', function(Story, socketio){
	
	var vm = this;

	Story.allStories()
		.success(function(data){
			vm.stories = data;
		})

	vm.createStory = function(){
		console.log("Inside CreateStory ==>");
		Story.create(vm.storyData)
				.success(function(data){
				
					vm.storyData = '';
					vm.message = data.message;
				});
	};

	socketio.on('story',function(data){
		vm.stories.push(data);
	})
});

storyController.controller('AllUserStories', function(stories, socketio){

	var vm = this;

	vm.stories = stories.data;

	socketio.on('story',function(data){
		vm.stories.push(data);
	});

});