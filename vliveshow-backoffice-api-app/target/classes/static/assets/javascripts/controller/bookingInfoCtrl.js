/**
 * Created by ivyguo on 2016/11/9.
 */
backStart.controller("bookingInfoCtrl",['$scope','$rootScope', '$http', '$window', 'SetNavRight', 'CurrentUser','$stateParams', 'HttpCallService', 'ImgUploadService', 'SearchService', 'PubFunction', 'DateInit',
    function($scope, $rootScope, $http, $window, SetNavRight, CurrentUser, $stateParams, HttpCallService, ImgUploadService, SearchService, PubFunction, DateInit){  //订阅详情

        SetNavRight.setNavRight($rootScope,$stateParams);

        //var
        $scope.timeAndDate = DateInit.timeAndDate;
        $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
        $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
        // $scope.testHostName = 'http://192.168.239.179:8080/vliveshow-backoffice-app/';
        $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
        $scope.isEdit = false; //编辑状态
        $scope.editText = "修改";
        $scope.courseId = $stateParams.classId;
        $scope.courseInfo = {};
        $scope.courseTypeList = [{id:1, value:'美食'},{id:2, value:'健身'}, {id:3, value:'摄影'}, {id:4, value:'心理'}, {id:5, value:'音乐'}];
        $scope.maxParticipantsList = [{id:1, value:1},{id:2, value:2}, {id:3, value:3}, {id:4, value:4}, {id:5, value:5}, {id:6, value:6}];
        $scope.isLessonEdit = false;
        $scope.offReason = [{"id":1,"value":"老师停课"},{"id":2,"value":"没人买课"},{"id":3,"value":"测试"},{"id":4,"value":"其他"}];
        $scope.notOtherReason = true;
        $scope.salesCount = [{is_refuneded:false, audience:0, participant:0},{is_refuneded:true, audience:0, participant:0}];

        //课程详情修改
        $scope.editDetail = function(courseInfo){
            if($scope.isEdit){
                $scope.save(courseInfo);
            }
            $scope.isEdit = !$scope.isEdit;
            $scope.editText = $scope.isEdit?"保存":"修改";
        };

        $scope.initAuPrice = function () {
            $scope.courseInfo.priceAudience = 0;
        };

        //获取课程列表
        $scope.loadLessonList = function () {
            var url = $scope.hostName + "v1/course/lesson/" + $scope.courseId + "?token=" + $scope.tokenCode;
            HttpCallService.httpCall('GET', url, null, function (succData) {
                $scope.lessonList = succData;
                for(var i=0; i < $scope.lessonList.length; i++){
                    $scope.lessonList[i].startTime = PubFunction.unixToDateTime($scope.lessonList[i].startTime);
                    $scope.lessonList[i].endTime = PubFunction.unixToDateTime($scope.lessonList[i].endTime);
                }
                // console.log('课程列表-----'+ JSON.stringify(succData));
            }, function (errData) {
                SearchService.getTips("获取课程信息失败");
                console.log('获取课程信息失败---' + errData);
            })
        };

        //上传图片
        $scope.upload = function (file, imgSrc) {
            if(file){
                if(file.type == 'image/jpeg' || file.type == 'image/png'){
                    ImgUploadService.upload($scope.appHostName, $scope.tokenCode, file, function (data) {
                        if(data.success){
                            $scope.courseInfo[imgSrc] = data.imgSrc;
                            SearchService.getTips("上传成功");
                        }else {
                            SearchService.getTips("上传失败");
                        }
                    }, function () {
                        SearchService.getTips("上传失败");
                    });
                }else {
                    SearchService.getTips("请上传格式正确的图片文件");
                }
            }
        };

        //加载课程详情数据
        $scope.loadCourseInfo = function (courseId) {
            var url = $scope.hostName + "v1/course/" + courseId + "?token=" + $scope.tokenCode;
            HttpCallService.httpCall('GET', url, null, function (succData) {
                $scope.courseInfo = succData;
                succData.allowAudience ? $scope.courseInfo.allowAudience = 1 : $scope.courseInfo.allowAudience = 2;
                succData.cancellationTime? $scope.courseInfo.cancellationTime = PubFunction.unixToDateTime(succData.cancellationTime) : $scope.courseInfo.cancellationTime = '';
                // console.log('订阅详情-----'+ JSON.stringify(succData));
            }, function (errData) {
                SearchService.getTips("获取订阅信息失败");
                console.log('获取订阅信息失败---' + errData);
            })
        };

        //输入校验
        $scope.inputValidate = function (course) {
            if(PubFunction.isUndefinedOrNull(course.teacherId) || PubFunction.isUndefinedOrNull(course.teacherName) || PubFunction.isUndefinedOrNull(course.courseType)
                || PubFunction.isUndefinedOrNull(course.courseName) || PubFunction.isUndefinedOrNull(course.picCover) || PubFunction.isUndefinedOrNull(course.teacherDescription)
                || PubFunction.isUndefinedOrNull(course.picTeacher) || PubFunction.isUndefinedOrNull(course.courseDescription) || PubFunction.isUndefinedOrNull(course.picDescription)
                || PubFunction.isUndefinedOrNull(course.lessonDescription) || PubFunction.isUndefinedOrNull(course.maxParticipants) || PubFunction.isUndefinedOrNull(course.priceParticipant)
                || PubFunction.isUndefinedOrNull(course.allowAudience)){
                return true;
            }else {
                if(course.allowAudience === 1 && PubFunction.isUndefinedOrNull(course.priceAudience)){
                    return true;
                }
                return false;
            }
        };

        //保存
        $scope.save = function (course) {
            if ($scope.inputValidate(course)) {
                SearchService.getTips("请输入必填项");
                return false;
            }
            var url = $scope.hostName + "v1/course?token=" + $scope.tokenCode;
            var reqPayload = course;
            reqPayload.allowAudience = course.allowAudience == 1 ? true : false;
            reqPayload.id = $scope.courseId;
            reqPayload.cancellationTime = Date.parse(new Date(course.cancellationTime));
            // console.log('课程保存信息----' + JSON.stringify(reqPayload));
            HttpCallService.httpCall('PUT', url, reqPayload, function (succData) {
                SearchService.getTips("保存成功");
            }, function (errData, status) {
                SearchService.getTips("保存失败");
                console.log('保存失败---' + JSON.stringify(errData));
            })
        };

        //发布
        $scope.courseRelease = function(courseId){
                var isPublished = true;
                $http({
                    method:'PATCH',
                    url: $scope.hostName + "v1/course/" + courseId + "/" + isPublished + "?token="+ $scope.tokenCode
                }).success(function(data){
                    //更新下架/发布按钮
                    $scope.courseInfo.published = true;
                    SearchService.getTips("发布成功！");
                }).error(function(msg){
                    switch (msg.error_code){
                        case 30007 : SearchService.getTips("Course should have at least one lesson!");break;
                    }
                })
            };


         //下架
        $scope.offShelf = function(idName){
            $(idName).modal();
            $(".modal-backdrop").css("opacity","0.1");
        };

        //确认下架
        $scope.offShelfCommit = function(idName, courseId){
            var sReason = $scope.getOffReason();
            var isPublished = false;
            if(sReason == ""){
                SearchService.getTips("请选择或者输入下架理由！");
                return false;
            }
            $http({
                method:'PATCH',
                url: $scope.hostName + "v1/course/"+courseId+"/"+isPublished+"?token="+ $scope.tokenCode + "&reason="+sReason
            }).then(function(){
                //更新下架/发布按钮
                $scope.courseInfo.published = false;
                SearchService.getTips("下架成功！");
                $(idName).modal("hide");
            },function (msg) {
                //请求出错
                switch (msg.error_code){
                    case 30001 : SearchService.getTips("Course not found by id!");break;
                    case 30006 : SearchService.getTips("Course already started!");break;
                }
            });
        };

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


        /* 选择日期或者时间
         * json : 参数包含，作用对象，事件类型，日期格式，时间最大值设定，时间最小值设定.........
         **/
        $scope.laydate = function(json, type){
            json.choose = function (date) {
                $scope[type] = date;
            };
            laydate(json);
        };

        //打开添加课程模态框
        $scope.addCourse = function(idName, sMark, lesson){
            if(sMark == "add"){  // 添加
                // 清空摸态框上的数据
                $scope.lessonName = '';
                $scope.startTime = '';
                $scope.endTime = '';
                $scope.isLessonEdit = false;
            }else{
                $scope.lessonName = lesson.lessonName;
                $scope.startTime = lesson.startTime;
                $scope.endTime = lesson.endTime;
                $scope.lessonId = lesson.id;
                $scope.isLessonEdit = true;
            }
            $(idName).modal();
            $(".modal-backdrop").css("opacity","0.1");
        };

        //添加课程
        $scope.submitLesson = function (idName) {
            var startTimeS = Date.parse(new Date($scope.startTime));
            var endTimeS = Date.parse(new Date($scope.endTime));
            var url = $scope.hostName + "v1/course/lesson?token=" + $scope.tokenCode;
            var reqPayload = {courseId: $scope.courseId, lessonName: $scope.lessonName, startTime: startTimeS, endTime: endTimeS};
            if($scope.isLessonEdit){
                reqPayload.id = $scope.lessonId;
            }
            // console.log('add lesson----'+JSON.stringify(reqPayload));
            HttpCallService.httpCall('PUT', url, reqPayload, function (succData) {
                $scope.loadLessonList();
                $(idName).modal('hide');
                SearchService.getTips("添加课程成功");
            }, function (errData) {
                SearchService.getTips("添加课程失败");
                console.log('添加课程失败---' + errData);
            });
        };

        //打开modal框
        $scope.openModal = function(idName, id){
            if(!angular.isUndefined(id)){
                $scope.deleteLessonId = id;
            }
            $(idName).modal();
        };

        //删除课程
        $scope.deleteLesson = function (idName) {
            $http({
                method: 'DELETE',
                url: $scope.hostName + "v1/course/lesson/" + $scope.deleteLessonId + "?token=" + $scope.tokenCode
            }).success(function(res){
                $scope.loadLessonList();
                $(idName).modal('hide');
                SearchService.getTips("删除课程成功");
            }).error(function(res){
                SearchService.getTips("删除课程失败");
                console.log('删除课程失败---' + res);
            });
        };

        //课程售卖统计
        $scope.subSaleCount = function () {
            var url = $scope.hostName + "v1/course/" + $scope.courseId + "/subscription/statistic?token=" + $scope.tokenCode;
            HttpCallService.httpCall('GET', url, null, function (succData) {
                if(succData && succData.length > 0) $scope.salesCount = succData;
                // console.log('授课详情-----'+ JSON.stringify(succData));
            }, function (errData) {
                SearchService.getTips("获取授课信息失败");
                console.log('获取授课信息失败---' + errData);
            })
        };

        //初始化
        $scope.loadCourseInfo($scope.courseId);
        $scope.loadLessonList();
        $scope.subSaleCount();

}]);