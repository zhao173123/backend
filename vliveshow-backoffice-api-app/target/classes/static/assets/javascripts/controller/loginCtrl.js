backStart.controller('loginCtrl', ['$scope', '$state', '$window', '$rootScope', 'AuthService',
    function ($scope, $state, $window, $rootScope, AuthService){
        $scope.login = function(credentials){
            AuthService.login(credentials, function (userInfo) {
                console.log('sessionStorage----'+$window.sessionStorage['userInfo']);
                $state.go('home.relation');
            }, function(errorMsg){
                console.log("Login failed");
                $scope.errMsg = errorMsg;
            });
        }

        $scope.logout = function(){
            AuthService.logout();
            $state.go('signIn');
        }

}]);