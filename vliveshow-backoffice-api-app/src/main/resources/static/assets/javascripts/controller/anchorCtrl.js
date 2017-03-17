backStart.controller("anchorCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'PubFunction', 'SetNavRight','SearchService','GetList','DataCtrl', 'DataSort',
    function($scope, $rootScope, $http, $window, $state, $stateParams, PubFunction, SetNavRight, SearchService, GetList, DataCtrl, DataSort){ //主播管理
    //同步右侧的导航提示
    SetNavRight.setNavRight($rootScope,$stateParams);

    $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
    $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;

    $scope.roleList = [
        {name: '主播', value:'HOST'},
        {name: '特殊用户', value:'SPECIAL_GUEST'},
        {name: '场控', value:'SUPER_USER'},
        {name: '普通', value:'AUDIENCES'}
    ];
    $scope.genderList = [
        {name: '男', value:'MALE'},
        {name: '女', value:'FEMALE'}
    ]
    $scope.firstLoad = true;

    //加入HOST基本限制
    $scope.addTerm = function (name, arr) {
        if(name.role){
            name.role.push.apply(name.role,arr);
        }else{
            name.role = arr;
        }
        return name;
    };
    $scope.selectedRole = [];
    $scope.selectedGender = [];


    //排序
    $scope.columnSort = function (columnName) {
        PubFunction.sortConcat ($scope,columnName);
        var input = PubFunction.inputWrap($scope,$scope.userInfo);
        $scope.addTerm(input,["HOST"]);
        DataSort.postSortData($scope, input, 10);
    }

    //初始化：
    $scope.loadData = function(userInfo){
        $scope.firstLoad = false;
        $scope.userIdFlg = "UserID";
        $scope.isFirst = false;
        $scope.isLast = false;
        $scope.isCall = true;
        $scope.currentPage = 1;
        $scope.userIdSort='';
        $scope.followingSort='';
        $scope.followerSort='';
        var input = {};
        if(userInfo || $scope.selectedRole.length > 0 || $scope.selectedGender.length > 0) input = PubFunction.inputWrap($scope,userInfo);
        $scope.addTerm(input,["HOST"]);
        GetList.postListData({
                "currentScope": $scope,
                "isCall":true,
                "urlParams": $scope.hostName + "/v1/backoffice/users/list?token=" + $scope.tokenCode + "&pageSize=10&pageNum=1", //"?token="+token+"&pageSize=10&pageNum=1",
                "upData" : input
            }
        );  //请求列表并显示  ----  token
    };

    //初始化
    // $scope.loadData();
    $scope.userIdFlg = "UserID";

    //查询 范围值 验证
    $scope.getSearchMin = function(name){
        if(name && name>0){
            return name;
        }else{
            return 0
        }
    };

    //查询 userID或者手机验证
    $scope.isUserId = function(){
        if ($scope.userIdFlg == "UserID"){
            $scope.userInfo.mobilePhone = null;
            return true;
        }
        $scope.userInfo.userId = null;
        return false;
    };

    var updateSelected = function(action, name, flg){
        if(action == 'add' ){
            flg == 'Gender' ? $scope.selectedGender.push(name) : $scope.selectedRole.push(name)
        }
        if(action == 'remove' ){
            flg == 'Gender' ? $scope.selectedGender.splice($scope.selectedGender.indexOf(name),1) : $scope.selectedRole.splice($scope.selectedRole.indexOf(name),1)
        }
    }
    $scope.updateSelection = function($event, name, flg){
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        updateSelected(action, name, flg);
    }

    //分页点击
    $scope.getPage = function (pageCtl) {
        if($scope.currentPage == pageCtl) return false;
        var input = PubFunction.inputWrap($scope,$scope.userInfo);
        $scope.addTerm(input,["HOST"]);
        DataCtrl.postPageData($scope,{
            token:$scope.tokenCode,
            token:$scope.tokenCode,
            hostName: $scope.hostName,
            pageSize: 10,
            pageNum:pageCtl,
            searchInfo: input
        });
    };

}])