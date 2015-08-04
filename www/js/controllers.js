var site_url = 'http://bj.1000unit.com/';
//var site_url = 'http://localhost/balconies-jakarta/';
var upload_url = site_url + 'asset/upload/';

angular.module('starter.controllers', [])
.controller('AppCtrl', function($rootScope, $scope, $http, $ionicPopup, $timeout){
    $rootScope.upload_url = upload_url;

    if($.cookie('login') == "true") {
    	$("a.login-button").hide();
    	$("a.profile-button").show();
    } else {
    	$("a.login-button").show();
    	$("a.profile-button").hide();
    }

	$rootScope.showPopupLogin = function() {
	  $rootScope.data = {}

	  var myPopup = $ionicPopup.show({
	    template: '<input type="text" ng-model="data.psm">',
	    title: 'Login using your PSM number',
	    subTitle: 'For getting information about your apartment',
	    scope: $rootScope,
	    buttons: [
	      { text: 'Cancel' },
	      {
	        text: 'Login',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$rootScope.data.psm) {
	            e.preventDefault();
	          } else {
				var psm = $rootScope.data.psm;
				$http.post(site_url + 'api/auth/login?psm='+psm)
				.success(function(data){
					if(data.status == 'success') {
						$ionicPopup.alert({title: 'Login Success',template: 'Thank you for login'});
						$.cookie('login', true);
						$.cookie('psm', data.data.psm_number);
						$("a.login-button").hide();
						$("a.profile-button").show();
						window.location = '#/app/profile';
					} else {
						$ionicPopup.alert({title: 'Login Failed',template: 'Please insert correct the PSM number'});
					}
				})
	          }
	        }
	      }
	    ]
	  });
	 };
})

.controller('select_apartment_ctrl', function($scope,$http,$stateParams){
    $http.get(site_url + 'apartment/list')
    .success(function(data){
        $scope.apartlist = data;
    })

    $scope.select_apart = function(id){
        $http.post(site_url + 'apartment/set_default?apart_id='+this.apart.apart_id+'&regid='+registered_id)
        .success(function(){
            alert(registered_id);
            $('#menu-toggle').show();
            window.location = '#/app/about_us';
        })
    }
})
.controller('about_us_ctrl',function($scope,$http,$stateParams){
	$('a.back-button').hide();
	$('p.title_page').html('About Us');
})


.controller('apartment_ctrl', function($scope,$http,$stateParams){
	$http.get(site_url + 'api/apartment/list?id=' + $stateParams.id)
	.success(function(data){
		$scope.data = data;
	})
})


.controller('apartment_details_ctrl', function($scope,$http,$stateParams){
	$http.get(site_url + 'api/apartment/details?id=' + $stateParams.apartment_id)
	.success(function(data){
		$scope.data = data;
	})
})
.controller('apartment_highlight_ctrl', function($scope,$http,$stateParams){
	$http.get(site_url + 'api/apartment/category?id=' + $stateParams.apartment_id + '&category_id=1&level=' + $stateParams.level)
	.success(function(data){
		$scope.data = data;
	})
})
.controller('apartment_gallery_ctrl', function($scope,$http,$stateParams){
	$http.get(site_url + 'api/apartment/category?id=' + $stateParams.apartment_id + '&category_id=2&level=' + $stateParams.level)
	.success(function(data){
		$scope.data = data;
	})
})
.controller('apartment_info_ctrl', function($scope,$http,$stateParams){
	$http.get(site_url + 'api/apartment/category?id=' + $stateParams.apartment_id + '&category_id=3&level=' + $stateParams.level)
	.success(function(data){
		$scope.data = data;
	})
})

.controller('class_communities_ctrl', function($scope,$http,$stateParams){
	$http.get(site_url + 'api/class_communities/list')
	.success(function(data){
		$scope.data = data;
	})	
})
.controller('class_communities_details_ctrl', function($scope,$http,$stateParams){
	$http.get(site_url + 'api/class_communities/details?id=' + $stateParams.class_id)
	.success(function(data){
		$scope.data = data;
	})	
})

.controller('events_ctrl', function($scope,$http,$stateParams){
	$http.get(site_url + 'api/events/list')
	.success(function(data){
		$scope.data = data;
	})	
})
.controller('events_details_ctrl', function($scope,$http,$stateParams){
	$http.get(site_url + 'api/events/details?id=' + $stateParams.events_id)
	.success(function(data){
		$scope.data = data;
	})	
})

.controller('profile_ctrl',function($scope,$http,$ionicPopup) {
	var psm = $.cookie('psm');
	$http.post(site_url + 'api/auth/get?psm=' + psm)
	.success(function(data){
		$scope.data = data;
	})

	$scope.logoutConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
		 title: 'Balconies Jakarta',
		 template: 'Are you sure want logout?'
		});
		confirmPopup.then(function(res) {
		 if(res) {
			$.removeCookie('login');
			$.removeCookie('psm');
			$http.post(site_url + 'api/auth/logout?psm='+psm)
			.success(function(data){
				$("a.profile-button").hide();
				$("a.login-button").show();
				window.location = '#/app/apartment';
			})
		 } else {
		   console.log('You are not sure');
		 }
		});
	};
})