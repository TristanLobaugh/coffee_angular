var coffeeApp = angular.module("coffeeApp", ["ngRoute"]);

coffeeApp.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "pages/main.html",
		controller: "coffeeController"
	});
	$routeProvider.when("/register", {
		templateUrl: "pages/register.html",
		controller: "coffeeController"
	});
	$routeProvider.when("/login", {
		templateUrl: "pages/login.html",
		controller: "coffeeController"
	});
	$routeProvider.when("/options", {
		templateUrl: "pages/options.html",
		controller: "coffeeController"
	});
	$routeProvider.when("/delivery", {
		templateUrl: "pages/delivery.html",
		controller: "coffeeController"
	});
	$routeProvider.otherwise({
		redirectTo: "/"
	});
});

coffeeApp.controller("coffeeController", function($scope, $http, $location){

	$scope.loginForm = function(){
		$http.post("http://localhost:3000/login", {
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){
			if(response.data.success == "found"){
				$location.path("/options");
			}else if(response.data.failure == "noUser"){
				$scope.errorMessage = "No such user in the db";
			}else if(response.data.failure == "badPassword"){
				$scope.errorMessage = "Bad password for this user.";
			}
		}, function errorCallback(response){
			console.log(response.status);
		});
	}

	$scope.registerForm = function(form){
		$scope.message = $scope.username;
		$http.post("http://localhost:3000/register", {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			console.log(response.data.failure);
			if(response.data.failure == "passwordMatch"){
				$scope.errorMessage = "Your passwords don't match.";
			}else if(response.data.success == "added"){
				$location.path("/options");
			}
		}, function errorCallback(response){
			console.log(response.status);
		});
	}

//END CONTROLLER
});