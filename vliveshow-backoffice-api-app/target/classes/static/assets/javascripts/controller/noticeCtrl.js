/**
 * Created by ivyguo on 2016/8/26.
 */
backStart
    .controller("noticeCtrl", ['$scope','$rootScope', 'DateInit', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService','GetList','DataCtrl', 'DataSort',
        function($scope, $rootScope, DateInit, $http, $window, $state, $stateParams,SetNavRight, SearchService, GetList, DataCtrl, DataSort){ // 内容管理

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            $scope.normalDate = DateInit.normalDate;

            $scope.autoNotice = true;
            $scope.handNotice = false;


            /* 选择日期或者时间
             * json : 参数包含，作用对象，事件类型，日期格式，时间最大值设定，时间最小值设定.........
             **/
            $scope.laydate = function(json){ // json,type
                // json.choose = function (date) {
                //     $scope[type] = date;
                // }
                laydate(json);
            };

            /*切换自动和手动*/
            $scope.changeNotice = function(name1, name2){
                $scope[name1] = true;
                $scope[name2] = false;
            };




        }])