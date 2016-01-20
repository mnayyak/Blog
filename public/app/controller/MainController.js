var mainController = angular.module('mainController',[]);

mainController.controller('MainController', function($rootScope, $location, Auth){
	var vm = this;
	vm.badPassword = false;	
	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function(){
		console.log("called Login On Instant"+ vm.loggedIn )
		vm.loggedIn = Auth.isLoggedIn();
		console.log("called Login On Instant 2nd Time"+ vm.loggedIn )
		if(vm.loggedIn){
			Auth.getUser()
			.then(function(data){
				console.log(data);
				vm.user= data.data;
			});		
		}
	});

	vm.doLogin = function() {
		vm.processing = true;

		vm.error= false;
		console.log("username is"+vm.loginData.username);
		console.log("password is"+vm.loginData.password);
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){
				vm.processing = false;
				console.log("Inside doLogin Success Function"+data.message);	
				Auth.getUser()
					.then(function(data){
						console.log("Inside Success Function");
						vm.user = data.data;
						console.log("Data is===>"+data);
					});
				if(data.Success){
					console.log("Success response");
					$location.path('/');
				}else{
					console.log("Error response"+data.message);
					vm.error = data.message;
					vm.badPassword = true;
				}

			});
	
	}

	vm.doLogout = function() {
		Auth.logout();
		$location.path('/logout');
	}

});
