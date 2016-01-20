var directive = angular.module('directive', []);

directive.filter('reverse', function(){
	return function(items){
		return items.slice().reverse();
	};
});