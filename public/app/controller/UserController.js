var userController = angular.module('userController', ['userService']);

userController.controller('UserControllers', function(User){
	var vm = this;

	User.all()
		.success(function(data){
			vm.users = data;
		});
});

userController.controller('UserCreateController',function(User, $location, $window){

	vm = this;

	vm.signupUser = function(){
		console.log("**************** SignUpUser *****************")
		vm.message = '';
		User.create(vm.userData)
			.success(function(response){
				console.log("SignUp user==> Inside then");
				console.log(response);
				vm.userData = {},
				vm.message = response.data.message;
				console.log(" Inside Signup==> response"+vm.message);
				console.log(response);
				$window.localStorage.setItem('token', response.data.token);
				$location.path('/');
			}).error(function(response){
				console.log(response);
			})

	}
});