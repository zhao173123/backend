backStart
    .factory("CurrentUser",function(){
        return {
            info:{}
        };
    })
    .controller("userInfoCtrl", ['$scope','$rootScope', '$http', '$window', 'SetNavRight', 'CurrentUser','$stateParams', function($scope, $rootScope, $http, $window, SetNavRight, CurrentUser, $stateParams){ // 用户详细资料
        //console.log($stateParams.userId);
        // $stateParams ----- userId, navIndex
        SetNavRight.setNavRight($rootScope,$stateParams);

        $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
        $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;

        $scope.getGender = function(gender){  // 处理性别
            switch (gender){
                case "FEMALE" : return "女"; break;
                case "MALE" : return "男"; break;
                default : return "未知";
            }
        };

        $scope.getAttr = function(obj, json){  // 赋值
            for(var key in json){
                if(key == "gender"){
                    obj.gender = $scope.getGender(json.gender);
                }else if(key == "area"){
                    obj.area = json.area.split(" ");
                }else{
                    obj[key] = json[key];
                }
            }
        };

        $scope.setNull = function(obj, arr){  //处理后台没有的数据
            for (var i = 0; i < arr.length; i++){
                if(!obj[arr[i]]){
                    switch (arr[i]){
                        case "area" : obj[arr[i]] = [];break;
                        case "hometown" : obj[arr[i]] = [];break;
                        default:obj[arr[i]] = "";
                    }
                }
            }
        };

        $scope.getInfoResult = function(userId, success, error){
            $http({
                method:'GET',
                url:$scope.hostName + "v1/backoffice/users/detail?token=" + $scope.tokenCode + "&userId=" + userId,
                dataType: 'json',
                headers:{'Content-Type': 'application/json'}
            }).success(function(data){
                if(data.success){  // 处理成功
                    var result = data.results.user_detail;
                   // console.log(data);
                    CurrentUser.info = result;
                    $rootScope.currentUserInfo = result;
                    $scope.userInfo = {};
                    $scope.getAttr($scope.userInfo, result);
                    $scope.setNull($scope.userInfo,["loginName", "area", "hometown", "job", "idCard", "UID", "thirdparty_nikeName", "thirdparty_valid"]);
                    success && success(data);
                }else{  // 处理失败
                    alert(data.message);
                }
            }).error(function (message) {
                //请求出错
                alert(message);
                error && error(message);
            })
        };

        $scope.getInfoResult($stateParams.userId,function (data) {  //success
            //console.log($scope.userInfo.role);
           // console.log(CurrentUser.info);
        },function (message) { //error

        });

    }])
















