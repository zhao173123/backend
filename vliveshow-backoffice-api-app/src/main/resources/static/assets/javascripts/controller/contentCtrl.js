/**
 * Created by ivyguo on 2016/8/12.
 */
backStart
    .controller("contentCtrl", ['$scope','$rootScope', '$http', '$q', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'ImgUploadService', 'HttpCallService',
        function($scope, $rootScope, $http, $q, $window, $state, $stateParams,SetNavRight, SearchService, ImgUploadService, HttpCallService){ // 内容管理

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.advInfo = {};
            $scope.adv = {};
            $scope.channelType = {};
            $scope.selectedChannel = [];

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            var dataWearUp = function (advInfo) {
                $scope.title = advInfo.title;
                $scope.position = advInfo.position;
                $scope.outerUrl = advInfo.outerUrl;
                $scope.coverImgSrc = advInfo.coverUrl;
                $scope.avatarImgSrc = advInfo.avatarUrl;
                $scope.selectedChannel = advInfo.channelId;
                $scope.detailTitle = advInfo.detailTitle;
                $scope.custom = advInfo.custom;
                $scope.editId = advInfo.id;
            };

            var updateSelected = function(action, id){
                if(action == 'add' ){
                    $scope.selectedChannel.push(id);
                }
                if(action == 'remove' ){
                    $scope.selectedChannel.splice($scope.selectedChannel.indexOf(id), 1);
                }
            };
            $scope.updateSelection = function($event, id){
                var checkbox = $event.target;
                var action = (checkbox.checked?'add':'remove');
                updateSelected(action, id);
            };
            $scope.isSelected = function (id) {
                return $scope.selectedChannel.indexOf(id) >= 0;
            };

            //获取广告位详情
            $scope.getAdDetail = function (id, idName) {
                // $scope.openModal(idName, false);
                $http({
                    method: 'GET',
                    url: $scope.hostName + "v1/backoffice/liveadspace/?token=" + $scope.tokenCode + "&id=" + id
                    // url: "http://192.168.235.149:8080/vliveshow-backoffice-app/v1/backoffice/liveadspace/?token=6034289a35695d23354c1be23cd8e92e"  + "&id=" + id
                }).success(function(res){
                    if(res.success){
                        dataWearUp(res.results.details);
                    }else {
                        console.log(res);
                    }
                }).error(function(res){
                    console.log(res);
                });
            };

            //提交or编辑
            $scope.submitNewAd = function (advInfo, idName, adv) {
                if($scope.selectedChannel.length == 0){
                    SearchService.getTips('请选择频道');
                    return false;
                }
                if($scope.coverImgSrc === '' || $scope.avatarImgSrc === ''){
                    SearchService.getTips('请上传图片');
                    return false;
                }
                var method = '';
                var reqUpload = {};
                reqUpload.title = $scope.title;
                $scope.position == null ? reqUpload.position = 0 : reqUpload.position = $scope.position;
                reqUpload.outerUrl = $scope.outerUrl;
                reqUpload.detailTitle = $scope.detailTitle;
                reqUpload.custom = $scope.custom;
                reqUpload.avatarUrl = $scope.avatarImgSrc;
                reqUpload.coverUrl = $scope.coverImgSrc;
                reqUpload.channelId = $scope.selectedChannel;
                if($scope.newAd){
                    method = 'POST';
                    reqUpload.isDisabled = false;
                    reqUpload.isDeleted = false;
                }else {
                    method = 'PUT';
                    reqUpload.id = $scope.editId;
                }
                // console.log('request---'+JSON.stringify(reqUpload));
                $http({
                    method: method,
                    url: $scope.hostName + "v1/backoffice/liveadspace/?token=" + $scope.tokenCode ,
                    // url: "http://192.168.235.149:8080/vliveshow-backoffice-app/v1/backoffice/liveadspace/?token=" + $scope.tokenCode ,
                    data: reqUpload
                }).success(function(res){
                    SearchService.getTips(res.message);
                    $scope.loadAll();
                    $(idName).modal('hide');
                    // console.log(res);
                }).error(function(res){
                    SearchService.getTips('保存失败');
                    console.log(res);
                });
            };

            //删除广告
            $scope.deleteAd = function () {
                $http({
                    method: 'DELETE',
                    url: $scope.hostName + "v1/backoffice/liveadspace/?token=" + $scope.tokenCode + "&id=" + $scope.deleteId
                }).success(function(res){
                    SearchService.getTips(res.message);
                    $('#deleteAd').modal('hide');
                    $scope.loadAll();
                    // console.log(res);
                }).error(function(res){
                    console.log(res);
                });
            };

            //打开modal框
            $scope.openModal = function(idName, newAd, id){
                if(newAd && newAd != ""){
                    $scope.title = '';
                    $scope.position = 0;
                    $scope.detailTitle = '';
                    $scope.outerUrl = '';
                    $scope.selectedChannel = [];
                    $scope.custom = '';
                    $scope.coverImgSrc = '';
                    $scope.avatarImgSrc = '';
                    $scope.newAd = true;
                }else {
                    $scope.getAdDetail(id);
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

            //获取频道列表
            $scope.loadChannelType = function () {
                var url = $scope.hostName + "v1/channel/info?token=" + $scope.tokenCode + '&client_language=zh-hans';
                HttpCallService.getData(url).then(function (res) {
                    if(res.results.list && res.results.list.length > 0){
                        $scope.chanelList = res.results.list;
                        var arr = res.results.list;
                        for(var i=0; i<arr.length; i++){
                            $scope.channelType[arr[i].channelId] = arr[i].channelName;
                        }
                    }
                }).then($scope.loadAll);
            };

            //加载广告列表
            $scope.loadAll = function (channelId) {
                var url = $scope.hostName + "v1/backoffice/liveadspace/all?token=" + $scope.tokenCode
                if(channelId){
                    url += '&channelId=' + channelId;
                }
                HttpCallService.getData(url).then(function (res) {
                    if(res.success){
                        $scope.adList = res.results.list;
                        $scope.adList.map(function (item) {
                            if(item.channelId instanceof Array){
                                var channelNameList = [];
                                for(var i=0; i<item.channelId.length; i++){
                                    channelNameList.push($scope.channelType[item.channelId[i]]);
                                }
                                item.chName = channelNameList.join('，');
                            }
                            return item;
                        });
                    }
                });
            };
            // $scope.loadAll();
            $scope.loadChannelType();
    }]);