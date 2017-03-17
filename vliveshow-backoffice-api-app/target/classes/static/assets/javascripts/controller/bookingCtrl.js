/**
 * Created by ivyguo on 2016/11/8.
 */
backStart
    .controller("bookingCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'ImgUploadService', 'PubFunction', 'HttpCallService',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, ImgUploadService, PubFunction, HttpCallService){ // 课程订阅
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.courseTypeList = [{id:1, value:'美食'},{id:2, value:'健身'}, {id:3, value:'摄影'}, {id:4, value:'心理'}, {id:5, value:'音乐'}];
            $scope.maxParticipantsList = [{id:1, value:1},{id:2, value:2}, {id:3, value:3}, {id:4, value:4}, {id:5, value:5}, {id:6, value:6}];

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            //上传图片
            $scope.upload = function (file, imgSrc) {
                if(file){
                    if(file.type == 'image/jpeg' || file.type == 'image/png'){
                        ImgUploadService.upload($scope.appHostName, $scope.tokenCode, file, function (data) {
                            if(data.success){
                                $scope[imgSrc] = data.imgSrc;
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

            //输入校验
            $scope.inputValidate = function (course) {
                if(PubFunction.isUndefinedOrNull(course.teacherId) || PubFunction.isUndefinedOrNull(course.teacherName) || PubFunction.isUndefinedOrNull(course.courseType)
                    || PubFunction.isUndefinedOrNull(course.courseName) || PubFunction.isUndefinedOrNull($scope.picCover) || PubFunction.isUndefinedOrNull(course.teacherDescription)
                    || PubFunction.isUndefinedOrNull($scope.picTeacher) || PubFunction.isUndefinedOrNull(course.courseDescription) || PubFunction.isUndefinedOrNull($scope.picDescription)
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
                reqPayload.picCover = $scope.picCover;
                reqPayload.picTeacher = $scope.picTeacher;
                reqPayload.picDescription = $scope.picDescription;
                reqPayload.allowAudience = course.allowAudience == 1 ? true : false;
                reqPayload.isPublished = false;
                reqPayload.isDeleted = false;
                // console.log('req---'+JSON.stringify(reqPayload));

                HttpCallService.httpCall('PUT', url, reqPayload, function (succData) {
                    SearchService.getTips("创建成功");
                }, function (errData) {
                    SearchService.getTips("创建失败");
                    console.log('创建失败---' + JSON.stringify(errData));
                })
            }

    }]);