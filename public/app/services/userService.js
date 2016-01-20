var userService = angular.module('userService',[]);

userService.factory('User',function($http){

	var userServiceFactory = {};

	userServiceFactory.create = function(userData){
		console.log(userData);
		console.log($http.post('/api/singup', userData));
		return $http.post('/api/singup', userData);
	}

	userServiceFactory.all = function(){
		return $http.get('/api/users');
	}

	return userServiceFactory;


});