backStart.controller("backCtrl", ['$scope','$rootScope', '$http', '$window', 'NAV_DATA',
	function( $scope,$rootScope, $http, $window, NAV_DATA){
		//获得导航数据
		// $http.get('assets/data/nav.json')
		// 	.success(function(data) {
		// 		$scope.navData = data.navData;
		// 	});

		$scope.navData = NAV_DATA.navData;
		$scope.loginUserName = $window.sessionStorage.getItem(['loginUserName']);

}]);




