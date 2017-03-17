/**
 * Created by ivyguo on 2016/11/11.
 */
backStart
    .controller("bookingListCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService','PubFunction',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, PubFunction){ // 课程订阅

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope, $stateParams);
            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.courseType = [{id:1, value:'美食'},{id:2, value:'健身'}, {id:3, value:'摄影'}, {id:4, value:'心理'}, {id:5, value:'音乐'}, {id:6, value:'绘画'},{id:7, value:'曲艺'}, {id:8, value:'舞蹈'}, {id:9, value:'魔术'},{id:10, value:'亲子'}, {id:12, value:'时尚'}];
            $scope.startPage = true;
            $scope.hasCourse = false;
            $scope.offReason = [{"id":1,"value":"老师停课"},{"id":2,"value":"没人买课"},{"id":3,"value":"测试"},{"id":4,"value":"其他"}];
            $scope.selectedOffReason = 0;
            $scope.col = 'id'; // 默认按name列排序
            $scope.desc = 0; // 默认排序条件升序
            $scope.notOtherReason = true;

            $scope.initCourseList = function() {
                $http({
                    method:'GET',
                    url: $scope.hostName + "v1/course?token="+$scope.tokenCode
                }).success(function(data){
                    $scope.startPage = false;
                    if(data.length > 0){
                        $scope.hasCourse = true;
                        var reList = data.filter(function (item) {
                            return item.deleted === false;
                        });
                        $scope.courseList = turnValue(reList,["id","courseType","teacherName","courseName","startTime","start","published","deleted","priority"]);
                        $scope.courseList.map(function (item) {
                            for(var i=0; i<$scope.courseType.length; i++){
                                if(item.courseType == $scope.courseType[i].id){
                                    item.courseTypeName = $scope.courseType[i].value;
                                }
                            }
                            return item;
                        })
                    }else{
                        $scope.hasCourse = false;
                        SearchService.getTips("没有订阅");
                    }
                }).error(function (message) {
                    //请求出错
                    $scope.startPage = false;
                    $scope.hasCourse = true;
                    SearchService.getTips("加载出错，请刷新页面重新尝试！");
                })
            };

            //下架
            $scope.offShelf = function(idName, courseId){
                $scope.currentCourse = courseId;
                $(idName).modal();
                $(".modal-backdrop").css("opacity","0.1");
            };

            //确认下架
            $scope.offShelfCommit = function(idName){
                var sReason = $scope.getOffReason();
                var isPublished = false;
                if(sReason == ""){
                    SearchService.getTips("请选择或者输入下架理由！");
                    return false;
                }
                $http({
                    method:'PATCH',
                    url: $scope.hostName + "v1/course/"+$scope.currentCourse+"/"+isPublished+"?token="+ $scope.tokenCode + "&reason="+sReason
                }).then(function(){
                    //更新下架/发布按钮
                    getOneList($scope.currentCourse, $scope.courseList).published = false;
                    SearchService.getTips("下架成功！");
                    $(idName).modal("hide");
                },function (msg) {
                    //请求出错
                    switch (msg.error_code){
                        case 30001 : SearchService.getTips("找不到相应订阅！");break;
                        case 30006 : SearchService.getTips("已经开播，无法下架操作！");break;
                    }
                });
            };

            //发布
            $scope.courseRelease = function(courseId){
                $scope.currentCourse = courseId;
                var isPublished = true;
                $http({
                    method:'PATCH',
                    url: $scope.hostName + "v1/course/"+$scope.currentCourse+"/"+isPublished+"?token="+ $scope.tokenCode
                }).success(function(data){
                    //更新下架/发布按钮
                    getOneList($scope.currentCourse, $scope.courseList).published = true;
                    SearchService.getTips("发布成功！");
                }).error(function(msg){
                    switch (msg.error_code){
                        case 30007 : SearchService.getTips("至少需要有一节课程才能开播！");break;
                        case 30009 : SearchService.getTips("第一堂开课时间必须是24小时之后！");break;
                        default: SearchService.getTips("发布失败");
                    }
                })
            };

            // 初始化列表
            $scope.initCourseList();

            // get reason
            $scope.getOffReason = function(){
                var sReason = {};
                var otherReason = $.trim($scope.otherOffReason);
                if($scope.selectedOffReason == null){
                    sReason = "";
                    $scope.notOtherReason = true;
                    $scope.otherOffReason = "";
                }else if($scope.selectedOffReason == $scope.offReason.length){
                    $scope.notOtherReason = false;
                    if(otherReason == ""){
                        sReason = "";
                    }else{
                        sReason = otherReason;
                    }
                }else{
                    $scope.notOtherReason = true;
                    $scope.otherOffReason = "";
                    sReason = $scope.offReason[$scope.selectedOffReason-1].value;
                }
                return sReason;
            };

            //删除订阅
            $scope.deleteCourse = function (id) {
                $('#deleteCourse').modal();
                $scope.deleteCourseId = id;
            };

            //确认删除订阅
            $scope.courseDeleteCommit = function () {
                $http({
                    method:'DELETE',
                    url: $scope.hostName + "v1/course/" + $scope.deleteCourseId + "?token="+ $scope.tokenCode
                }).then(function(){
                    //更新下架/发布按钮
                    $('#deleteCourse').modal('hide');
                    SearchService.getTips("删除订阅成功！");
                    $scope.initCourseList();
                },function (msg) {
                    //请求出错
                    switch (msg.error_code){
                        case 30001 : SearchService.getTips("找不到相应订阅！");break;
                        default: SearchService.getTips("删除订阅失败！");
                    }
                });
            };

            function turnValue(oldArr, filterArr){ //filter value
                var newArr = [];
                for(var j = 0; j < oldArr.length;j++){
                    newArr.push({});
                    for(var i = 0; i < filterArr.length; i++){
                        switch (filterArr[i]){
                            case "startTime" :  newArr[j][filterArr[i]] = PubFunction.unixToDateTime(oldArr[j][filterArr[i]]);
                                break;
                            default : newArr[j][filterArr[i]] = oldArr[j][filterArr[i]];
                        }
                    }
                }
                return newArr;
            };

            // get one list
            function getOneList(id, arr) {
                for(var i = 0; i < arr.length; i++){
                    if(arr[i].id == id){
                        return arr[i];
                    }
                }
            };

        }]);