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

	//获取在线房间信息
	$scope.getLiveRoomInfo = function(urlParams,isCall,pageTitle){
		var urlParam = $scope.hostName + "v1/liveshow/list"+PubFunction.getUrlParams(urlParams);
		GetList.getListData({
			"currentScope":$scope,
			"isCall":isCall,
			"urlParams":urlParam,
			"pageSize":urlParams.pageSize,
			"pageNum":urlParams.pageNum,
			"pageTitle":pageTitle
		},function (data) {
			$scope.roomInfoList = data.results.list;
		},function (message) {
			SearchService.getTips(message);
		});
	};

	//翻页
	$scope.getPage = function (pageCtrl, name) {
		if($scope.currentPage == pageCtrl) return false;
		$scope.getLiveRoomInfo({
			"token":$scope.tokenCode,
			"pageSize":10,
			"pageNum":pageCtrl
		}, false, name);
	};


	// 设置priority ---- 置顶
	$scope.setPriority = function (roomId, priority) {
		// $http.post("http://124.172.174.187:8888/vliveshow-backoffice-app/v1/liveshow/priority/config?token=" + $scope.tokenCode + "&roomId="+ roomId + "&priority=" + priority).success(function(data){
		$http.post($scope.hostName + "v1/liveshow/priority/config?token=" + $scope.tokenCode + "&roomId="+ roomId + "&priority=" + priority).success(function(data){
			if(data.success){  //处理成功
				alert('保存成功');
			}else{
				alert(data.message);
			}
		}).error(function (message) {
			//请求出错
			alert(message);
		})
	};

	$scope.getLiveCount();  // 在线用户数  直播数量  嘉宾连线数量

	$scope.getLiveRoomInfo({  //在线room
		"token":$scope.tokenCode,
		"pageSize":10,
		"pageNum":1
	},true,"onlineRoom");




		
}])





