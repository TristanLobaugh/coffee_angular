# Coffee Internet Commerce Website

### Full service web commerce app

## Summary

#### App uses AngularJS, Jquery and native javascript to create a front-end web coomerace site. The back-end is managed my Express/NodeJS and uses Mongoose to handle user data storage in a database.

### Author: Tristan Lobaugh 
+ Github - https://github.com/TristanLobaugh
+ Homepage - http://tristanlobaugh.com

## Demo

[Live Demo](http://tristanlobaugh.com/coffee)

## Screenshots

### Order page:
![alt text](https://raw.githubusercontent.com/TristanLobaugh/coffee_angular/master/front-end/img/screen_shot.png)

### Payment page:
![alt text](https://raw.githubusercontent.com/TristanLobaugh/coffee_angular/master/front-end/img/screen_shot2.png)

##Code Examples

### Back-end database query for user shipping information
```
router.post("/shipping", function(req,res,next){
	Account.update(
		{token: req.body.token},
		{
		fullname: req.body.fullname, 
		address: req.body.address, 
		address2: req.body.address2, 
		city: req.body.city, 
		state: req.body.state, 
		zip: req.body.zip, 
		deliveryDate: req.body.deliveryDate
		},
		{multi: true},
		function(err, numberAffected){
			if (numberAffected.ok == 1){
				res.json({success: "update"});
			}else{
				res.json({failure: "failedupdate"});
			}
		}
	)
});
```

### Front-end log-in function in the AngularJS controller to create user credentials and store the username and token in cookies.
```
$scope.loginForm = function(){
			$http.post(apiPath + "login", {
				username: $scope.username,
				password: $scope.password
			}).then(function successCallback(response){
				if(response.data.success == "found"){
					$cookies.put("token", response.data.token);
					$cookies.put("username", $scope.username);
					$("#login").hide();
					$("#logout").show();
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
```

## To Do