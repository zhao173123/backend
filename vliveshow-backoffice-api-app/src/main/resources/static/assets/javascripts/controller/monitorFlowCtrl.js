backStart.controller("monitorFlowCtrl", ['$scope','$rootScope', '$http', '$window', 'PubFunction', 'GetList', 'SetNavRight', '$stateParams'
	,function($scope, $rootScope, $http, $window, PubFunction, GetList, SetNavRight, $stateParams){// 流量监控
	//同步右侧的导航提示
	SetNavRight.setNavRight($rootScope,$stateParams);

	$scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
	$scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;


	/*获取在线用户数，直播在线数量以及嘉宾连线数量*/
	$scope.getLiveCount = function () {
		$http.get($scope.hostName + "/v1/backoffice/users/live/count?token=" + $scope.tokenCode).success(function(data){
			if(data.success){  //处理成功
				$scope.liveCount = {
					"user"  : data.results.liveUserCount,
					"host"  : data.results.liveHostCount,
					"guest" : data.results.liveGuestCount
				}
			}else{
				SearchService.getTips(data.message);
			}
		}).error(function (message) {
			//请求出错
			SearchService.getTips(message);
		})
	};

	//翻页
	$scope.getPage = function (pageCtrl, name) {
		if($scope.currentPage == pageCtrl) return false;
		$scope.getLiveRoomInfo({
			"token":$scope.tokenCode,
			"pageSize":10,
			"pageNum":pageCtrl,
			"excludesTrial": true
		}, false, name);
	};

	$scope.getLiveCount();  // 在线用户数  直播数量  嘉宾连线数量

}])





