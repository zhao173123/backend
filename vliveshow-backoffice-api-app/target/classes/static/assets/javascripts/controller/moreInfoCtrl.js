backStart.controller("moreInfoCtrl",["$scope","$rootScope","DateInit", "$stateParams",function($scope, $rootScope,DateInit,$stateParams){  //更多操作

    $scope.tabTemplate = "tab_userinfo.html";

    $scope.blockTab = function(tabName){
        $scope.tabTemplate = "tab_"+tabName+".html";
    };

}])