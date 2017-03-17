backStart
    .controller("relationCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams','PubFunction', 'SetNavRight','SearchService','GetList','DataCtrl', 'DataSort', 'DateInit', 'ExportToCsvService',
        function($scope, $rootScope, $http, $window, $state, $stateParams, PubFunction, SetNavRight, SearchService, GetList, DataCtrl, DataSort, DateInit, ExportToCsvService){ // 用户关系管理
            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.sessionId = JSON.parse($window.sessionStorage.getItem('userInfo')).sessionId;

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
            $scope.normalDate = DateInit.normalDate;

            $scope.firstLoad = true;



            /* 选择日期或者时间
             * json : 参数包含，作用对象，事件类型，日期格式，时间最大值设定，时间最小值设定.........
             **/
            $scope.laydate = function(json, type){
                json.choose = function (date) {
                    $scope[type] = date;
                }
                laydate(json);
            }

            //排序
            $scope.columnSort =  function(columnName){
                PubFunction.sortConcat ($scope,columnName);
                var input = PubFunction.inputWrap($scope,$scope.userInfo);
                DataSort.postSortData($scope, input, 10);
            };


            //初始化：
            $scope.loadData = function(userInfo){
                $scope.firstLoad = false;
                var input = {sortFields:{userId:'asc'}};
                $scope.isFirst = false;
                $scope.isLast = false;
                $scope.isCall = true;
                $scope.currentPage = 1;
                $scope.userIdSort='asc';
                $scope.followingSort='';
                $scope.followerSort='';
                if(userInfo || $scope.selectedRole.length > 0 || $scope.selectedGender.length > 0 || $scope.startDate != '' || $scope.endDate != '') input = PubFunction.inputWrap($scope,userInfo);
                GetList.postListData({
                        "currentScope": $scope,
                        "isCall":true,
                        // "urlParams": "http://172.16.14.118:8080/vliveshow-backoffice-app/v1/backoffice/users/list?token=" + $scope.tokenCode + "&pageSize=10&pageNum=1",
                        "urlParams": $scope.hostName + "v1/backoffice/users/list?token=" + $scope.tokenCode + "&pageSize=10&pageNum=1",
                        // "urlParams": "http://124.172.174.187:8888/vliveshow-backoffice-app/v1/backoffice/users/list?token=" + $scope.tokenCode + "&pageSize=10&pageNum=1", //QA env
                        "upData" : input
                    });  //请求列表并显示  ----  token
            };

            //初始化
            // $scope.loadData();
            $scope.userIdFlg = "UserID";

            //导出
            $scope.exportData = function (userInfo) {
                $scope.userIdSort='';
                if(userInfo || $scope.selectedRole.length > 0 || $scope.selectedGender.length > 0 || $scope.startDate != '' || $scope.endDate != '') input = PubFunction.inputWrap($scope,userInfo);
                $http({
                    method: 'POST',
                    // url: 'api/v1/userExport?token=' + $scope.tokenCode,
                    url: $scope.hostName + "v1/backoffice/users/list?token=" + $scope.tokenCode + "&pageSize=1000000000&pageNum=1",
                    data: input
                }).success(function(res, status){
                    var exportList = []
                    var resList = res.results.list
                    if(resList.length > 0){
                        for(var i=0; i < resList.length; i++){
                            var res = {UserId: resList[i].userId,
                                        "昵称": resList[i].nickName,
                                        "手机号": resList[i].mobilePhone,
                                        "关注数" : resList[i].following,
                                        "粉丝数" : resList[i].follower,
                                        "渠道来源": resList[i].source,
                                        IDFA: resList[i].idfa,
                                        "注册时间": resList[i].create_time};
                            exportList.push(res);
                        }
                    }
                    ExportToCsvService.exportToCsv(exportList, 'UserExport', true);

                }).error(function(res, status){
                    SearchService.getTips("导出失败");
                    console.log(res);
                });
            }

            //查询 范围值 验证
            $scope.getSearchMin = function(name){
                if(name && name>0){
                    return name;
                }else{
                    return 0
                }
            };

            //查询 userID或者手机验证
            $scope.isUserId = function(){
                if ($scope.userIdFlg == "UserID"){
                    $scope.userInfo.mobilePhone = null;
                    return true;
                }
                $scope.userInfo.userId = null;
                return false;
            };

            var updateSelected = function(action, name, flg){
                if(action == 'add' ){
                    flg == 'Gender' ? $scope.selectedGender.push(name) : $scope.selectedRole.push(name)
                }
                if(action == 'remove' ){
                    flg == 'Gender' ? $scope.selectedGender.splice($scope.selectedGender.indexOf(name),1) : $scope.selectedRole.splice($scope.selectedRole.indexOf(name),1)
                }
            }
            $scope.updateSelection = function($event, name, flg){
                var checkbox = $event.target;
                var action = (checkbox.checked?'add':'remove');
                updateSelected(action, name, flg);
            }

            //分页点击
            $scope.getPage = function (pageCtl) {
                if($scope.currentPage == pageCtl) return false;
                var input = PubFunction.inputWrap($scope,$scope.userInfo);
                DataCtrl.postPageData($scope,{
                    token:$scope.tokenCode,
                    hostName: $scope.hostName,
                    pageSize: 10,
                    pageNum:pageCtl,
                    searchInfo: input
                });
            };

}])
