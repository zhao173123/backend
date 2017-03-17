/**
 * Created by ivyguo on 2017/1/5.
 */
backStart
    .controller("autoConfigCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'PubFunction', 'HttpCallService',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, PubFunction, HttpCallService) { // 回放管理

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope, $stateParams);

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.isEditDisabled = true;
            $scope.editText = '修改';

            $scope.loadConfig = function () {
                var url = $scope.hostName + "v1/channel/config?token=" + $scope.tokenCode;
                HttpCallService.getData(url).then(function (res) {
                    if(res.success){
                        $scope.configInfo = res.results.config;
                    }else {
                        SearchService.getTips('加载失败');
                    }
                })
            };

            $scope.setEdit = function (configInfo) {
                if(!$scope.isEditDisabled) $scope.save(configInfo);
                $scope.isEditDisabled = !$scope.isEditDisabled;
                $scope.editText = $scope.isEditDisabled ? '修改': '保存';
            };

            $scope.save = function (configInfo) {
                var url = $scope.hostName + "v1/channel/config/update?token=" + $scope.tokenCode;
                $http({
                    method: 'POST',
                    url: url,
                    data: configInfo
                }).success(function(res){
                    if(res.success){
                        SearchService.getTips('保存成功');
                        $scope.loadConfig();
                    }else {
                        SearchService.getTips('保存失败');
                    }
                }).error(function(res){
                    SearchService.getTips('保存失败');
                    console.log(res);
                });
            };

            $scope.cancel = function () {
                $scope.loadConfig();
                $scope.isEditDisabled = true;
                $scope.editText = '修改';
            };

            $scope.loadConfig();
        }]);