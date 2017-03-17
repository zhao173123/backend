/**
 * Created by ivyguo on 2016/11/22.
 */

backStart
    .controller("messageCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams','PubFunction', 'SetNavRight', 'ImgUploadService', 'SearchService', 'HttpCallService',
        function($scope, $rootScope, $http, $window, $state, $stateParams, PubFunction, SetNavRight, ImgUploadService, SearchService, HttpCallService) { // 用户关系管理
            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope, $stateParams);
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.actList = [];
            $scope.isSending = false;

            //上传csv文件
            $scope.upload = function (file, imgSrc) {
                if(file){
                    if(file.type == 'application/vnd.ms-excel' || file.type == 'text/csv'){
                        $scope[imgSrc] = file.name;
                        ImgUploadService.upload($scope.appHostName, $scope.tokenCode, file, function (data) {
                            if(data.success){
                                $scope.fileSrc = data.imgSrc;
                                SearchService.getTips("上传成功");
                            }else {
                                $scope[imgSrc] = '';
                                SearchService.getTips("上传失败");
                            }
                        }, function () {
                            $scope[imgSrc] = '';
                            SearchService.getTips("上传失败");
                        });
                    }else {
                        SearchService.getTips("请上传格式为CSV的文件");
                    }
                }
            };

            //获取活动列表
            $scope.loadActivityList = function () {
                var url = $scope.hostName + "v1/users/phone/activityInfo?token=" + $scope.tokenCode;
                HttpCallService.httpCall('GET', url, null, function (succData) {
                    if(succData){
                        $scope.actList = succData.results.list;
                    }
                    // console.log('活动列表----'+ JSON.stringify(succData));
                }, function (errData) {
                    SearchService.getTips("获取活动列表失败");
                    console.log('获取活动列表失败---' + errData);
                })
            };

            //发送短信
            $scope.sendMsg = function () {
                if(PubFunction.isUndefinedOrNull($scope.activity)){
                    SearchService.getTips("请选择活动类型");
                    return false;
                }else if(PubFunction.isUndefinedOrNull($scope.fileSrc)){
                    SearchService.getTips("请上传CSV文件");
                    return false;
                }
                $scope.isSending = true;
                var url = $scope.hostName + "v1/users/phone/sendmultisms?token=" + $scope.tokenCode;
                var reqPayload = {};
                reqPayload.csvPath = $scope.fileSrc;
                reqPayload.activityId = $scope.activity.id;
                reqPayload.content = $scope.activity.messageContent;

                HttpCallService.httpCall('POST', url, reqPayload, function (data) {
                    if(data.success){
                        SearchService.getTips("发送成功");
                        $scope.isSending = false;
                    }else {
                        SearchService.getTips("发送失败");
                        $scope.isSending = false;
                        console.log('短信发送失败-----' + data.message);
                    }
                }, function (errData) {
                    SearchService.getTips("发送失败");
                    $scope.isSending = false;
                    console.log('短信发送失败---' + JSON.stringify(errData));
                })
            };

            // 群发短信结果
            $scope.getMessageList = function (id) {
                if(!id){
                    SearchService.getTips("请选择活动");
                    return false;
                }
                var url = $scope.hostName + "/v1/users/phone/sendResult?token="+$scope.tokenCode+"&activityId=" + id;
                HttpCallService.httpCall('GET', url, null, function (succData) {
                    if(succData){
                        $scope.messageResult = succData.results.result;
                    }
                }, function (errData) {
                    SearchService.getTips("获取短信群发状态失败");
                })
            };

            $scope.loadActivityList();

            // $scope.getMessageList();

    }]);