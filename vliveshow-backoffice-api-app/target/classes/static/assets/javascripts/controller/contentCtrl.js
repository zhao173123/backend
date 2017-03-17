/**
 * Created by ivyguo on 2016/8/12.
 */
backStart
    .controller("contentCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'ImgUploadService',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, ImgUploadService){ // 内容管理

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.advInfo = {};
            $scope.adv = {};

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            $scope.tabTemplate = "tab_adindex.html";

            $scope.blockTab = function(tabName){
                $scope.tabTemplate = "tab_"+tabName+".html";
            };

            //获取广告位详情
            $scope.getAdDetail = function (id, idName) {
                $scope.openModal(idName, false);
                $http({
                    method: 'GET',
                    url: $scope.hostName + "v1/backoffice/liveadspace/?token=" + $scope.tokenCode + "&id=" + id
                }).success(function(res){
                    if(res.success){
                        $scope.advInfo = res.results.details;
                        $scope.coverImgSrc = $scope.advInfo.coverUrl;
                        $scope.avatarImgSrc = $scope.advInfo.avatarUrl;
                    }else {
                        console.log(res);
                    }
                }).error(function(res){
                    console.log(res);
                });
            };

            //提交or编辑
            $scope.submitNewAd = function (advInfo, idName, adv) {
                if($scope.coverImgSrc === '' || $scope.avatarImgSrc === ''){
                    SearchService.getTips('请上传图片');
                    return false;
                }
                var method = '';
                if($scope.newAd){
                    if(angular.isUndefined(adv.title) ){
                        SearchService.getTips('请输入必填项');
                        return false;
                    }
                    method = 'POST';
                    adv.avatarUrl = $scope.avatarImgSrc;
                    adv.coverUrl = $scope.coverImgSrc;
                    if(angular.isUndefined(adv.position)) adv.position = 0;
                    adv.isDisabled = false;
                    adv.isDeleted = false;
                }else {
                    method = 'PUT';
                    if(!angular.isUndefined(adv) && adv.title) advInfo.title = adv.title;
                    (!angular.isUndefined(adv) && adv.position) ? advInfo.position = adv.position : advInfo.position = 0;
                    if(!angular.isUndefined(adv) && adv.outerUrl) advInfo.outerUrl = adv.outerUrl;
                    advInfo.avatarUrl = $scope.avatarImgSrc;
                    advInfo.coverUrl = $scope.coverImgSrc;
                }
                $http({
                    method: method,
                    url: $scope.hostName + "v1/backoffice/liveadspace/?token=" + $scope.tokenCode ,
                    data: $scope.newAd ? adv : advInfo
                }).success(function(res){
                    SearchService.getTips(res.message);
                    $scope.loadAll();
                    $(idName).modal('hide');
                    // console.log(res);
                }).error(function(res){
                    SearchService.getTips('保存失败');
                    console.log(res);
                });
            }

            //删除广告
            $scope.deleteAd = function () {
                $http({
                    method: 'DELETE',
                    url: $scope.hostName + "v1/backoffice/liveadspace/?token=" + $scope.tokenCode + "&id=" + $scope.deleteId
                }).success(function(res){
                    SearchService.getTips(res.message);
                    $('#deleteAd').modal('hide');
                    $scope.loadAll()
                    // console.log(res);
                }).error(function(res){
                    console.log(res);
                });
            }

            //打开modal框
            $scope.openModal = function(idName, newAd, id){
                if(newAd && newAd != ""){
                    $scope.coverImgSrc = '';
                    $scope.avatarImgSrc = '';
                    $scope.advInfo = {};
                    $scope.newAd = true;
                }else {
                    $scope.newAd = false;
                }
                if(!angular.isUndefined(id)){
                    $scope.deleteId = id;
                }
                $(idName).modal();
            };

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

            //加载广告列表
            $scope.loadAll = function () {
                $http({
                    method: 'GET',
                    url: $scope.hostName + "v1/backoffice/liveadspace/all?token=" + $scope.tokenCode
                }).success(function(res, status){
                    if(res.success){
                        $scope.adList = res.results.list;
                    }
                    // console.log(res);
                }).error(function(res, status){
                    console.log(res);
                });
            };

            $scope.loadAll();
    }]);