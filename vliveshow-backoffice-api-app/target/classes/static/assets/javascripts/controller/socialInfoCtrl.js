backStart
    .controller("socialInfoCtrl", ['$scope','$rootScope', '$http', '$window','PubFunction', 'GetList', 'SearchService', '$stateParams',
        function($scope, $rootScope, $http, $window, PubFunction, GetList, SearchService, $stateParams){// 关注用户和粉丝列表

        $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
        $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;

        $scope.followingPage = {};
        $scope.followerPage = {};

        $scope.getSocialList = function(urlParams,isCall,pageTitle){
            var urlParam = $scope.hostName + "v1/backoffice/users/"+ pageTitle.substring(0,pageTitle.length-4) + "/list" +PubFunction.getUrlParams(urlParams);
            GetList.getListData({
                "currentScope":$scope,
                "isCall":isCall,
                "urlParams":urlParam,
                "pageSize":urlParams.pageSize,
                "pageNum":urlParams.pageNum,
                "pageTitle":pageTitle
            },function (data) {
                $scope[pageTitle.substring(0,pageTitle.length-4)+"User"] = data.results.list; //返回数据
                $scope[pageTitle.substring(0,pageTitle.length-4)+"Count"] = data.results.totalCount;
            },function (message) {
                SearchService.getTips(message);
            });
        };

        //翻页
        $scope.getPage = function (pageCtrl, name) {
            if($scope.currentPage == pageCtrl) return false;
            $scope.getSocialList({
                "token":$scope.tokenCode,
                "userId": $stateParams.userId,
                "pageSize":10,
                "pageNum":pageCtrl
            }, false, name + "Page");
        };

        // 关注list
        $scope.getSocialList({
            "token":$scope.tokenCode,
            "userId": $stateParams.userId,
            "pageSize":10,
            "pageNum":1
        },true,"followingPage");

        // 粉丝list
        $scope.getSocialList({  //在线room
            "token":$scope.tokenCode,
            "userId": $stateParams.userId,
            "pageSize":10,
            "pageNum":1
        },true,"followerPage");


    }])















