/**
 * Created by ivyguo on 2016/11/8.
 */
backStart
    .controller("bookingCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'ImgUploadService', 'PubFunction', 'HttpCallService',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, ImgUploadService, PubFunction, HttpCallService){ // 课程订阅
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            // $scope.courseTypeList = [{id:1, value:'美食'},{id:2, value:'健身'}, {id:3, value:'摄影'}, {id:4, value:'心理'}, {id:5, value:'音乐'}, {id:6, value:'绘画'},{id:7, value:'曲艺'}, {id:8, value:'舞蹈'}, {id:9, value:'魔术'},{id:10, value:'亲子'}];
            $scope.courseTypeList = [];
            $scope.maxParticipantsList = [{id:0, value:0}, {id:1, value:1},{id:2, value:2}, {id:3, value:3}, {id:4, value:4}, {id:5, value:5}, {id:6, value:6}];
            $scope.isSaveBtnDis = false;
            $scope.course = {};
            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            //上传图片
            $scope.upload = function (file, imgSrc) {
                if(file){
                    if(file.type == 'image/jpeg' || file.type == 'image/png'){
                        ImgUploadService.upload($scope.appHostName, $scope.tokenCode, file, function (data) {
                            if(data.success){
                                $scope[imgSrc] = data.imgSrc;
                                ImgUploadService.toBase64(file, function (data) {
                                    $scope[imgSrc+'Base'] = data;
                                });
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

            $scope.initAuPrice = function () {
                $scope.course.priceAudience = 0;
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
                if(strLength <= minNum || strLength >= maxNum ){
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
                    || PubFunction.isUndefinedOrNull(course.courseName) || PubFunction.isUndefinedOrNull($scope.picCover) || PubFunction.isUndefinedOrNull(course.teacherDescription)
                    || PubFunction.isUndefinedOrNull($scope.picTeacher) || PubFunction.isUndefinedOrNull(course.courseDescription) || PubFunction.isUndefinedOrNull($scope.picDescription)
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
                // if($scope.isSaveBtnDis) return false;
                if ($scope.inputValidate(course)) {
                    SearchService.getTips("请提供完整信息");
                    return false;
                }
                $scope.isSaveBtnDis = true;
                var url = $scope.hostName + "v1/course?token=" + $scope.tokenCode;
                var reqPayload = course;
                reqPayload.picCover = $scope.picCover;
                reqPayload.picTeacher = $scope.picTeacher;
                reqPayload.picDescription = $scope.picDescription;
                // reqPayload.allowAudience = course.allowAudience == 1 ? true : false;
                reqPayload.allowAudience = true;
                reqPayload.isPublished = false;
                reqPayload.isDeleted = false;
                // console.log('req---'+JSON.stringify(reqPayload));
                HttpCallService.httpCall('PUT', url, reqPayload, function (succData) {
                    SearchService.getTips("创建成功");
                    $scope.isSaveBtnDis = true;
                }, function (errData) {
                    SearchService.getTips("创建失败");
                    $scope.isSaveBtnDis = false;
                    console.log('创建失败---' + JSON.stringify(errData));
                })
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

            $scope.loadCourseType();

    }]);