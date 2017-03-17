/**
 * Created by rex_fzhou on 2017/2/9.
 */
backStart
    .controller("rankingCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'ImgUploadService', 'PubFunction', 'HttpCallService',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, ImgUploadService, PubFunction, HttpCallService) { // 回放管理

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope, $stateParams);

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;

            $scope.vDisplay = false;
            $scope.uvDisplay = false;
            $scope.timeDisplay = false;

            $scope.searchRank = function (searchType) {
                switch (searchType){
                    case '1':
                        $scope.rankTitle = 'UV排行：';
                        $scope.loadUVRanking();
                        break;
                    case '2':
                        $scope.rankTitle = 'V票排行：';
                        $scope.loadVRanking();
                        break;
                    case '3':
                        $scope.rankTitle = '时长排行：';
                        $scope.loadTimeRanking();
                        break;
                }
            };

            $scope.loadVRanking = function () {
                $http({
                    method: 'GET',
                    url: $scope.hostName + "v1/rank/list/valentine/host/earning?token=" + $scope.tokenCode
                }).success(function(res){
                    $scope.vRankList = res;
                    $scope.vDisplay = true;
                    $scope.timeDisplay = false;
                    $scope.uvDisplay = false;
                    // console.log('rank-----'+JSON.stringify(res));
                }).error(function(res){
                    console.log(res);
                });
            };

            $scope.loadUVRanking = function () {
                $http({
                    method: 'GET',
                    url: $scope.appHostName + "v1/liveshow/TopPopularity/list"
                }).success(function(res){
                    if(res.success){
                        $scope.uvRankList = res.results.list;
                        $scope.timeDisplay = false;
                        $scope.vDisplay = false;
                        $scope.uvDisplay = true;
                    }
                    // console.log('rank-----'+JSON.stringify(res));
                }).error(function(res){
                    console.log(res);
                });
            };

            $scope.loadTimeRanking = function () {
                $http({
                    method: 'POST',
                    url: $scope.appHostName + "v1/liveshow/maxtime"
                }).success(function(res){
                    if(res.success){
                        $scope.timeRankList = res.results.list;
                        $scope.timeDisplay = true;
                        $scope.vDisplay = false;
                        $scope.uvDisplay = false;
                    }
                    // console.log('rank-----'+JSON.stringify(res));
                }).error(function(res){
                    console.log(res);
                });
            };


    }]);