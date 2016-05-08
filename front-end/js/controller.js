var coffeeApp = angular.module("coffeeApp", ["ngRoute", "ngCookies"]);
var apiPath = "http://localhost:3000/";

// Test Secret Key: sk_test_ZaURxApp5wezFDObaQZEUFoF

// Test Publishable Key: pk_test_ViWLfNRoKDqu24EF4Y8aBvaL

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
		controller: "coffee2Controller"
	});
	$routeProvider.when("/shipping", {
		templateUrl: "pages/shipping.html",
		controller: "coffee2Controller"
	});
	$routeProvider.when("/payment", {
		templateUrl: "pages/payment.html",
		controller: "coffee2Controller"
	});
	$routeProvider.when("/success", {
		templateUrl: "pages/success.html",
		controller: "coffee2Controller"
	});
	$routeProvider.when("/failure", {
		templateUrl: "pages/failure.html",
		controller: "coffee2Controller"
	});
	$routeProvider.otherwise({
		redirectTo: "/"
	});
});

coffeeApp.controller("coffeeController", function($scope, $http, $location, $cookies){
		$scope.message = $cookies.get("username");

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
		if($scope.password != $scope.password2){
			$scope.errorMessage = "Your passwords don't match.";
		}else{
			$http.post(apiPath + "register", {
				username: $scope.username,
				password: $scope.password,
				password2: $scope.password2,
				email: $scope.email
			}).then(function successCallback(response){
					$cookies.put("token", response.data.token);
					$cookies.put("username", $scope.username);
					$location.path("/options");
			}, function errorCallback(response){
				console.log(response.status);
			});
		}
	}
});

coffeeApp.controller("coffee2Controller", function($scope, $http, $location, $cookies){
	

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
				$location.path("/checkout");
				}
			}, function errorCallback(response){
				console.log("ERROR, Will Robinson");
			});
	}
//END CONTROLLER
});