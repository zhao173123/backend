/**
 * Created by rex_fzhou on 2017/2/27.
 */
backStart
    .controller("dutyCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams','HttpCallService', 'PubFunction', 'SetNavRight','SearchService','DateInit',
        function($scope, $rootScope, $http, $window, $state, $stateParams, HttpCallService, PubFunction, SetNavRight, SearchService, DateInit) { //排班

            SetNavRight.setNavRight($rootScope, $stateParams);
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;

            $scope.timeAndDate = DateInit.timeAndDate;
            $scope.userSchedule = [];
            $scope.uploadUserStr = '';
            $scope.index = '-1';
            $scope.indexSearch = '-1';

            /* 选择日期或者时间
             * json : 参数包含，作用对象，事件类型，日期格式，时间最大值设定，时间最小值设定.........
             **/
            $scope.laydate = function(json, type){
                json.choose = function (date) {
                    $scope[type] = date;
                };
                laydate(json);
            };

            //上传csv文件
            $scope.upload = function (file, imgSrc) {
                if(file){
                    if(file.type == 'application/vnd.ms-excel' || file.type == 'text/csv'){
                        $scope[imgSrc] = file.name;
                        $scope.userSchedule = [];
                        var reader = new FileReader();
                        reader.readAsText(file, 'GB2312');
                        reader.onload = function (evt) {
                            var data = evt.target.result.split('\r\n');
                            var  req = data.slice(0, data.length-1);
                            for(var i = 0; i < req.length; i++){
                                var user = {username: req[i]};
                                $scope.userSchedule.push(user);
                            }
                            SearchService.getTips("上传成功");
                            setTimeout(function () {
                                $scope.uploadUserStr = JSON.stringify(req);
                            },100)
                        };
                    }else {
                        SearchService.getTips("请上传格式为CSV的文件");
                    }
                }
            };

            //保存
            $scope.save = function () {
                var req = {};
                req.userSchedule =  JSON.stringify($scope.userSchedule);
                if($scope.index == '-1'){
                    SearchService.getTips("请选择时间段");
                    return false;
                }
                req.index =  $scope.index;

                var postCfg = {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                    transformRequest: function (req) {
                        return $.param(req);
                    }
                };

                // $http.post("http://192.168.239.24:8080/vliveshow-backoffice-app/v1/backoffice/user/schedule/save?token=", req, postCfg).success(function (resultJson) {
                $http.post($scope.hostName + "v1/backoffice/user/schedule/save?token=" + $scope.tokenCode, req, postCfg).success(function (resultJson) {
                    if (resultJson.success) {
                        SearchService.getTips("保存成功");
                    }else {
                        SearchService.getTips("保存失败");
                    }
                }).error(function (e) {
                    console.log('系统异常');
                });
            };

            //查询
            $scope.search = function () {
                // if(indexSearch == -1){
                //     indexSearch = new Date().getHours().toString();
                // }
                var indexSearch = new Date().getHours().toString();
                var url = $scope.hostName + "v1/user/schedule/liveshow?token=" + $scope.tokenCode + "&index=" + indexSearch;
                $http.get(url).success(function (data) {
                    if(data.success){
                        $scope.dutySchedule = data.results.result;
                        $scope.errMsg = '';
                    }else {
                        $scope.dutySchedule = [];
                        $scope.errMsg = data.message;
                    }
                    console.log(JSON.stringify(data));
                }).error(function (e) {
                    console.log('系统异常');
                })
            }

    }]);