/**
 * Created by ivyguo on 2017/2/28.
 */
backStart
    .controller("hotCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'ImgUploadService', 'PubFunction', 'HttpCallService',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, ImgUploadService, PubFunction, HttpCallService) { // 回放管理

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope, $stateParams);

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;
            $scope.errMsg = '';
            $scope.hostList = [];
            $scope.releaseStatus = {isDisdabled: false, text: '发布'};
            $scope.saveStatus = {isDisabled: false, text: '修改'};
            // $scope.ranking = {};
            $scope.editDisable = true;
            $scope.isNew = false;

            // 添加主播
            $scope.addHost = function(id){
                if(id == '#getHostModal'){
                    $scope.host = {position: '-1'};
                }
                $(id).modal();
            };

            //判断priority是否存在
            var hasPriority = function (priority) {
                if($scope.hostList.length > 0){
                    var arr = $scope.hostList.filter(function (item) {
                        return item.position == priority;
                    });
                    var flg;
                    (arr.length > 0) ? flg = true : flg = false;
                    return flg;
                }else {
                    return false;
                }
            };

            //删除主播
            $scope.removeHost = function (index) {
                for(var i=0; i < $scope.hostList.length; i++){
                    if(i == index){
                        $scope.hostList.splice(i, 1);
                        break;
                    }
                }
            };

            //保存本地主播List
            $scope.addHostList = function (host) {
                if(PubFunction.isUndefinedOrNull($scope.host.userId ) || $scope.host.position == '-1'){
                    SearchService.getTips('请输入主播ID和排序值');
                    return false;
                }
                if($scope.host.nickName == ''){
                    SearchService.getTips('请输入有效的主播ID');
                    return false;
                }
                if(hasPriority(host.position)){
                    SearchService.getTips('排序值已被使用');
                    return false;
                }
                host.position = parseInt(host.position);
                $scope.hostList.push(host);
                $('#getHostModal').modal('hide');
            };

            //根据userId获取昵称
            $scope.loadNickName = function (id) {
                $scope.host.nickName = '';
                if(id && id.length >= 7){
                    var url = $scope.hostName + "v1/users/" + id + "/info?token=" + $scope.tokenCode;
                    HttpCallService.httpCall('GET', url, null, function (succData) {
                        if(succData && succData.nickName != ''){
                            $scope.host.nickName = succData.nickName;
                            $scope.host.avatarUrl = JSON.parse(succData.avatars).fileName;
                            $scope.host.userId = id;
                        }else {
                            $scope.errMsg = '系统中查不到此用户！';
                        }
                    }, function (errData) {
                        $scope.errMsg = '获取用户信息失败！';
                    })
                }else {
                    $scope.errMsg = '系统中查不到此用户！';
                }
            };

            //排序
            var compare = function (o1, o2) {
                var v1 = o1.position;
                var v2 = o2.position;
                if(v1 < v2){
                    return -1;
                }else if(v1 > v2){
                    return 1;
                }else {
                    return 0;
                }
            };

            //加载数据
            $scope.loadAll = function () {
                var url = $scope.hostName + "v1/backoffice/hothost/rank/detail?token=" + $scope.tokenCode;
                HttpCallService.getData(url).then(function (data) {
                    if(data.success && !PubFunction.isUndefinedOrNull(data.results.hotHostRank)){
                        $scope.ranking = data.results.hotHostRank;
                        $scope.hostList = data.results.hotHostRank.hosts.sort(compare);
                    }
                }).then(function () {
                    if(!PubFunction.isUndefinedOrNull($scope.ranking)){
                        if($scope.ranking.subscribe){
                            $scope.releaseStatus = {isDisdabled: false, text: '撤销'};
                            $scope.saveStatus = {isDisdabled: true, text: '修改'};
                        }else {
                            $scope.releaseStatus = {isDisdabled: false, text: '发布'};
                            $scope.saveStatus = {isDisdabled: false, text: '修改'};
                        }
                    }else {
                        $scope.ranking = {title:'', position: '', outerUrl: ''};
                        $scope.isNew = true;
                    }
                });
            };

            //编辑保存
            $scope.edit = function () {
                if($scope.editDisable){
                    $scope.editDisable = false;
                    $scope.releaseStatus.isDisdabled = true;
                    $scope.saveStatus.text = '保存';
                }else {
                    if($scope.ranking.title === '' || $scope.ranking.position === ''){
                        SearchService.getTips('请输入必填项');
                        return false;
                    }
                    var url = '';
                    if($scope.isNew){
                        url = $scope.hostName + 'v1/backoffice/hothost/rank/save?token=' + $scope.tokenCode;
                    }else {
                        url = $scope.hostName + 'v1/backoffice/hothost/rank/' + $scope.ranking.id + '/update?token=' + $scope.tokenCode;
                    }
                    var reqData = $scope.ranking;
                    reqData.hosts = $scope.hostList;
                    $http.post(url, reqData).success(function (data) {
                        $scope.releaseStatus.isDisdabled = false;
                        $scope.editDisable = true;
                        $scope.saveStatus.text = '修改';
                        SearchService.getTips('保存成功');
                    }).error(function (err) {
                        SearchService.getTips('保存失败');
                    })
                }
            };

            //发布撤销
            $scope.subscribe = function () {
                var subscribeStr = '';
                $scope.ranking.subscribe ? subscribeStr = 'unsubscribe' : subscribeStr = 'subscribe';
                var url = $scope.hostName + "v1/backoffice/hothost/rank/" + $scope.ranking.id + "/"+ subscribeStr +"?token=" + $scope.tokenCode;
                $http.post(url).success(function (data) {
                    if(data.success){
                        SearchService.getTips(data.message);
                    }
                }).error(function (err) {
                    SearchService.getTips('操作失败');
                }).then(function () {
                    $scope.loadAll();
                });
            };

            $scope.loadAll();

        }]);