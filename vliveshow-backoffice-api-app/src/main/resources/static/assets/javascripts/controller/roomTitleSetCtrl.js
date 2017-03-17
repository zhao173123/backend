/**
 * Created by rex_fzhou on 2017/2/7.
 */
backStart.controller("roomTitleSetCtrl", ['$scope','$rootScope', '$http', '$window', 'PubFunction', 'GetList', 'SetNavRight', '$stateParams', 'HttpCallService', 'SearchService'
    ,function($scope, $rootScope, $http, $window, PubFunction, GetList, SetNavRight, $stateParams, HttpCallService, SearchService){// 流量监控
        //同步右侧的导航提示
        SetNavRight.setNavRight($rootScope,$stateParams);

        $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
        $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;

        $scope.startPage = true;
        $scope.hasRoom = false;
        $scope.hascourse = false;
        $scope.hasReplay= false;
        $scope.req = {host:'', title: ''};

        //查询
        $scope.searchRoomInfo = function (req) {
            $scope.getLiveRoomInfo({
                "title": req.title,
                "host": req.host,
                "token":$scope.tokenCode,
                "pageSize":10,
                "pageNum":1
            }, true, 'onlineRoom');
        };
        
        //打开莫态框
        $scope.openModal = function (idName, roomId, roomTitle) {
            $scope.currentTitle = roomTitle;
            $scope.reqRoomId = roomId;
            $(idName).modal();
        };

        //修改新标题
        $scope.submitNewTitle = function (newTitle) {
            $http.post($scope.hostName + "v1/liveshow/updateTitle?token=" + $scope.tokenCode + "&roomId="+ $scope.reqRoomId + "&title=" + newTitle).success(function(data){
            // $http.post("http://192.168.235.149:8080/vliveshow-backoffice-app/v1/liveshow/updateTitle?token=" + $scope.tokenCode + "&roomId="+ $scope.reqRoomId + "&title=" + newTitle).success(function(data){
                if(data.success){  //处理成功
                    $('#titleChangeModal').modal('hide');
                    $scope.getLiveRoomInfo({
                        "token":$scope.tokenCode,
                        "pageSize":10,
                        "pageNum":1
                    }, false, "onlineRoom");
                    console.log('data----------'+JSON.stringify(data));
                }else{
                    SearchService.getTips("设置失败：" + data.message);
                }
            }).error(function (message) {
                SearchService.getTips("设置失败");
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
                $scope.startPage = false;
                $scope.hasRoom = true;
                $scope.roomInfoList = data.results.list;
            },function (message) {
                $scope.startPage = false;
                $scope.hasRoom = true;
                SearchService.getTips("加载出错，请刷新页面重新尝试！");
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

        $scope.reset = function () {
            // init living room
            $scope.getLiveRoomInfo({
                "token":$scope.tokenCode,
                "pageSize":10,
                "pageNum":1
            }, true, "onlineRoom");
        };

        $scope.reset();
    }]);