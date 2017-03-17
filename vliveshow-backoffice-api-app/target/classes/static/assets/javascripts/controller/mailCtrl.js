/**
 * Created by ivyguo on 2016/8/24.
 */
backStart
    .controller("mailCtrl", ['$scope','$rootScope', 'DateInit', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService','GetList','DataCtrl', 'DataSort',
        function($scope, $rootScope, DateInit, $http, $window, $state, $stateParams,SetNavRight, SearchService, GetList, DataCtrl, DataSort){ // 内容管理

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            $scope.roleList = [
                {name: '主播', value:'HOST'},
                {name: '特殊用户', value:'SPECIAL_GUEST'},
                {name: '场控', value:'SUPER_USER'},
                {name: '普通', value:'AUDIENCES'}
            ];
            $scope.genderList = [
                {name: '男', value:'MALE'},
                {name: '女', value:'FEMALE'}
            ]
            $scope.selectedRole = [];
            $scope.selectedGender = [];

            $scope.normalDate = DateInit.timeAndDate;

            $scope.userIdFlg = "UserID";

            /* 选择日期或者时间
             * json : 参数包含，作用对象，事件类型，日期格式，时间最大值设定，时间最小值设定.........
             **/
            $scope.laydate = function(json){ // json,type
                // json.choose = function (date) {
                //     $scope[type] = date;
                // }
                laydate(json);
            }

            /*发送站内信信息*/
            $scope.sendInfo = function(){

                console.log("发送站内信信息~");

            };

            // 查看发送内容或者查看收件人组
            $scope.openModal = function(idName){
                $(idName).modal();
            };



        }])