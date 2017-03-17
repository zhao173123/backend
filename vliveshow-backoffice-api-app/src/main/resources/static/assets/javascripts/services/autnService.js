backStart.factory('AuthService', ['$http', '$rootScope', '$window',
    function($http, $rootScope, $window){
        var authService = {};

        authService.login = function login(credentials, success, error){
            $http.post('/api/v1/accounts/login', credentials).success(function(loginData, status){
                $window.sessionStorage['userInfo'] = JSON.stringify(loginData);
                console.log('login Success-----'+JSON.stringify(loginData));
                $rootScope.currentUser = loginData;
                $window.sessionStorage['loginUserName'] = credentials.userName;
                if(loginData && loginData.errorCode == 1001){
                    error('Invalidated user name or password.');
                }else{
                    success(loginData);
                }

            }).error(function(errorData, status){
                console.log('Login failed;'+errorData);
                error('Login failed');
            });
        }
        authService.logout = function logout(){
            $rootScope.currentUser = null;
            $window.sessionStorage.removeItem('userInfo');
        }
        authService.isLogined = function(){
            return !!$window.sessionStorage.getItem(['userInfo']);
        }
        return authService;
}]);