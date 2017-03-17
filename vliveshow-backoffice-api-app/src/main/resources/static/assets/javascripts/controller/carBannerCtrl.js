/**
 * Created by rex_fzhou on 2017/2/23.
 */
backStart
    .controller("carBannerCtrl", ['$scope','$rootScope', '$http', '$q', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'ImgUploadService', 'HttpCallService',
        function($scope, $rootScope, $http, $q, $window, $state, $stateParams,SetNavRight, SearchService, ImgUploadService, HttpCallService){ // 内容管理

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.bannerReq = {};

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            //打开modal框
            $scope.openModal = function (idName, newFlg, id) {
                if(newFlg){
                    $scope.bannerReq = {};
                    $scope.newAd = true;
                }else {
                    $scope.getBannerDetail(id);
                    $scope.newAd = false;
                }
                if(!angular.isUndefined(id)){
                    $scope.deleteId = id;
                }
                $(idName).modal();
            };

            //提交
            $scope.submit = function (bannerInfo, idName) {
                if(bannerInfo.coverUrl === '' || bannerInfo.avatarUrl === ''){
                    SearchService.getTips('请上传图片');
                    return false;
                }
                var reqUpload = bannerInfo;
                var url = '';
                if($scope.newAd){
                    url =$scope.hostName + "v1/backoffice/loopadspace/save?token=" + $scope.tokenCode;
                }else {
                    url =$scope.hostName + "v1/backoffice/loopadspace/" + $scope.editId + "/update?token=" + $scope.tokenCode;
                }

                $http({
                    method: 'POST',
                    url: url,
                    data: reqUpload
                }).success(function(res){
                    SearchService.getTips(res.message);
                    $scope.loadAll();
                    $(idName).modal('hide');
                }).error(function(res){
                    SearchService.getTips('保存失败');
                    console.log(res);
                });
            };
            //获取详情
            $scope.getBannerDetail = function (id) {
                $http({
                    method: 'GET',
                    url: $scope.hostName + "v1/backoffice/loopadspace/" + id + "/detail?token=" + $scope.tokenCode
                }).success(function(res){
                    if(res.success){
                        $scope.bannerReq = res.results.liveLoopAdSpace;
                        $scope.editId = res.results.liveLoopAdSpace.id;
                    }
                }).error(function(res){
                    console.log(res);
                });
            };

            //删除广告
            $scope.deleteAd = function () {
                $http({
                    method: 'POST',
                    url: $scope.hostName + "v1/backoffice/loopadspace/" + $scope.deleteId + "/delete?token=" + $scope.tokenCode + "&id=" + $scope.deleteId
                }).success(function(res){
                    SearchService.getTips(res.message);
                    $('#deleteAd').modal('hide');
                    $scope.loadAll();
                }).error(function(res){
                    console.log(res);
                });
            };

            //上传图片
            $scope.upload = function (file, imgSrc) {
                if(file){
                    if(file.type == 'image/jpeg' || file.type == 'image/png'){
                        ImgUploadService.upload($scope.appHostName, $scope.tokenCode, file, function (data) {
                            if(data.success){
                                $scope['bannerReq'][imgSrc] = data.imgSrc;
                                ImgUploadService.toBase64(file, function (data) {
                                    $scope['bannerReq'][imgSrc+'Base'] = data;
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

            //加载轮播广告列表
            $scope.loadAll = function () {
                var url = $scope.hostName + "v1/backoffice/loopadspace/list?token=" + $scope.tokenCode;
                HttpCallService.getData(url).then(function (res) {
                    if(res.success){
                        $scope.carBannerList = res.results.list;
                    }
                });
            };

            $scope.loadAll();


    }]);