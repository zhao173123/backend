/**
 * Created by ivyguo on 2017/1/5.
 */
backStart
    .controller("replayCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'ImgUploadService', 'PubFunction', 'HttpCallService',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, ImgUploadService, PubFunction, HttpCallService) { // 回放管理

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope, $stateParams);

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.channelType = {};
            $scope.selectedChannel = [];
            //打开modal
            $scope.openModal = function(idName, newflg, id){
                if(id) $scope.replayId = id;
                switch (newflg){
                    case 'new':
                        $scope.repInfo = {};
                        $scope.coverImgSrc = '';
                        $scope.avatarImgSrc = '';
                        $scope.selectedChannel = [];
                        $scope.newflg = true;
                        break;
                    case 'edit':
                        $scope.getRePlayDetail(id);
                        $scope.newflg = false;
                        break;
                    case 'delete':
                        $scope.confirmTag = '删除';
                        break;
                    case 'release':
                        $scope.confirmTag = '发布';
                        $scope.getRePlayDetail(id);
                        break;
                    case 'cancel':
                        $scope.confirmTag = '撤销';
                        $scope.getRePlayDetail(id);
                        break;
                }
                $(idName).modal();
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

            //发布or撤销
            $scope.relCanReplay = function (isDisable) {
                $scope.repInfo.isDisabled = isDisable;
                $http({
                    method: 'PUT',
                    url: $scope.hostName + "v1/backoffice/livePlayback/?token=" + $scope.tokenCode ,
                    data: $scope.repInfo
                }).success(function(res){
                    SearchService.getTips('提交成功');
                    $scope.loadReplayList();
                    $('#confirmModal').modal('hide');
                    // console.log(res);
                }).error(function(res){
                    SearchService.getTips('保存失败');
                    console.log(res);
                });
            };

            //提交or编辑
            $scope.submitNewAd = function (repInfo, idName) {
                if(angular.isUndefined(repInfo.title) ){
                    SearchService.getTips('请输入标题');
                    return false;
                }
                if($scope.coverImgSrc === '' || $scope.avatarImgSrc === ''){
                    SearchService.getTips('请上传图片');
                    return false;
                }
                if(angular.isUndefined(repInfo.videoUrl)){
                    SearchService.getTips('请输入视频链接');
                    return false;
                }
                if(angular.isUndefined(repInfo.custom)){
                    SearchService.getTips('请输入自定义文案');
                    return false;
                }
                if($scope.selectedChannel.length == 0){
                    SearchService.getTips('请选择频道');
                    return false;
                }else if($scope.selectedChannel.length == 1 && $scope.selectedChannel[0] == 1){
                    SearchService.getTips('频道不可以单独设置为推荐');
                    return false;
                }
                var method = '';
                var reqUpload = repInfo;
                repInfo.position == null ? reqUpload.position = 0 : reqUpload.position = repInfo.position;
                reqUpload.channelId = $scope.selectedChannel;
                reqUpload.coverUrl = $scope.coverImgSrc;
                reqUpload.avatarUrl = $scope.avatarImgSrc;
                if($scope.newflg){
                    method = 'POST';
                    reqUpload.isDisabled = true;
                    reqUpload.isDeleted = false;
                }else {
                    method = 'PUT';
                }
                // console.log('request---'+JSON.stringify(reqUpload));
                $http({
                    method: method,
                    url: $scope.hostName + "v1/backoffice/livePlayback/?token=" + $scope.tokenCode ,
                    data: reqUpload
                }).success(function(res){
                    SearchService.getTips(res.message);
                    $scope.loadReplayList();
                    $(idName).modal('hide');
                    // console.log(res);
                }).error(function(res){
                    SearchService.getTips('保存失败');
                    console.log(res);
                });
            };

            //获取回放详情
            $scope.getRePlayDetail = function (id) {
                $scope.coverImgSrcBase = null;
                $scope.avatarImgSrcBase = null;
                $http({
                    method: 'GET',
                    url: $scope.hostName + "v1/backoffice/livePlayback?token=" + $scope.tokenCode + "&id=" + id
                }).success(function(res){
                    if(res.success){
                        $scope.repInfo = res.results.details;
                        $scope.selectedChannel = res.results.details.channelId;
                        $scope.coverImgSrc = res.results.details.coverUrl;
                        $scope.avatarImgSrc = res.results.details.avatarUrl;
                        // console.log('replay detail--'+JSON.stringify(res));
                    }else {
                        console.log(res);
                    }
                }).error(function(res){
                    console.log(res);
                });
            };

            //删除回放
            $scope.deleteReplay = function () {
                $http({
                    method: 'DELETE',
                    url: $scope.hostName + "v1/backoffice/livePlayback/?token=" + $scope.tokenCode + "&id=" + $scope.replayId
                }).success(function(res){
                    SearchService.getTips(res.message);
                    $('#confirmModal').modal('hide');
                    $scope.loadReplayList();
                    // console.log(res);
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
                // var url = $scope.hostName + "v1/liveshow/channels?token=" + $scope.tokenCode;
                var url = $scope.hostName + "v1/channel/info?token=" + $scope.tokenCode + '&client_language=zh-hans';
                HttpCallService.getData(url).then(function (res) {
                    if(res.results.list && res.results.list.length > 0){
                        $scope.chanelList = res.results.list;
                        var arr = res.results.list;
                        for(var i=0; i<arr.length; i++){
                            $scope.channelType[arr[i].channelId] = arr[i].channelName;
                        }
                    }
                }).then($scope.loadReplayList);
            };

            //加载回放列表
            $scope.loadReplayList = function (title, channelId) {
                var url = $scope.hostName + "v1/backoffice/livePlayback/all?token=" + $scope.tokenCode;
                if(title){
                    url += '&title=' + title;
                }
                if(channelId){
                    url += '&channelId=' + channelId;
                }
                HttpCallService.getData(url).then(function (res) {
                    if(res.success){
                        $scope.replayList = res.results.list;
                        $scope.replayList.map(function (item) {
                            if(item.channelId instanceof Array){
                                var channelNameList = [];
                                for(var i=0; i<item.channelId.length; i++){
                                    channelNameList.push($scope.channelType[item.channelId[i]]);
                                }
                                item.chName = channelNameList.join('，');
                            }
                            item.createTime = PubFunction.unixToDateTime(item.createTime);
                            return item;
                        });
                    }else {
                        SearchService.getTips("加载回放列表失败");
                    }
                });
            };

            $scope.loadChannelType();

        }]);