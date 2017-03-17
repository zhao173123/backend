/**
 * Created by ivyguo on 2016/8/12.
 */
backStart
    .controller("financeApplyCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService','GetList','DataCtrl', 'DataSort',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, GetList, DataCtrl, DataSort){ // 结算申请

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            $scope.userIdFlg = "UserID";

            $scope.openModal = function(idName){

                $(idName).modal();

            };





        }])