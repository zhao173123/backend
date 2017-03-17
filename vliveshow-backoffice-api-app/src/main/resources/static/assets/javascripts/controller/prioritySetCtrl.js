/**
 * Created by ivyguo on 2016/11/24.
 */
backStart.controller("prioritySetCtrl", ['$scope','$rootScope', '$http', '$window', 'PubFunction', 'GetList', 'SetNavRight', '$stateParams', 'HttpCallService', 'SearchService'
    ,function($scope, $rootScope, $http, $window, PubFunction, GetList, SetNavRight, $stateParams, HttpCallService, SearchService){// 流量监控
        //同步右侧的导航提示
        SetNavRight.setNavRight($rootScope,$stateParams);

        $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
        $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;

        $scope.startPage = true;
        $scope.hasRoom = false;
        $scope.hascourse = false;
        $scope.hasReplay= false;

        // filter published == true
        $scope.filterPublished = function(e){
            return e.published == true;
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
                $scope.startPage = false;
                $scope.hasRoom = true;
                $scope.roomInfoList = data.results.list;
            },function (message) {
                $scope.startPage = false;
                $scope.hasRoom = true;
                SearchService.getTips("加载出错，请刷新页面重新尝试！");
            });
        };

        //获取课程预约信息
        $scope.getCourseList = function() {
            $http({
                method:'GET',
                url: $scope.hostName + "v1/course?token="+$scope.tokenCode
            }).success(function(data){
                $scope.startPage = false;
                if(data.length > 0){
                    $scope.hasCourse = true;
                    $scope.courseInfoList = $scope.turnValue(data,["teacherId","teacherName","id","priority","published", "start"]);
                }else{
                    $scope.hasCourse = false;
                    SearchService.getTips("没有订阅");
                }
            }).error(function (message) {
                //请求出错
                $scope.startPage = false;
                $scope.hasCourse = true;
                SearchService.getTips("加载出错，请刷新页面重新尝试！");
            })
        };

        //获取回放列表
        $scope.getReplayList = function() {
            $http({
                method:'GET',
                url: $scope.hostName + "v1/backoffice/livePlayback/all?token=" + $scope.tokenCode
            }).success(function(data){
                if(data.success && data.results.list.length > 0){
                    $scope.hasReplay = true;
                    $scope.replayList = data.results.list.filter(function (item) {
                        return item.isDisabled == false;
                    });
                    if($scope.replayList.length == 0){
                        $scope.hasReplay = false;
                    }
                }else{
                    SearchService.getTips("没有回放");
                }
            }).error(function (message) {
                //请求出错
                SearchService.getTips("加载出错，请刷新页面重新尝试！");
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

        //转换值
        $scope.turnValue = function (oldArr, filterArr){ //filter value
            var newArr = [];
            for(var j = 0; j < oldArr.length;j++){
                newArr.push({});
                for(var i = 0; i < filterArr.length; i++){
                    switch (filterArr[i]){
                        case "startTime" :  newArr[j][filterArr[i]] = PubFunction.unixToDateTime(oldArr[j][filterArr[i]]);
                            break;
                        default : newArr[j][filterArr[i]] = oldArr[j][filterArr[i]];
                    }
                }
            }
            return newArr;
        };


        //直播间设置priority ---- 置顶
        $scope.setPriority = function (roomId, priority) {
            // $http.post("http://124.172.174.187:8888/vliveshow-backoffice-app/v1/liveshow/priority/config?token=" + $scope.tokenCode + "&roomId="+ roomId + "&priority=" + priority).success(function(data){
            $http.post($scope.hostName + "v1/liveshow/priority/config?token=" + $scope.tokenCode + "&roomId="+ roomId + "&priority=" + priority).success(function(data){
                if(data.success){  //处理成功
                    $scope.getLiveRoomInfo({
                        "token":$scope.tokenCode,
                        "pageSize":10,
                        "pageNum":1,
                        "excludesTrial": true
                    },true,"onlineRoom");
                    SearchService.getTips("设置成功");
                    $scope.roomId = "";
                    $scope.priority = "";
                }else{
                    SearchService.getTips("设置失败：" + data.message);
                }
            }).error(function (message) {
                //请求出错
                SearchService.getTips("设置失败");
            })
        };

        //课程预约设置priority ----- 置顶
        $scope.setPriorityCourse = function(courseId, priority){
            var url = $scope.hostName + "v1/course?token=" + $scope.tokenCode;
            HttpCallService.httpCall('PUT', url, {
                "id": courseId,
                "priority": priority
            }, function (succData) {
                if(succData.success){
                    $scope.getCourseList();
                    SearchService.getTips("设置成功");
                    $scope.courseId = "";
                    $scope.priorityCourse = "";
                }else {
                    SearchService.getTips("设置失败");
                }
            }, function (errData, status) {
                SearchService.getTips("设置失败");
            })
        };
        //回放设置position
        $scope.setPriorityReplay = function (replayId, replayPosition) {
            var url = $scope.hostName + "v1/backoffice/livePlayback/?token=" + $scope.tokenCode;
            HttpCallService.httpCall('PUT', url, {
                "id": replayId,
                "position": replayPosition
            }, function (succData) {
                if(succData.success){
                    $scope.getReplayList();
                    SearchService.getTips("设置成功");
                    $scope.replayId = "";
                    $scope.replayPosition = "";
                }else {
                    SearchService.getTips("设置失败");
                }
            }, function (errData, status) {
                SearchService.getTips("设置失败");
            })
        };

        $scope.reset = function () {
            // init living room
            $scope.getLiveRoomInfo({
                "token":$scope.tokenCode,
                "pageSize":10,
                "pageNum":1,
                "excludesTrial": true
            }, true, "onlineRoom");
            // init course list
            $scope.getCourseList(); // 课程预约
            // init replay list
            $scope.getReplayList();
        };

        $scope.reset();
    }]);





