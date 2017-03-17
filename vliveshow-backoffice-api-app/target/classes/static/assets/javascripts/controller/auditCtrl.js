/**
 * Created by ivyguo on 2016/8/11.
 */
backStart
    .controller("auditCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams','HttpCallService', 'PubFunction', 'SetNavRight','SearchService','GetList','DataCtrl', 'DataSort',
        function($scope, $rootScope, $http, $window, $state, $stateParams, HttpCallService, PubFunction, SetNavRight, SearchService, GetList, DataCtrl, DataSort){ //主播审核

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);


            // 初始化数据
            $scope.userIdFlg = "UserID";
            $scope.selectAll = false;
            $scope.selectReverse = false;
            $scope.auditAll = [];
            $scope.isFirst = false;
            $scope.isLast = false;
            $scope.currentPage = 1;
            $scope.pageSize = 20;

            //getDataList
            $scope.getList = function(urlParams,isCall){
                var searchField = PubFunction.getSearchParams($scope.userInfo, ["userId","mobilePhone","nickName","name"]);
                var urlParam = $scope.hostName + "v1/host/applications"+PubFunction.getUrlParams(PubFunction.concatJson(searchField,urlParams));
                GetList.getListData({
                    "currentScope":$scope,
                    "isCall":isCall,
                    "urlParams":urlParam,
                    "pageSize":urlParams.pageSize,
                    "pageNum":urlParams.pageNum
                },function (data) {
                    $scope.applications = data.results.list;
                    $scope.applyTotal = $scope.applications.length;  //data.results.total
                    for(var i = 0; i < $scope.applications.length; i++ ){
                        var gender = $scope.applications[i].gender;
                        $scope.applications[i].gender = (gender == "MALE"?"男":"女");
                    }
                },function (message) {
                    SearchService.getTips(message);
                });
            };

            $scope.loadData = function(){
                $scope.getList({
                    "token":$scope.tokenCode,
                    "pageSize":$scope.pageSize,
                    "pageNum":1,
                    "status":"IN_PROGRESS"  //待审核状态
                },true);
            };

            //初始化
            $scope.getList({
                "token":$scope.tokenCode,
                "pageSize":$scope.pageSize,
                "pageNum":1,
                "status":"IN_PROGRESS"
            },true);

            $scope.hasNotSelected = function () {
                for(var i = 0; i < $scope.applyTotal; i++){
                    if(!$scope.applications[i].state){
                        return true;
                    }
                }
                return false;
            };

            $scope.getAuditList = function () {
                $scope.auditAll.length = 0;
                for(var i = 0; i < $scope.applyTotal; i++){
                    if($scope.applications[i].state == true){
                        $scope.auditAll.push($scope.applications[i].applicationId);
                    }
                }
            };

            $scope.all = function(m){  //全选
                for(var i = 0; i < $scope.applyTotal; i++){
                    if(m){
                        $scope.applications[i].state = true;
                    }else{
                        $scope.applications[i].state = false;
                    }
                }
                $scope.getAuditList();
            };

            $scope.reverse = function(){  // 反选
                for(var i = 0; i < $scope.applyTotal; i++){
                    $scope.applications[i].state = !$scope.applications[i].state;
                }
                // 判断是否全选
                if($scope.hasNotSelected()){
                    $scope.selectAll = false;
                }else{
                    $scope.selectAll = true;
                }
                $scope.getAuditList();
            };

            $scope.checkClick = function(){ // 单个选择
                //取消反选
                $scope.selectReverse = false;
                // 判断是否全选
                if($scope.hasNotSelected()){
                    $scope.selectAll = false;
                }else{
                    $scope.selectAll = true;
                }
                $scope.getAuditList();
            };

            $scope.removePassedList = function(list){
                for(var i = 0; i<list.length;i++){
                    $("tr[data-applicationId="+list[i]+"]").remove();
                }
            };


            // 获取主播申请详情资料
            $scope.openModal = function(idName,appId,index){
                $scope.currentIndex = index;
                $http.get($scope.hostName + "v1/host/application/"+appId+"?token=" + $scope.tokenCode).success(function(data){
                    if(data.success){  //处理成功
                        $scope.applyUser = data.results;
                        $(idName).modal();
                    }else{
                        SearchService.getTips(data.message);
                    }
                }).error(function (message) {
                    //请求出错
                    SearchService.getTips(message);
                })
            };

            //上一个 下一个
            $scope.nearAudit = function(index){
                if(index == -1){ //已经是第一个
                    SearchService.getTips("已经是第一个了！");
                    return false;
                }
                if(index == $scope.applications.length){
                    SearchService.getTips("已经是最后一个了！");
                    return false;
                }
                $scope.currentIndex = index;
                $http.get($scope.hostName + "v1/host/application/"+$scope.applications[index].applicationId+"?token=" + $scope.tokenCode).success(function(data){
                    if(data.success){  //处理成功
                        $scope.applyUser = data.results;
                    }else{
                        SearchService.getTips(data.message);
                    }
                }).error(function (message) {
                    //请求出错
                    SearchService.getTips(message);
                })
            };


            // 审核
            $scope.agree = function(idName,appId,isLot){  //  isLot --- 是否是批量审核
                console.log(appId);
                if(isLot && appId.length == 0){ // 审核时判断
                    $(idName).modal();
                    return false;
                }
                appId = (typeof appId == "string")?[appId]:appId;
                HttpCallService.httpCall("POST", $scope.hostName + "v1/host/application/approve?token=" + $scope.tokenCode , {
                    "applicationIds": appId,
                    "note":"agree",
                    "action":"PASSED"
                }, function(data){  // success
                    if(data.success){  //处理成功
                        $(idName).modal('hide');
                        // $scope.removePassedList(appId);
                        $scope.getList({
                            "token":$scope.tokenCode,
                            "pageSize":$scope.pageSize,
                            "pageNum":1,
                            "status":"IN_PROGRESS"
                        },true);
                        $scope.selectAll = false;
                        $scope.selectReverse = false;
                        SearchService.getTips(appId.length + "个主播申请通过审核");
                    }else{
                        SearchService.getTips(data.message);
                    }
                }, function(message){ // error
                    //请求出错
                    SearchService.getTips(message);
                });
            };

            // 拒绝
            $scope.disagree = function(idName,appId,isLot){  //  isLot --- 是否是批量审核
                if(isLot && appId.length == 0){ // 审核时判断
                    $(idName).modal();
                    return false;
                }
                appId = (typeof appId == "string")?[appId]:appId;
                HttpCallService.httpCall("POST", $scope.hostName + "v1/host/application/approve?token=" + $scope.tokenCode , {
                    "applicationIds": appId,
                    "note":"disagree",
                    "action":"REJECTED"
                }, function(data){  // success
                    if(data.success){  //处理成功
                        $(idName).modal('hide');
                        // $scope.removePassedList(appId);
                        $scope.getList({
                            "token":$scope.tokenCode,
                            "pageSize":$scope.pageSize,
                            "pageNum":1,
                            "status":"IN_PROGRESS"
                        },true);
                        $scope.selectAll = false;
                        $scope.selectReverse = false;
                        SearchService.getTips(appId.length + "个主播申请被您拒绝");
                    }else{
                        SearchService.getTips(data.message);
                    }

                }, function(message){ // error
                    //请求出错
                    SearchService.getTips(message);

                });
            };

            /*******paging**************************/
            //分页点击
            $scope.getPage = function (pageCtrl) {
                if($scope.currentPage == pageCtrl) return false;
                // var input = inputWrap($scope.userInfo);
                $scope.getList({
                    "token":$scope.tokenCode,
                    "pageSize":$scope.pageSize,
                    "pageNum":pageCtrl,
                    "status":"IN_PROGRESS"
                },false);
            };
}])