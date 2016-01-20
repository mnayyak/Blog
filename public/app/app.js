angular.module('MyApp',['ngRoute','appRoute','mainController','authService','userController','userService','storyController','storyService','directive'])

.config(function($httpProvider){

	$httpProvider.interceptors.push('AuthInterceptor');

});