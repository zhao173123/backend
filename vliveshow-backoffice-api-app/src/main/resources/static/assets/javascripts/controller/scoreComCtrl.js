/**
 * Created by rex_fzhou on 2017/2/16.
 */

backStart
    .controller("scoreComCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService','GetList', 'PubFunction', 'DateInit', 'HttpCallService',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, GetList, PubFunction, DateInit, HttpCallService) { // 评价管理

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope, $stateParams);

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;

            $scope.vDisplay = false;
            $scope.uvDisplay = false;
            $scope.timeDisplay = false;
            $scope.startPage = true;
            $scope.hasData = false;
            $scope.normalDate = DateInit.normalDate;

            /* 选择日期或者时间
             * json : 参数包含，作用对象，事件类型，日期格式，时间最大值设定，时间最小值设定.........
             **/
            $scope.laydate = function(json, type){
                json.choose = function (date) {
                    $scope[type] = date;
                };
                laydate(json);
            };

            $scope.loadScoreInfo = function (req, isCall, pageTitle) {
                var urlParam = $scope.hostName + "v1/backoffice/liveShowRate/list" + PubFunction.getUrlParams(req);
                GetList.getListData({
                    "currentScope":$scope,
                    "isCall":isCall,
                    "urlParams":urlParam,
                    "pageSize":req.pageSize,
                    "pageNum":req.pageNum,
                    "pageTitle": pageTitle
                },function (data) {
                    $scope.startPage = false;
                    $scope.hasData = true;
                    $scope.scoreList = data.results.list.map(function (item) {
                        item.start_time = PubFunction.unixToDateTime(item.start_time);
                        return item;
                    });
                },function (message) {
                    $scope.startPage = false;
                    $scope.hasData = true;
                    SearchService.getTips("加载出错，请刷新页面重新尝试！");
                });
            };

            //翻页
            $scope.getPage = function (pageCtrl, name) {
                if($scope.currentPage == pageCtrl) return false;
                $scope.loadScoreInfo({
                    "token":$scope.tokenCode,
                    "pageSize":10,
                    "pageNum":pageCtrl
                }, false, name);
            };

            //查看评论观众列表
            $scope.loadScoreDetail = function (roomId) {
                var req = {};
                req.token =  $scope.tokenCode;
                req.roomId = roomId;
                var url =  $scope.hostName + "v1/liveshow/audienceVote" + PubFunction.getUrlParams(req);
                HttpCallService.getData(url).then(function (data) {
                    $scope.scoreDetail = data.results.list.map(function (item) {
                        item.rateTime = PubFunction.unixToDateTime(item.rateTime);
                        return item;
                    });
                    $('#scoreDetailModal').modal();
                }).catch(function (err) {
                        SearchService.getTips("加载出错，请刷新页面重新尝试！");
                    }
                );
            };

            //根据条件查询
            $scope.searchScoreInfo = function (req) {
                if(angular.isUndefined(req)){
                    var req = {};
                }
                if(!angular.isUndefined($scope.startDate)) req.startTime = $scope.startDate;
                if(!angular.isUndefined($scope.endDate)) req.endTime = $scope.endDate;
                req.pageSize = 10;
                req.pageNum = 1;
                req.token = $scope.tokenCode;
                $scope.loadScoreInfo(req, true, 'scoreItem');
            }

        }]);