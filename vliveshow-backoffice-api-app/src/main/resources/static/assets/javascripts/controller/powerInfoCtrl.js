backStart
    .controller("powerInfoCtrl", ['$scope','$rootScope', '$http','$window', 'SearchService', 'CurrentUser', '$stateParams', 'HttpCallService', function($scope, $rootScope, $http, $window, SearchService, CurrentUser, $stateParams, HttpCallService){ // 关注用户列表
        //获得当前查看的用户的信息
        $rootScope.currentUserInfo = CurrentUser.info;
        $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
        $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;

        $scope.currentSelect = null;
        $scope.allTagType = ["消费类型1","上线规律1","消费类型2","上线规律2"];
        $scope.tagType = ["消费类型1","上线规律1","消费类型2","上线规律2"];
        $scope.channelList = [{channelId:3, channelName:'总裁来秀'}];
        $scope.selectedChannel = [];

        //获取频道列表
        // $scope.loadChannelList = function () {
        //     var url = $scope.hostName + "/v1/hostTag/info?token=" + $scope.tokenCode;
        //     HttpCallService.getData(url).then(function (res) {
        //         if(res.success){
        //             $scope.channelList = res.results.list.map(function (item) {
        //                 item.channelId = parseInt(item.channelId);
        //                 return item;
        //             });
        //         }else {
        //             SearchService.getTips("获取标签列表失败");
        //         }
        //         // console.log('res-------'+JSON.stringify(res));
        //     });
        // };
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

        $scope.saveChannel = function () {
            $http({
                method:'POST',
                url: $scope.hostName + "v1/hostChannel/save?token=" + $scope.tokenCode,
                data: {userId: $stateParams.userId, channelId: $scope.selectedChannel}
            }).success(function(data){
                if(data.success){
                    SearchService.getTips("保存成功");
                }else {
                    SearchService.getTips("保存失败");
                }
            }).error(function (message) {
                SearchService.getTips("保存失败");
            });
        };

        $scope.getUrlParams = function(json){ // 拼接URL
            var s = "?";
            var arr = [];
            for(var key in json){
                arr.push( key + "=" + json[key]);
            }
            s += arr.join("&");
            return s;
        };

        $scope.findInArr = function(value, arr){  // 在数组中查找是否存在值value
            for (var i = 0; i < arr.length; i++){
                if(value == arr[i]){
                    return true;
                }
            }
            return false;
        };
        /*******角色修改*************************/

        $scope.getRoleList = function(params, success, error){ // 修改角色 接口
            $http({
                method:'PUT',
                url: $scope.hostName + "v1/backoffice/users/role/set" + $scope.getUrlParams(params.url),
                dataType: 'json',
                data: params.data?params.data:{}
            }).success(function(data){
                // [{"HOST":true},{"SUPER_USER":true},{"SPECIAL_GUEST":true},{"AUDIENCES":true}{"TRIAL_HOST":true}]
                success && success(data);
            }).error(function (message) {
                //请求出错
                alert(message);
                error && error();
            })
        };

        // 更新旧的role值
        $scope.getCurrentRole = function(old, current){
            $scope[old] = {};
            for (var key in $scope[current]){ // 保存旧的role值
                $scope[old][key] = $scope[current][key];
            };
            return $scope[old];
        };

        // 主播和场控 转换成单选
        $scope.turnRadio = function(thisName, arr){
           if($scope.role[thisName] == true){
               for(var i = 0; i < arr.length; i++){
                   if(arr[i] != thisName){
                       $scope.role[arr[i]] = false;
                   }
               }
           }
        };

        //统计修改值
        $scope.getChangeForm = function(oldRole, newRole){
            // oldRole ----  修改前的用户角色信息
            // newRole ----  修改后用户的角色信息
            var arr = [];
            for(var keyName in oldRole){
                if(oldRole[keyName] != newRole[keyName]){  // 用户做了修改
                    //将改变的值push到数组
                    var json = {};
                    json[keyName] = newRole[keyName];
                    arr.push(json);
                }
            }
            return arr;
        };

        //初始化
        $scope.init = function(role, channelIdList){
            // console.log('list---'+channelIdList);
            channelIdList == null ? $scope.selectedChannel = [] : $scope.selectedChannel = channelIdList;

            $scope.role = {
                "SPECIAL_GUEST": false,
                "HOST": false,
                "SUPER_USER":false,
                "TRIAL_HOST": false,
                "COURSE_VIP": false
            };
            for(var i = 0; i < role.length; i++){
                $scope.role[role[i]] = true;
            }
            $scope.getCurrentRole("oldRole","role");
        };

        //提交修改角色
        $scope.submitRole = function(){
            var submitArr = $scope.getChangeForm($scope.oldRole, $scope.role);
            // 确定修改
            if(submitArr.length == 0){ //没有改变则不提交
                SearchService.getTips("保存成功");
                return false;
            }
            // 角色做了修改，提交数据
            $scope.getRoleList({  //提交
                "url":{
                    "token" : $scope.tokenCode,
                    "userId": $stateParams.userId
                },
                "data": submitArr
            },function(data){
                SearchService.getTips("保存成功");
                $rootScope.currentUserInfo.role = [];
                for(var name in $scope.role){
                    if($scope.role[name]){
                        $rootScope.currentUserInfo.role.push(name);
                    }
                }
                $scope.getCurrentRole("oldRole","role");
            },function(msg){
                SearchService.getTips("保存失败");
            });
        };

        //放弃修改角色
        $scope.cancelRole = function(){
            $scope.getCurrentRole("role","oldRole");
        };

        //初始化
        $scope.init($rootScope.currentUserInfo.role, $rootScope.currentUserInfo.channelId);

        /*******角色修改*************************/
        /*******其他标签*************************/
        var data = [
            {
                "isSel":false,
                "thisTagType":0,
                "thisTagValue":"土豪"
            },{
                "isSel":true,
                "thisTagType":1,
                "thisTagValue":"土豪"
            },{
                "isSel":false,
                "thisTagType":2,
                "thisTagValue":"土豪"
            },{
                "isSel":true,
                "thisTagType":3,
                "thisTagValue":"土豪"
            }
        ];

        $scope.customTag = data;

        // 非编辑状态
        $scope.endEdit = function(ev){
            var keyCode = window.event?ev.keyCode:ev.which;
            var _this = angular.element(ev.target);
            if(keyCode==13){ //回车
                // 关闭编辑状态
                _this.parents(".js-customTag").eq(0).removeClass("active");
            }
        };

        // 添加新增的
        $scope.changeAdd = function(){
            var _this =  $scope.currentSelect;
            // console.log(_this.val(),$scope.tagType);
            // if(!$scope.findInArr(_this.val(),$scope.tagType)){
            //     $scope.tagType.push(_this.val());
            // }
            // console.log($scope.tagType);
        };

        // 编辑状态
        $scope.editTips = function(ev){
            console.log("进入标签编辑状态");
            var _this = angular.element(ev.target);
            $scope.currentSelect =_this.parents(".js-customTag").eq(0).find("select").eq(0);
            _this.parents(".js-customTag").siblings().removeClass("active");
            _this.parents(".js-customTag").eq(0).addClass("active");
            // 其他标签
            $(".js-customTag select").select2({  //点击编辑的时候初始化
                data: $scope.tagType,
                tags: true,  // 输入新的标签被添加
                placeholder: "新的标签或者搜索标签",
                allowClear:true,
                templateSelection: function formatRepo(repo){
                    if(!$scope.findInArr(repo.text,$scope.allTagType)){
                        $scope.allTagType.push(repo.text);
                        for (var i = 0; i < $scope.allTagType.length;i++){
                            $scope.tagType[i] = $scope.allTagType[i]
                        }
                    }
                    return repo.text
                }
            })
        };

        $scope.initSelect =  function(ev){
            console.log("初始化select");
            var _this = angular.element(ev.target);
            _this.select2({
                data: $scope.tagType,
                tags: true, // 输入新的标签被添加
                placeholder: "新的标签或者搜索标签",
                allowClear:true,
                templateSelection: function formatRepo(repo){
                    if(!$scope.findInArr(repo.text,$scope.allTagType)){
                        $scope.allTagType.push(repo.text);
                        for (var i = 0; i < $scope.allTagType.length;i++){
                            $scope.tagType[i] = $scope.allTagType[i]
                        }
                    }
                    return repo.text
                }
            })

        };

        $scope.addNewTips = function(){  //添加新的其他标签
            console.log("添加自定义标签");
            //data   --------   $scope.tips            //{
            //checkbox : true，
            //title:消费类型,
            //value:土豪
            // }
            //直接将值push进数组
            // ** 状态处于可编辑
        };
        /*******其他标签*************************/

    }]);















