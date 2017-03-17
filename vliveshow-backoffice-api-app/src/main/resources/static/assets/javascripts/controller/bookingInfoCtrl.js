/**
 * Created by ivyguo on 2016/11/9.
 */
backStart.controller("bookingInfoCtrl",['$scope','$rootScope', '$http', '$window', '$q', 'SetNavRight', 'CurrentUser','$stateParams', 'HttpCallService', 'ImgUploadService', 'SearchService', 'PubFunction', 'DateInit',
    function($scope, $rootScope, $http, $window, $q, SetNavRight, CurrentUser, $stateParams, HttpCallService, ImgUploadService, SearchService, PubFunction, DateInit){  //订阅详情

        SetNavRight.setNavRight($rootScope,$stateParams);

        //var
        $scope.timeAndDate = DateInit.timeAndDate;
        $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
        $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
        $scope.testHostName = 'http://192.168.239.179:8080/vliveshow-backoffice-app/';
        $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
        $scope.isEdit = false; //编辑状态
        $scope.editText = "修改";
        $scope.courseId = $stateParams.classId;
        $scope.courseInfo = {};
        $scope.courseTypeList = [];
        $scope.maxParticipantsList = [{id:0, value:0},{id:1, value:1},{id:2, value:2}, {id:3, value:3}, {id:4, value:4}, {id:5, value:5}, {id:6, value:6}];
        $scope.isLessonEdit = false;
        $scope.offReason = [{"id":1,"value":"老师停课"},{"id":2,"value":"没人买课"},{"id":3,"value":"测试"},{"id":4,"value":"其他"}];
        $scope.notOtherReason = true;
        // $scope.salesCount = [{is_refuneded:false, audience:0, participant:0},{is_refuneded:true, audience:0, participant:0}];
        $scope.salesCount = {audience:0, participant:0};
        $scope.refundCount = {audience:0, participant:0};
        $scope.isSaveBtnDis = false;
        $scope.testList = [{name: 'rex', age:10}, {name: 'rex', age:10}, {name: 'rex', age:10}, {name: 'rex', age:10}]

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

        //获取课程类型列表
        $scope.loadCourseType = function () {
            var url = $scope.hostName + "v1/course/type?token=" + $scope.tokenCode;
            HttpCallService.httpCall('GET', url, null, function (succData) {
                if(succData){
                    // console.log('course type list ----'+JSON.stringify(succData));
                    for(var i=0; i<succData.length; i++){
                        var obj = {};
                        obj.id = succData[i].id;
                        obj.value = succData[i].nameCn;
                        $scope.courseTypeList.push(obj);
                    }
                }
            }, function (error) {
                console.log('获取课程类型列表失败-----'+error);
            })
        };

        //获取课程列表
        $scope.loadLessonList = function () {
            var url = $scope.hostName + "v1/course/lesson/" + $scope.courseId + "?token=" + $scope.tokenCode;
            HttpCallService.httpCall('GET', url, null, function (succData) {
                $scope.lessonList = succData;
                for(var i=0; i < $scope.lessonList.length; i++){
                    $scope.lessonList[i].startTime = PubFunction.unixToDateTime($scope.lessonList[i].startTime);
                    $scope.lessonList[i].endTime = PubFunction.unixToDateTime($scope.lessonList[i].endTime);
                    if($scope.lessonList[i].start == 0){
                        $scope.lessonList[i].start = '未开播';
                    }else if($scope.lessonList[i].start == 1){
                        $scope.lessonList[i].start = '直播中';
                    }else if($scope.lessonList[i].start == 2){
                        $scope.lessonList[i].start = '已结束';
                    }
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
                // succData.allowAudience ? $scope.courseInfo.allowAudience = 1 : $scope.courseInfo.allowAudience = 2;
                succData.cancellationTime? $scope.cancellationTime = PubFunction.unixToDateTime(succData.cancellationTime) : $scope.cancellationTime = '';
                // console.log('订阅详情-----'+ JSON.stringify(succData));
            }, function (errData) {
                SearchService.getTips("获取订阅信息失败");
                console.log('获取订阅信息失败---' + errData);
            })
        };

        var getBLen = function(str) {
            if (str == null) return 0;
            if (typeof str != "string"){
                str += "";
            }
            return str.replace(/[^\x00-\xff]/g,"01").length;
        };
        //校验输入字符数
        $scope.validateStrLength = function (str, minNum, maxNum, msg) {
            var strLength = getBLen(str);
            if(strLength <= minNum || strLength >= (maxNum + 1) ){
                $scope[msg] = '字符数请控制在'+ minNum + '-' + maxNum + '个字符(' + minNum/2 + '-' + maxNum/2 + '个汉字)之间'
                $scope.isSaveBtnDis = true;
            }else {
                $scope[msg] = '';
                $scope.isSaveBtnDis = false;
            }
        };

        //根据userId获取昵称
        $scope.loadNickName = function (id) {
            if(id && id.length >= 7){
                var url = $scope.hostName + "v1/users/" + id + "/info?token=" + $scope.tokenCode;
                HttpCallService.httpCall('GET', url, null, function (succData) {
                    if(succData && succData.nickName != ''){
                        $scope.nickName = succData.nickName;
                    }else {
                        $scope.nickName = '系统中查不到此用户！';
                    }
                    // console.log('用户信息-----'+ JSON.stringify(succData));
                }, function (errData) {
                    $scope.nickName = '获取用户信息失败！';
                    console.log('获取用户信息失败---' + errData);
                })
            }
        };

        //输入校验
        $scope.inputValidate = function (course) {
            if(PubFunction.isUndefinedOrNull(course.teacherId) || PubFunction.isUndefinedOrNull(course.teacherName) || PubFunction.isUndefinedOrNull(course.courseType)
                || PubFunction.isUndefinedOrNull(course.courseName) || PubFunction.isUndefinedOrNull(course.picCover) || PubFunction.isUndefinedOrNull(course.teacherDescription)
                || PubFunction.isUndefinedOrNull(course.picTeacher) || PubFunction.isUndefinedOrNull(course.courseDescription) || PubFunction.isUndefinedOrNull(course.picDescription)
                || PubFunction.isUndefinedOrNull(course.lessonDescription) || PubFunction.isUndefinedOrNull(course.maxParticipants) || PubFunction.isUndefinedOrNull(course.priceParticipant)
                || PubFunction.isUndefinedOrNull(course.priceAudience)){
                return true;
            }else {
                // if(course.allowAudience === 1 && PubFunction.isUndefinedOrNull(course.priceAudience)){
                //     return true;
                // }
                return false;
            }
        };

        //保存
        $scope.save = function (course) {
            if ($scope.inputValidate(course)) {
                SearchService.getTips("请提供完整信息");
                return false;
            }
            var url = $scope.hostName + "v1/course?token=" + $scope.tokenCode;
            var reqPayload = course;
            delete reqPayload.startTime;
            delete reqPayload.cancellationTime;
            delete reqPayload.numLessons;
            // reqPayload.allowAudience = course.allowAudience == 1 ? true : false;
            reqPayload.id = $scope.courseId;
            // reqPayload.teacherDescription = course.teacherDescription.split('\n').join('\<br\/\>');
            // console.log('teachDes----'+reqPayload.teacherDescription);
            // reqPayload.cancellationTime = Date.parse(new Date((course.cancellationTime).replace(/-/g, "/")));
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
                if($scope.isEdit){
                    SearchService.getTips('请先保存');
                    return false;
                }
                $http({
                    method:'PATCH',
                    url: $scope.hostName + "v1/course/" + courseId + "/" + isPublished + "?token="+ $scope.tokenCode
                    // url: $scope.testHostName + "v1/course/" + courseId + "/" + isPublished + "?token=8af7ddca04cfc3cb5d92226adb67bf9d"
                }).success(function(data){
                    //更新下架/发布按钮
                    $scope.isEdit = false;
                    $scope.courseInfo.published = true;
                    SearchService.getTips("发布成功！");
                }).error(function(msg){
                    if(msg && msg.error_code){
                        switch (msg.error_code){
                            case 30007 : SearchService.getTips("至少需要有一节课程才能开播！");break;
                            case 30009 : SearchService.getTips("第一堂开课时间必须是24小时之后！");break;
                        }
                    }else {
                        SearchService.getTips("发布失败");
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
                // url: $scope.testHostName + "v1/course/"+courseId+"/"+isPublished+"?token=8af7ddca04cfc3cb5d92226adb67bf9d&reason="+sReason
            }).then(function(){
                //更新下架/发布按钮
                $scope.courseInfo.published = false;
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
            if(PubFunction.isUndefinedOrNull($scope.lessonName) || PubFunction.isUndefinedOrNull($scope.startTime) || PubFunction.isUndefinedOrNull($scope.endTime)){
                SearchService.getTips("请输入所有课程信息！");
                return false;
            }
            $scope.isSaveBtnDis = true;
            var startTimeS = Date.parse(new Date(($scope.startTime).replace(/-/g, "/")));
            var endTimeS = Date.parse(new Date(($scope.endTime).replace(/-/g, "/")));
            if(endTimeS <= startTimeS){
                SearchService.getTips("结束时间不能早于开始时间！");
                return false;
            }
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
                $scope.isSaveBtnDis = false;
            }, function (errData) {
                if(errData && errData.error_code == '30009'){
                    SearchService.getTips("课程开始时间请设置为24小时后");
                }else {
                    SearchService.getTips("添加课程失败");
                }
                $scope.isSaveBtnDis = false;
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
                if(succData && succData.length > 0) {
                    for(var i=0; i<succData.length; i++){
                        if(succData[i].is_refuneded){
                            $scope.refundCount = {participant: succData[i].participant, audience: succData[i].audience}
                        }else {
                            $scope.salesCount = {participant: succData[i].participant, audience: succData[i].audience}
                        }
                    }
                    // $scope.salesCount = succData;
                }
                // console.log('授课详情-----'+ JSON.stringify(succData));
            }, function (errData) {
                SearchService.getTips("获取授课信息失败");
                console.log('获取授课信息失败---' + errData);
            })
        };

        //查看购买详情
        $scope.loadPurchaseDetail = function (modelName, title, flg) {
            $scope.purchaseTitle = title;
            var url = $scope.hostName + "v1/course/subscription/info?token=" + $scope.tokenCode + "&courseId=" + $scope.courseId;
            // var url = "http://192.168.235.149:8080/vliveshow-backoffice-app/v1/course/subscription/info?token=" + $scope.tokenCode + "&courseId=" + $scope.courseId;
            if(flg) url += '&flag='+flg;
            HttpCallService.httpCall('GET', url, null, function (succData) {
                if(succData.success){
                    $scope.purchaseList = succData.results.list;
                }else {
                    SearchService.getTips("获取售课详情失败");
                    console.log("获取售课详情失败----"+succData.message);
                }
                // console.log('售课详情-----'+ JSON.stringify(succData));
            }, function (errData) {
                SearchService.getTips("获取售课详情失败");
                console.log('获取售课详情失败---' + errData);
            });
            $(modelName).modal();
        };

        //初始化
        $q.all([$scope.loadCourseType(), $scope.loadCourseInfo($scope.courseId), $scope.subSaleCount(), $scope.loadLessonList()]);
}]);