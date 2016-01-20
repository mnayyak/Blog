var authService = angular.module('authService', []);

authService.factory('Auth',function($http, $q, AuthToken){
	
	var authFactory = {};

	authFactory.login = function(username, password) {
		console.log("Inside Auth Login"+ username  +password);
		return $http.post('/api/login',{
			username: username,
			password: password
		})
		.success(function(data){
			AuthToken.setToken(data.token);
			return data;
		}).error(function(data){
			console.log(data.message);
			return data;
		})
	};

	authFactory.logout = function() {
		console.log("Do Logout");
		AuthToken.setToken(); 
	};

	authFactory.isLoggedIn = function() {
		if(AuthToken.getToken()){
			return true;
		}else {
			return false;
		}
	};

	authFactory.getUser = function() {
		console.log("InsideGetUser");
		if(AuthToken.getToken()){
			console.log("Inside got Token");
			return $http.get('/api/me');
		}else{
			return $q.reject({message: "User has no token"});
		}
	};
	return authFactory;
});


authService.factory('AuthToken', function($window){

	var authTokenFactory = {};

	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	};

	authTokenFactory.setToken = function(token) {
		if(token){
			$window.localStorage.setItem('token', token);
		}else{
			$window.localStorage.removeItem('token');
		}
	};
	return authTokenFactory;
});


authService.factory('AuthInterceptor', function($q, $location, AuthToken){
	var authInterceptorFactory = {};
	
	authInterceptorFactory.request = function(config){
		var token = AuthToken.getToken();
		if(token){
			config.headers['x-access-token']  = token;
		}
	return config;
	};

	authInterceptorFactory.responseError = function(response) {
		if(response.status == 403){
			$location.path('/login');
		}

		return $q.reject(response);
	}

	return authInterceptorFactory;
});
