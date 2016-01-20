var appRoute = angular.module('appRoute',['ngRoute']);

appRoute.config(function($routeProvider, $locationProvider){
	$routeProvider

		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			controller : 'MainController',
			controllerAs: 'Main'
		})
		.when('/login', {
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/signup',{
			templateUrl: '/app/views/pages/signup.html'
		})
		.when('/allStories',{
			templateUrl: '/app/views/pages/allStories.html',
			controller: 'AllUserStories',
			controllerAs: 'story',
			resolve: {
				stories: function(Story){
					return Story.getAllUserStories();
				}
			}
		})
		.otherwise({
			redirectTo : '/'
		});

		$locationProvider.html5Mode(true);
})