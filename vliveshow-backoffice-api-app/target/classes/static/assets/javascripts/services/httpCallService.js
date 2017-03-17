backStart.factory('HttpCallService', ['$http', function($http){
    var httpCallService = {};
    httpCallService.httpCall = function(method, url, req, succCB, errCB){
        var payLoad = {method: method, url: url};
        if(req) payLoad.data = req;
        $http(payLoad).success(function(res, status){
            succCB(res, status);
        }).error(function(res, status){
            errCB(res, status);
        });
    }
    return httpCallService;
}]);
