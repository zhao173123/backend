/**
 * Created by ivyguo on 2016/8/29.
 */
backStart
    .controller("violateCtrl", ['$scope','$rootScope', '$window', '$stateParams', '$http','SearchService', 'SetNavRight', 'HttpCallService',
        function($scope, $rootScope, $window, $stateParams, $http, SearchService, SetNavRight, HttpCallService){ // 内容管理
            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            $scope.dissolution = function(idName){ // 解封
                $(idName).modal();
            };

            $scope.forbidId = function (forbiddenId, lock) {
                var idList = forbiddenId.split('\n');
                var isBlock = '';
                lock ? isBlock = 'block' : isBlock = 'unlock';
                HttpCallService.httpCall("POST", $scope.hostName + "v1/backoffice/users/" + isBlock + "?token=" + $scope.tokenCode , idList,
                    function(data){  // success
                        if(data.success){  //处理成功
                            console.log('Lock Id...' + data.results);
                            lock ? SearchService.getTips("账号锁定成功") : SearchService.getTips("账号解锁成功");
                        }else{
                            SearchService.getTips(data.message);
                        }
                }, function(message){ // error
                    SearchService.getTips(message);
                });
            }


        }]);
