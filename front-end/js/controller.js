var coffeeApp = angular.module("coffeeApp", ["ngRoute", "ngCookies"]);
var apiPath = "http://localhost:3000/";

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
	$routeProvider.when("/shipping", {
		templateUrl: "pages/shipping.html",
		controller: "coffeeController"
	});
	$routeProvider.when("/payment", {
		templateUrl: "pages/shipping.html",
		controller: "coffeeController"
	});
	$routeProvider.otherwise({
		redirectTo: "/"
	});
});

coffeeApp.controller("coffeeController", function($scope, $http, $location, $cookies){

		$http.get(apiPath + "getUserData?token=" + $cookies.get("token"), {
		}).then(function successCallback(response){
			if(response.data.failure == "badToken"){
				//User needs to log in
				console.log("badToken");
				$location.path("/register");
			}else{
				$scope.userOptions = response.data;
			}
		}, function errorCallback(response){
			console.log(response.status);
		});

		$scope.loginForm = function(){
		$http.post(apiPath + "login", {
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){
			if(response.data.success == "found"){
				$cookies.put("token", response.data.token);
				$cookies.put("username", $scope.username);
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
		$http.post(apiPath + "register", {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			console.log(response.data.failure);
			if(response.data.failure == "passwordMatch"){
				$scope.errorMessage = "Your passwords don't match.";
			}else if(response.data.success == "added"){
				$cookies.put("token", response.data.token);
				$cookies.put("username", $scope.username);
				$location.path("/options");
			}
		}, function errorCallback(response){
			console.log(response.status);
		});
	}

//OPTIONS PAGE
	$scope.optionsPlan = function(plan){
		if(plan === 1){
			$http.post(apiPath + "options",{
				quantity: "1",
				frequency: "monthly",
				grind: $scope.grindType,
				token: $cookies.get("token")
			}).then(function successCallback(response){
				console.log(response.data);
				$location.path("/shipping");
			}, function errorCallback(response){
				console.log("ERROR, Will Robinson");
			});
		}else if(plan === 2){
			$http.post(apiPath + "options",{
				quantity: 3,
				frequency: "monthly",
				grind: $scope.grindType,
				token: $cookies.get("token")
			}).then(function successCallback(response){
				console.log(response.data);
				$location.path("/shipping");
			}, function errorCallback(response){
				console.log("ERROR, Will Robinson");
			});
		}else if(plan === 3){
			$http.post(apiPath + "options",{
				quantity: $scope.quantity,
				frequency: $scope.frequency,
				grind: $scope.grindType,
				token: $cookies.get("token")
			}).then(function successCallback(response){
				if(response.data.success === "update"){
				$location.path("/shipping");
				}
			}, function errorCallback(response){
				console.log("ERROR, Will Robinson");
			});
		}
	}

//SHIPPING PAGE
		$scope.shippingInfo = function(form){
			$http.post(apiPath + "shipping",{
				fullname: $scope.fullname,
				address: $scope.address1,
				address2: $scope.address2,
				city: $scope.city,
				state: $scope.state,
				zip: $scope.zipCode,
				deliveryDate: $scope.date,
				token: $cookies.get("token")
			}).then(function successCallback(response){
				if(response.data.success === "update"){
				$location.path("/payment");
				}
			}, function errorCallback(response){
				console.log("ERROR, Will Robinson");
			});
	}





















//END CONTROLLER
});