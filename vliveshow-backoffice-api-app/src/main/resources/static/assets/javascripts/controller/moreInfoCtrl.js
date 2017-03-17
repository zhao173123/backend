backStart.controller("moreInfoCtrl",["$scope","$rootScope","DateInit", "$stateParams",function($scope, $rootScope,DateInit,$stateParams){  //更多操作

    // $scope.tabTemplate = "tab_userinfo.html";

    $scope.blockTab = function(tabName, path){
        $scope.tabTemplate = "pages/" + path + "/tab_"+tabName+".html";
    };

}]);